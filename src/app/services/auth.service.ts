import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  // Estado del rol del usuario
  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRole());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password });
  }

  saveAuthData(token: string, role: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    this.userRoleSubject.next(role); // Notifica el cambio de rol
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  saveUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  // Observable para que otros componentes reaccionen a cambios de rol
  getUserRoleObservable(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  logout(): void {
    const token = this.getAuthToken();
    console.log('Token al intentar logout:', token);
    if (!token) {
      console.warn('No hay token disponible para cerrar sesión');
      
    }
    if (token) {
      // Realiza una llamada al backend para informar el logout
      this.http.post('http://localhost:8080/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          console.log('Logout exitoso en el servidor');
        },
        error: (error) => {
          console.error('Error al cerrar sesión en el servidor', error);
        }
      });
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.userRoleSubject.next(null); // Notifica el cambio de rol (a null)
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken(); // Retorna true si hay un token guardado
  }

  register(registerData: { firstName: string; lastName: string; email: string; password: string }): Observable<{ message: string }> {
    const apiUrl = 'http://localhost:8080/api/auth/register';
    return this.http.post<{ message: string }>(apiUrl, registerData);
  }  
}
