import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api/applications';

  constructor(private http: HttpClient, private auth: AuthService) {}

  applyJob(jobId: number, cv: string): Observable<Application> {
    // Ici on merge directement l'objet options renvoyé par getAuthHeaders
    return this.http.post<Application>(
      `${this.apiUrl}/apply/${jobId}`,
      { jobId, cv },
      this.auth.getAuthHeaders()  // ✔
    );
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl, this.auth.getAuthHeaders());
  }

  getApplicationsForRecruiter(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/recruiter`, this.auth.getAuthHeaders());
  }
}