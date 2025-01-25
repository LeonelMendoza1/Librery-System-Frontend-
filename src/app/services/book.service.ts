import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/Book';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/api/books'; // Cambia la URL según corresponda

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
}
