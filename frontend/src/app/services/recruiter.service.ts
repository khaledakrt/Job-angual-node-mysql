// frontend/src/app/services/recruiter.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface RecruiterProfile {
  id?: number;
  company?: string;
  phone?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  // autres champs job
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  // autres champs candidat
}

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  private apiUrl = 'http://localhost:5000/api/recruiter'; // adapter selon ton backend

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Profil recruteur
  getProfile(): Observable<RecruiterProfile> {
    return this.http.get<RecruiterProfile>(`${this.apiUrl}/profile`, this.auth.getAuthHeaders());
  }

  updateProfile(data: Partial<RecruiterProfile>): Observable<RecruiterProfile> {
    return this.http.put<RecruiterProfile>(`${this.apiUrl}/profile`, data, this.auth.getAuthHeaders());
  }

  // Jobs
  listJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`, this.auth.getAuthHeaders());
  }

  createJob(jobData: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs`, jobData, this.auth.getAuthHeaders());
  }

  updateJob(jobId: number, jobData: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/jobs/${jobId}`, jobData, this.auth.getAuthHeaders());
  }

  deleteJob(jobId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/jobs/${jobId}`, this.auth.getAuthHeaders());
  }

  // Liste des candidats
  listCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`, this.auth.getAuthHeaders());
  }
  uploadAvatar(file: File): Observable<{ avatar: string }> {
  const formData = new FormData();
  formData.append('avatar', file);

  // Récupérer headers auth sans Content-Type
  let headersObj = this.auth.getAuthHeaders()?.headers || {};
  if ('Content-Type' in headersObj) delete headersObj['Content-Type'];

  return this.http.post<{ avatar: string }>(
    `${this.apiUrl}/profile/avatar`,
    formData,
    { headers: headersObj }
  );
}
}
