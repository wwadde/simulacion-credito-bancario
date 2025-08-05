import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDarkTheme$ = this.isDarkThemeSubject.asObservable();

  constructor() {
    // Aplicar el tema inicial inmediatamente
    this.applyTheme(this.isDarkThemeSubject.value);
  }

  private getInitialTheme(): boolean {
    // Primero verificar si hay preferencia guardada
    const savedTheme = localStorage.getItem('dark-theme');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    
    // Si no hay preferencia guardada, usar la del sistema
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme(): void {
    const currentTheme = this.isDarkThemeSubject.value;
    const newTheme = !currentTheme;
    
    this.isDarkThemeSubject.next(newTheme);
    this.applyTheme(newTheme);
    this.saveThemePreference(newTheme);
  }

  setTheme(isDark: boolean): void {
    this.isDarkThemeSubject.next(isDark);
    this.applyTheme(isDark);
    this.saveThemePreference(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    const html = document.documentElement;
    
    // Remover ambas clases primero
    body.classList.remove('dark-theme', 'light-theme');
    html.classList.remove('dark-theme', 'light-theme');
    
    if (isDark) {
      body.classList.add('dark-theme');
      html.classList.add('dark-theme');
    } else {
      body.classList.add('light-theme');
      html.classList.add('light-theme');
    }
  }

  private saveThemePreference(isDark: boolean): void {
    localStorage.setItem('dark-theme', isDark.toString());
  }

  getCurrentTheme(): boolean {
    return this.isDarkThemeSubject.value;
  }
}
