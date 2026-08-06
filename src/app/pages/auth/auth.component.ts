import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authTab: 'login' | 'register' = 'login';
  emailInput: string = '';
  passwordInput: string = '';
  nameInput: string = '';
  isAuthLoading: boolean = false;
  authErrorMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If already logged in, redirect to profile page
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/profile']);
      }
    });
  }

  async googleSignIn(): Promise<void> {
    this.isAuthLoading = true;
    this.authErrorMessage = '';
    try {
      await this.authService.googleSignIn();
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.authErrorMessage = err.message || 'Google Sign-In failed.';
    } finally {
      this.isAuthLoading = false;
    }
  }

  async submitEmailAuth(): Promise<void> {
    if (!this.emailInput || !this.passwordInput) {
      this.authErrorMessage = 'Please enter both email and password.';
      return;
    }

    this.isAuthLoading = true;
    this.authErrorMessage = '';

    try {
      if (this.authTab === 'login') {
        await this.authService.emailSignIn(this.emailInput, this.passwordInput);
      } else {
        if (!this.nameInput) {
          this.authErrorMessage = 'Please enter your full name.';
          this.isAuthLoading = false;
          return;
        }
        await this.authService.emailSignUp(this.emailInput, this.passwordInput, this.nameInput);
      }
      this.router.navigate(['/profile']);
    } catch (err: any) {
      this.authErrorMessage = err.message || 'Authentication error.';
    } finally {
      this.isAuthLoading = false;
    }
  }

  async forgotPassword(): Promise<void> {
    if (!this.emailInput) {
      this.authErrorMessage = 'Please enter your email address above to reset password.';
      return;
    }
    this.isAuthLoading = true;
    this.authErrorMessage = '';
    try {
      await this.authService.resetPassword(this.emailInput);
    } catch (err: any) {
      this.authErrorMessage = err.message || 'Failed to send password reset email.';
    } finally {
      this.isAuthLoading = false;
    }
  }

  resetAuthForm(): void {
    this.emailInput = '';
    this.passwordInput = '';
    this.nameInput = '';
    this.authErrorMessage = '';
  }
}
