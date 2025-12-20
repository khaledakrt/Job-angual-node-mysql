import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'auth_token';

  // Stocke l'utilisateur complet
private currentUserSubject = new BehaviorSubject<any>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  // Stocke juste le statut connecté
  private loggedIn = new BehaviorSubject<boolean>(!!this.getToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
  const token = this.getToken();
  const user = localStorage.getItem('user');

  if (token && user) {
    try {
      this.currentUserSubject.next(JSON.parse(user));
      this.loggedIn.next(true);
    } catch {
      this.currentUserSubject.next(null);
      this.loggedIn.next(false);
    }
  }
}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        // Stocker token et user
        this.setToken(res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user); // Met à jour le BehaviorSubject
        this.loggedIn.next(true);
      })
    );
  }

  register(data: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getUser(): any {
    return this.currentUserSubject.value;
  }

  /* getAuthHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json'
      })
    };
  } */


   getAuthHeaders(noContentType: boolean = false): { headers: HttpHeaders } {
  let headersObj: any = {
    Authorization: `Bearer ${this.getToken()}`
  };

  if (!noContentType) {
    headersObj['Content-Type'] = 'application/json';
  }

  return { headers: new HttpHeaders(headersObj) };
}



  isLoggedIn(): boolean {
  return !!this.getToken(); // ou !!this.currentUserSubject.value
}
}
