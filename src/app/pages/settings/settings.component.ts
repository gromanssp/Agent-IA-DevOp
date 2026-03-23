import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeConfig } from '../../services/theme.service';

@Component({
  selector: 'app-settings', templateUrl: './settings.component.html', styleUrl: './settings.component.css',
  imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private themeService = inject(ThemeService);
  darkNavbarThemes: ThemeConfig[] = this.themeService.darkNavbarThemes;
  coloredNavbarThemes: ThemeConfig[] = this.themeService.coloredNavbarThemes;
  selectedTheme: string = this.themeService.getTheme();
  selectTheme(key: string): void { this.themeService.applyTheme(key); this.selectedTheme = key; }
}