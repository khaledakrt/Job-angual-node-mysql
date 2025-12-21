// frontend/src/app/services/candidate.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Candidate, Job, Application } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'http://localhost:5000/api/candidate';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): { headers: HttpHeaders } {
    return this.auth.getAuthHeaders(); // doit renvoyer { headers: new HttpHeaders({ Authorization: 'Bearer ...' }) }
  }

  // Récupérer le profil du candidat
  getProfile(): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/profile`, this.getHeaders());
  }

  // Mettre à jour le profil du candidat
  updateProfile(data: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/profile`, data, this.getHeaders());
  }

  // Lister toutes les offres
  listJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, this.getHeaders());
  }

  // Postuler à une offre avec CV
  applyJob(jobId: number, cv: File): Observable<Application> {
    const formData = new FormData();
    formData.append('cv', cv);
    return this.http.post<Application>(`${this.apiUrl}/apply/${jobId}`, formData, this.getHeaders());
  }

  // Historique des candidatures
  getApplicationHistory(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, this.getHeaders());
  }

  // Méthodes supplémentaires possibles pour diplomas / compétences
  addDiploma(diploma: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/diplomas`, diploma, this.getHeaders());
  }

  addCompetence(competence: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/competences`, competence, this.getHeaders());
  }
}
