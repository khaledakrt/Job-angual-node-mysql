// src/app/guards/candidate.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();

    if (user && user.role === 'candidate') {
      return true;
    }

    // Redirection si non-candidat ou non connecté
    this.router.navigate(['/']);
    return false;
  }
}
