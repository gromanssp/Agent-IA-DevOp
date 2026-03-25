import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  styles: [':host { display: block; height: 100%; }'],
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
