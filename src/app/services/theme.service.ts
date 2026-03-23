import { Injectable } from '@angular/core';

export interface ThemeConfig {
  key: string;
  name: string;
  primary: string;
  secondary: string;
  gradientHover: string;
  navbarBg: string;
  navbarText: string;
  navbarMode: 'dark' | 'colored';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly COLORS = [
    { key: 'indigo', name: 'Indigo', primary: '#6366f1', secondary: '#8b5cf6', gradientHover: '#818cf8, #a78bfa' },
    { key: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#2563eb', gradientHover: '#60a5fa, #3b82f6' },
    { key: 'green', name: 'Green', primary: '#10b981', secondary: '#059669', gradientHover: '#34d399, #10b981' },
    { key: 'purple', name: 'Purple', primary: '#a855f7', secondary: '#7c3aed', gradientHover: '#c084fc, #a78bfa' },
    { key: 'red', name: 'Red', primary: '#ef4444', secondary: '#dc2626', gradientHover: '#f87171, #ef4444' },
    { key: 'teal', name: 'Teal', primary: '#14b8a6', secondary: '#0d9488', gradientHover: '#2dd4bf, #14b8a6' },
  ];

  themes: ThemeConfig[] = [
    ...ThemeService.COLORS.map(c => ({ ...c, navbarBg: '', navbarText: '', navbarMode: 'dark' as const })),
    ...ThemeService.COLORS.map(c => ({
      ...c, key: c.key + '-nav',
      navbarBg: 'linear-gradient(135deg, ' + c.primary + ' 0%, ' + c.secondary + ' 100%)',
      navbarText: '#ffffff', navbarMode: 'colored' as const,
    })),
  ];

  get darkNavbarThemes(): ThemeConfig[] { return this.themes.filter(t => t.navbarMode === 'dark'); }
  get coloredNavbarThemes(): ThemeConfig[] { return this.themes.filter(t => t.navbarMode === 'colored'); }

  constructor() { this.applyTheme(this.getTheme()); }

  applyTheme(key: string): void {
    const theme = this.themes.find(t => t.key === key);
    if (!theme) return;
    const style = document.documentElement.style;
    style.setProperty('--accent-primary', theme.primary);
    style.setProperty('--accent-secondary', theme.secondary);
    style.setProperty('--accent-gradient', 'linear-gradient(135deg, ' + theme.primary + ' 0%, ' + theme.secondary + ' 100%)');
    const [hoverStart, hoverEnd] = theme.gradientHover.split(', ');
    style.setProperty('--accent-gradient-hover', 'linear-gradient(135deg, ' + hoverStart + ' 0%, ' + hoverEnd + ' 100%)');
    if (theme.navbarBg) {
      style.setProperty('--navbar-bg', theme.navbarBg);
      style.setProperty('--navbar-text', theme.navbarText);
      style.setProperty('--navbar-text-secondary', 'rgba(255,255,255,0.8)');
      style.setProperty('--navbar-text-muted', 'rgba(255,255,255,0.55)');
      style.setProperty('--navbar-hover-bg', 'rgba(255,255,255,0.15)');
      style.setProperty('--navbar-border', '1px solid rgba(255,255,255,0.18)');
      style.setProperty('--navbar-search-bg', 'rgba(255,255,255,0.15)');
      style.setProperty('--navbar-search-border', 'rgba(255,255,255,0.25)');
    } else {
      ['--navbar-bg','--navbar-text','--navbar-text-secondary','--navbar-text-muted',
       '--navbar-hover-bg','--navbar-border','--navbar-search-bg','--navbar-search-border'
      ].forEach(p => style.removeProperty(p));
    }
    localStorage.setItem('groman-theme', key);
  }

  getTheme(): string { return localStorage.getItem('groman-theme') || 'indigo'; }
}
