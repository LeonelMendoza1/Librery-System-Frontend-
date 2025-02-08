import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/Book';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'https://library-system-backend-production.up.railway.app/api/books';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  addBook(book: Book): Observable<Book>{
    const token = this.authService.getAuthToken();
    return this.http.post<Book>(this.apiUrl, book,{
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateBook(bookId: number, updatedBook: Book): Observable<Book> {
    const token = this.authService.getAuthToken();
    return this.http.put<Book>(`${this.apiUrl}/${bookId}`, updatedBook,{
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteBook(bookId: number): Observable<string> {
    const token = this.authService.getAuthToken();
    return this.http.delete<string>(`${this.apiUrl}/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text' as 'json' // <-- Esto evita el error de "Unexpected token 'L'"
    });
  }
}
