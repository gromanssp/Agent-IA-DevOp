import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({ selector: '[appCollapse]' })
export class CollapseDirective implements OnChanges {
  @Input('appCollapse') isCollapsed = false;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const element = this.el.nativeElement;
    if (this.isCollapsed) {
      element.style.maxHeight = '0';
      element.style.overflow = 'hidden';
    } else {
      element.style.maxHeight = element.scrollHeight + 'px';
      element.style.overflow = 'visible';
    }
  }
}
