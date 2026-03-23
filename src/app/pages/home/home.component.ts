import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [StatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
