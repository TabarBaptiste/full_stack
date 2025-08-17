import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  email = '';
  password = '';
  firstname = '';
  lastname = '';
  phone = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.register({
      email: this.email,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone
    }).subscribe({
      next: () => this.router.navigate(['/prestations']),
      error: err => this.error = err.error.message || 'Erreur lors de l’inscription'
    });
  }
}