import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  status: string;
  expiryDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:5000/jobs'; // correspond à ton backend

  constructor(private http: HttpClient, private auth: AuthService) {}

  // 1️⃣ Toutes les offres publiques
  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/all`);
  }

  // 2️⃣ Offres du recruteur connecté
  getMyJobs(): Observable<Job[]> {
    const headers = this.auth.getAuthHeaders(); // devrait renvoyer { headers: new HttpHeaders({ Authorization: 'Bearer ...' }) }
    return this.http.get<Job[]>(`${this.apiUrl}/my`, headers);
  }

  // 3️⃣ Détail d’une offre
  getJobById(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${jobId}`);
  }

  // 4️⃣ Créer un job
  createJob(job: Partial<Job>): Observable<Job> {
    const headers = this.auth.getAuthHeaders();
    return this.http.post<Job>(`${this.apiUrl}`, job, headers);
  }

  // 5️⃣ Mettre à jour un job
  updateJob(id: number, job: Partial<Job>): Observable<Job> {
    const headers = this.auth.getAuthHeaders();
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job, headers);
  }

  // 6️⃣ Supprimer un job
  deleteJob(id: number): Observable<any> {
    const headers = this.auth.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, headers);
  }
  getLatestJobs(limit: number = 5): Observable<Job[]> {
  return this.http.get<Job[]>(`${this.apiUrl}/all?limit=${limit}`);
}
}
