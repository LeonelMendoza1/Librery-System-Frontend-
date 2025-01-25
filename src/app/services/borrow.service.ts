import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Book } from '../models/Book';
import { Borrow } from '../models/Borrow';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private apiUrl = 'http://localhost:8080/api/borrow';

  constructor(private http: HttpClient, private authService: AuthService) {}

  borrowBook(userId: number, bookId: number): Observable<string> {
    const token = this.authService.getAuthToken();
    return this.http.post<string>(`${this.apiUrl}/${bookId}`, null, {
      params: { userId: userId.toString() },
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  returnBook(userId: number, bookId: number): Observable<string> {
    const token = this.authService.getAuthToken();
    return this.http.post<string>(`${this.apiUrl}/return/${bookId}`, null, {
      params: { userId: userId.toString() },
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getBorrowedBooks(userId: number): Observable<Borrow[]> {
    const token = localStorage.getItem('authToken'); // Obtener el token JWT del almacenamiento local
    return this.http.get<Borrow[]>(`${this.apiUrl}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token JWT al encabezado
      },
    });
  }
}
