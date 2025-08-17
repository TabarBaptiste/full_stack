import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/prestations']),
      error: err => this.error = err.error.message || 'Erreur de connexion'
    });
  }
}
