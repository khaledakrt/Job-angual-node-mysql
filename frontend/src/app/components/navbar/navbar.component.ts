// src/app/components/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<nav class="bg-white shadow-md px-4 py-3 flex justify-between items-center">
  <!-- Logo -->
  <a routerLink="/" class="text-xl font-bold text-blue-600">JobPortal</a>

  <!-- Menu desktop -->
  <div class="hidden md:flex space-x-4 items-center">
    <a routerLink="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">Accueil</a>
    <a routerLink="/jobs" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">Offres d'emploi</a>

    <!-- Candidat connecté -->
    <a *ngIf="isLoggedIn && userRole === 'candidate'" 
       routerLink="/candidate/profile" 
       class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
       Profil
    </a>

    <!-- Recruteur connecté -->
    <a *ngIf="isLoggedIn && userRole === 'recruiter'" 
       routerLink="/recruiter/profile" 
       class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
       Profil
    </a>
    <a *ngIf="isLoggedIn && userRole === 'recruiter'" 
       routerLink="/recruiter/dashboard" 
       class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
       Dashboard
    </a>

    <!-- Boutons connexion / déconnexion -->
    <a *ngIf="!isLoggedIn" routerLink="/login" class="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600">Connexion</a>
    <a *ngIf="!isLoggedIn" routerLink="/register" class="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600">Inscription</a>
    <button *ngIf="isLoggedIn" (click)="logout()" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md">Déconnexion</button>
  </div>
</nav>

  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole: 'candidate' | 'recruiter' | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    this.userRole = user ? user.role : null;

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      const userData = this.authService.getUser();
      this.userRole = userData ? userData.role : null;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}