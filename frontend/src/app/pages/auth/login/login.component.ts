import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 submit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('Login réussi:', res);

        // 🔹 Navigation directe selon le rôle
        if (res.user.role === 'candidate') {
          this.router.navigate(['/candidate/dashboard']);
        } else if (res.user.role === 'recruiter') {
          this.router.navigate(['/recruiter/dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        console.error('Erreur login:', err);
      }
    });
  }
}





}
