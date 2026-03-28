import { Directive, Input, ElementRef, OnChanges, signal, input, inject } from '@angular/core';

@Directive({ selector: '[appCollapse]' })
export class CollapseDirective implements OnChanges {
  appCollapse = input(false);
  el = inject(ElementRef);
  // @Input('appCollapse') isCollapsed = false;

  ngOnChanges(): void {
    const element = this.el.nativeElement;
    if (this.appCollapse()) {
      element.style.maxHeight = '0';
      element.style.overflow = 'hidden';
    } else {
      element.style.maxHeight = element.scrollHeight + 'px';
      element.style.overflow = 'visible';
    }
  }
}
