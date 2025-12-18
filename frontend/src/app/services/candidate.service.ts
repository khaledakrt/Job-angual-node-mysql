// frontend/src/app/services/candidate.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface CandidateProfile {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  // ajoute d'autres champs profil si nécessaire
}

export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  // autres champs job
}

export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  status: string;
  // autres champs application
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:5000/api/candidate'; // adapter selon ton backend

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Récupérer le profil du candidat
  getProfile(): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.apiUrl}/profile`, this.auth.getAuthHeaders());
  }

  // Mettre à jour le profil
  updateProfile(data: Partial<CandidateProfile>): Observable<CandidateProfile> {
    return this.http.put<CandidateProfile>(`${this.apiUrl}/profile`, data, this.auth.getAuthHeaders());
  }

  // Lister les jobs disponibles
  listJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, this.auth.getAuthHeaders());
  }

  // Postuler à un job
  applyJob(jobId: number, cv: File): Observable<Application> {
    const formData = new FormData();
    formData.append('cv', cv);
    return this.http.post<Application>(`${this.apiUrl}/apply/${jobId}`, formData, this.auth.getAuthHeaders());
  }

  // Historique des applications
  getApplicationHistory(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, this.auth.getAuthHeaders());
  }
}
