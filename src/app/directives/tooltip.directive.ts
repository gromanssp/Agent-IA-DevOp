import { Directive, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';

@Directive({ selector: '[appTooltip]' })
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  private tooltipEl: HTMLElement | null = null;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    // Create and position tooltip element
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.removeTooltip();
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  private removeTooltip(): void {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
}
