//profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Ajouté ici
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
    imports: [CommonModule, RouterModule, FormsModule], // <-- FormsModule ajouté

  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class RecruiterProfileComponent implements OnInit, OnDestroy {
  profile: any = null;
  loading = true;
  error: string | null = null;
  private sub: Subscription | null = null;
// ✅ ici les variables pour l’édition
  editPersonal = false;
  editCompany = false;
  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    // 1️⃣ Infos de base depuis AuthService
    this.sub = this.authService.currentUser$.subscribe({
      next: user => {
        if (user) {
          this.profile = user;
          this.loading = false;

          // 2️⃣ Infos supplémentaires depuis backend
          const headers = this.authService.getAuthHeaders()?.headers;
          if (headers) {
            this.http.get('http://localhost:5000/api/recruiter/profile', { headers })
  .subscribe({
    next: (data: any) => {
      // ⚡ On prend explicitement les champs du recruiter
      this.profile = {
        ...this.profile,           // infos du user (name, email, role)
        company: data.company,
        phone: data.phone,
        description: data.description,
        website: data.website,
        avatar: data.avatar         // ici c’est le chemin venant du backend
      };
    },
    error: err => { console.error('Erreur récupération profil backend', err); }
  });
          }

        } else {
          this.profile = null;
          this.loading = false;
          this.error = 'Utilisateur non connecté';
        }
      },
      error: err => {
        console.error('Erreur récupération utilisateur', err);
        this.error = 'Impossible de charger le profil';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    // Nettoyage pour éviter les fuites mémoire
    this.sub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
  // ✅ Ajouter ici les fonctions de sauvegarde
  savePersonal() {
    console.log('Sauvegarde infos personnelles', this.profile);
    this.editPersonal = false;
    // TODO: Appel API pour sauvegarder
  }

  saveCompany() {
    console.log('Sauvegarde infos entreprise', this.profile);
    this.editCompany = false;
    // TODO: Appel API pour sauvegarder
  }
// ✅ AJOUTER ICI la fonction uploadAvatar
 uploadAvatar(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append('avatar', file);

  // On envoie le token mais pas Content-Type
  const headers = this.authService.getAuthHeaders(true).headers;

  this.http.post<{ avatar: string }>(
    'http://localhost:5000/api/recruiter/profile/avatar',
    formData,
    { headers }
  ).subscribe({
    next: (res) => {
      this.profile.avatar = res.avatar + '?t=' + new Date().getTime();
    },
    error: (err) => console.error('Erreur upload avatar', err)
  });
}









getAvatarUrl(avatar?: string) {
  // Si l'utilisateur a un avatar, on retourne le chemin complet du backend
  if (avatar) return `http://localhost:5000/${avatar}?t=${new Date().getTime()}`; // cache-busting

  // Sinon, on retourne l'avatar par défaut
  return 'assets/default-avatar.png';
}


// Fallback si l'image ne se charge pas
onAvatarError(event: any) {
  event.target.src = 'assets/default-avatar.png';
}
}

