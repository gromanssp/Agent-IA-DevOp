import { Component, inject, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AgentService } from '../../services/agent.service';
import { ChatMessage, N8nResponse } from '../../models/agent.models';
import { VpsCardComponent } from '../../components/vps-card/vps-card.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [FormsModule, DatePipe, VpsCardComponent, ConfirmDialogComponent]
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  private agentService = inject(AgentService);

  messages = signal<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Hola! Soy tu asistente DevOps de CubePath. Puedo ayudarte a gestionar tus servidores VPS. Prueba con: "cuantos VPS tengo activos?" o "reinicia el servidor de produccion".',
      timestamp: new Date()
    }
  ]);

  inputText = '';
  isLoading = signal(false);
  pendingConfirm = signal<{ action: N8nResponse; messageId: string } | null>(null);
  private shouldScroll = false;

  suggestions = [
    '¿Cuántos VPS tengo activos?',
    'Reinicia el servidor de producción',
    '¿Cuánta RAM tiene el VPS staging?',
    'Crea un VPS nano en Barcelona'
  ];

  showSuggestions = computed(() => this.messages().length <= 1);

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
      role: 'user',
      content: msg,
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true
    };

    this.messages.update(msgs => [...msgs, userMessage, loadingMessage]);
    this.inputText = '';
    this.isLoading.set(true);
    this.shouldScroll = true;

    const history = this.messages()
      .filter(m => !m.loading)
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    this.agentService.sendMessage(msg, history).subscribe({
      next: (response) => this.handleResponse(response, loadingMessage.id),
      error: (err) => this.handleError(loadingMessage.id, err)
    });
  }

  useSuggestion(text: string): void {
    this.sendMessage(text);
  }

  onConfirm(confirmed: boolean): void {
    const pending = this.pendingConfirm();
    if (!pending) return;

    if (confirmed) {
      const loadingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        loading: true
      };
      this.messages.update(msgs => [...msgs, loadingMessage]);
      this.isLoading.set(true);
      this.shouldScroll = true;

      this.agentService.confirmAction(
        pending.action.action,
        pending.action.vps_id
      ).subscribe({
        next: (response) => this.handleResponse(response, loadingMessage.id),
        error: (err) => this.handleError(loadingMessage.id, err)
      });
    } else {
      const cancelMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Acción cancelada. ¿En qué más puedo ayudarte?',
        timestamp: new Date()
      };
      this.messages.update(msgs => [...msgs, cancelMsg]);
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

  private handleResponse(response: N8nResponse, loadingId: string): void {
    this.isLoading.set(false);

    const assistantMessage: ChatMessage = {
      id: loadingId,
      role: 'assistant',
      content: response.user_message,
      timestamp: new Date(),
      action: response
    };

    if (response.confirm_required) {
      assistantMessage.confirmPending = true;
      this.pendingConfirm.set({ action: response, messageId: loadingId });
    }

    this.messages.update(msgs =>
      msgs.map(m => m.id === loadingId ? assistantMessage : m)
    );
    this.shouldScroll = true;
  }

  private handleError(loadingId: string, error: unknown): void {
    this.isLoading.set(false);
    const errorMsg = error instanceof Error ? error.message : 'Error de conexión con el servidor';

    this.messages.update(msgs =>
      msgs.map(m => m.id === loadingId ? {
        ...m,
        loading: false,
        content: `Error: ${errorMsg}. Verifica que n8n esté corriendo y el webhook esté activo.`
      } : m)
    );
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
