import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-code-snippet',
  template: `
    <div class="code-block">
      <button class="copy-btn" (click)="copy()">{{ copied ? 'Copied!' : 'Copy' }}</button>
      <pre><code>{{ code }}</code></pre>
    </div>
  `,
  styleUrl: './code-snippet.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeSnippetComponent {
  @Input() code = '';
  copied = false;

  copy(): void {
    navigator.clipboard.writeText(this.code);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}
