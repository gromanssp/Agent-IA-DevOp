import {
  Component,
  inject,
  signal,
  computed,
  viewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { ChatSuggestionsService } from '../../services/chat-suggestions.service';
import {
  AgentResponse,
  ChatMessage,
  ChatRole,
  VpsAction,
} from '../../models';
import { VpsCardComponent } from '../../components/vps-card/vps-card.component';
import { VpsListComponent } from '../../components/vps-list/vps-list.component';
import { VpsMetricsComponent } from '../../components/vps-metrics/vps-metrics.component';
import { VpsPlansComponent } from '../../components/vps-plans/vps-plans.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [FormsModule, DatePipe, VpsCardComponent, VpsListComponent, VpsMetricsComponent, VpsPlansComponent, ConfirmDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewChecked, OnInit, OnDestroy {
  private messagesContainer = viewChild<ElementRef>('messagesContainer');
  private messageInput = viewChild<ElementRef>('messageInput');

  private agentService = inject(AgentService);
  private chatSuggestions = inject(ChatSuggestionsService);
  private suggestionSub?: Subscription;

  readonly VpsAction = VpsAction;
  readonly ChatRole = ChatRole;

  messages = signal<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: ChatRole.ASSISTANT,
      content:
        'Hola! Soy tu asistente DevOps de CubePath. Puedo ayudarte a gestionar tus servidores VPS. Prueba con: "cuantos VPS tengo activos?" o "reinicia el servidor de produccion".',
      timestamp: new Date(),
    },
  ]);

  inputText = '';
  isLoading = signal(false);
  pendingConfirm = signal<{ action: AgentResponse; messageId: string } | null>(
    null,
  );
  private shouldScroll = false;

  suggestions = [
    '¿Cuántos VPS tengo activos?',
    'Reinicia el servidor de producción',
    '¿Cuánta RAM tiene el VPS staging?',
    'Muestra las metricas del VPS 22897',
  ];

  showSuggestions = computed(() => this.messages().length <= 1);

  ngOnInit(): void {
    this.suggestionSub = this.chatSuggestions.suggestion$.subscribe((text) => {
      this.sendMessage(text);
    });
  }

  ngOnDestroy(): void {
    this.suggestionSub?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(text?: string): void {
    const msg = (text ?? this.inputText).trim();
    if (!msg || this.isLoading()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: ChatRole.USER,
      content: msg,
      timestamp: new Date(),
    };

    console.log('User input:', msg);
    const loadingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: ChatRole.ASSISTANT,
      content: '',
      timestamp: new Date(),
      loading: true,
    };

    this.messages.update((msgs) => [...msgs, userMessage, loadingMessage]);
    this.inputText = '';
    this.isLoading.set(true);
    this.shouldScroll = true;

    const history = this.messages()
      .filter((m) => !m.loading)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    this.agentService.sendMessage(msg, history).subscribe({
      next: (response) => {
        console.log('Received response from n8n:', response);
        this.handleResponse(response, loadingMessage.id);
      },
      error: (err) => this.handleError(loadingMessage.id, err),
    });
  }

  useSuggestion(text: string): void {
    this.sendMessage(text);
  }

  onConfirm(result: { confirmed: boolean; vpsId: string | null }): void {
    const pending = this.pendingConfirm();
    if (!pending) return;

    if (result.confirmed) {
      const loadingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: ChatRole.ASSISTANT,
        content: '',
        timestamp: new Date(),
        loading: true,
      };
      this.messages.update((msgs) => [...msgs, loadingMessage]);
      this.isLoading.set(true);
      this.shouldScroll = true;

      this.agentService
        .confirmAction(pending.action.action, result.vpsId)
        .subscribe({
          next: (response) => this.handleResponse(response, loadingMessage.id),
          error: (err) => this.handleError(loadingMessage.id, err),
        });
    } else {
      const cancelMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: ChatRole.ASSISTANT,
        content: 'Acción cancelada. ¿En qué más puedo ayudarte?',
        timestamp: new Date(),
      };
      this.messages.update((msgs) => [...msgs, cancelMsg]);
      this.shouldScroll = true;
    }

    this.pendingConfirm.set(null);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private handleResponse(
    response: AgentResponse | null,
    loadingId: string,
  ): void {
    this.isLoading.set(false);

    if (!response) {
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === loadingId
            ? {
              ...m,
              loading: false,
              content:
                'Error: No se recibió respuesta del agente. Verifica que n8n esté corriendo y el webhook esté activo.',
            }
            : m,
        ),
      );
      this.shouldScroll = true;
      return;
    }

    const assistantMessage: ChatMessage = {
      id: loadingId,
      role: ChatRole.ASSISTANT,
      content: response.user_message,
      timestamp: new Date(),
      action: response,
      vpsData: response.vpsData,
      metricsData: response.metricsData,
      plansData: response.plansData,
    };

    if (response.confirm_required) {
      assistantMessage.confirmPending = true;
      this.pendingConfirm.set({ action: response, messageId: loadingId });
    }

    this.messages.update((msgs) =>
      msgs.map((m) => (m.id === loadingId ? assistantMessage : m)),
    );
    this.shouldScroll = true;
  }

  private handleError(loadingId: string, error: unknown): void {
    this.isLoading.set(false);
    const errorMsg =
      error instanceof Error
        ? error.message
        : 'Error de conexión con el servidor';

    this.messages.update((msgs) =>
      msgs.map((m) =>
        m.id === loadingId
          ? {
            ...m,
            loading: false,
            content: `Error: ${errorMsg}. Verifica que n8n esté corriendo y el webhook esté activo.`,
          }
          : m,
      ),
    );
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
