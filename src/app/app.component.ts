import { Component, OnInit } from '@angular/core';
import { ToastService, Toast } from './core/toast.service';
import { ThemeService, ThemeMode } from './core/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'krebers';
  toasts: Toast[] = [];
  currentTheme: ThemeMode = 'light';

  constructor(
    public toastService: ToastService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(list => {
      this.toasts = list;
    });

    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}
