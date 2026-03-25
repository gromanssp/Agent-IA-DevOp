import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
  darkNavbarThemes: ThemeConfig[] = this.themeService.darkNavbarThemes;
  coloredNavbarThemes: ThemeConfig[] = this.themeService.coloredNavbarThemes;
  selectedTheme = signal(this.themeService.getTheme());

  selectTheme(key: string): void {
    this.themeService.applyTheme(key);
    this.selectedTheme.set(key);
  }
}
