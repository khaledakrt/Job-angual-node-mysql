// frontend/src/app/services/candidate.service.ts
// frontend/src/app/services/candidate.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Candidate, Job, Application } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {   // ✅ exporté
  private apiUrl = 'http://localhost:5000/api/candidate';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getProfile(): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/profile`, this.auth.getAuthHeaders());
  }

  updateProfile(data: Partial<Candidate>): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/profile`, data, this.auth.getAuthHeaders());
  }

  listJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, this.auth.getAuthHeaders());
  }

  applyJob(jobId: number, cv: File): Observable<Application> {
    const formData = new FormData();
    formData.append('cv', cv);
    return this.http.post<Application>(`${this.apiUrl}/apply/${jobId}`, formData, this.auth.getAuthHeaders());
  }

  getApplicationHistory(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, this.auth.getAuthHeaders());
  }
}
