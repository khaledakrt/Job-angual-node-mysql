import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // rôle attendu
    const user = this.authService.getUser();

    if (!user) {
      // non connecté → redirige login
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRole && user.role !== expectedRole) {
      // rôle non autorisé → redirige accueil
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
