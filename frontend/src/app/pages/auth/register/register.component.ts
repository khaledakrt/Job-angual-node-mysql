import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // <-- ajout ici
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['candidate', Validators.required],
      phone: [''],      // pour candidat
      address: [''],    // pour candidat
      company: ['']     // pour recruteur
    });

    // Mettre à jour les validators dynamiquement selon le rôle
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'candidate') {
        this.registerForm.get('phone')?.setValidators(Validators.required);
        this.registerForm.get('address')?.setValidators(Validators.required);
        this.registerForm.get('company')?.clearValidators();
      } else if (role === 'recruiter') {
        this.registerForm.get('company')?.setValidators(Validators.required);
        this.registerForm.get('phone')?.clearValidators();
        this.registerForm.get('address')?.clearValidators();
      }
      // Mettre à jour l’état de validité après modification
      this.registerForm.get('phone')?.updateValueAndValidity();
      this.registerForm.get('address')?.updateValueAndValidity();
      this.registerForm.get('company')?.updateValueAndValidity();
    });
  }

  submit() {
    if (this.registerForm.valid) {
      // Nettoyer les champs non nécessaires avant l’envoi
      const data = { ...this.registerForm.value };
      if (data.role === 'candidate') delete data.company;
      if (data.role === 'recruiter') {
        delete data.phone;
        delete data.address;
      }

      this.authService.register(data).subscribe({
  next: (res) => {
    console.log('Token reçu:', res.token); // <-- ajoute ça
    this.router.navigate(['/login']);
  },
  error: (err) => this.errorMessage = err.error?.message || 'Erreur lors de l’inscription'
});

    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
    }
  }
}
