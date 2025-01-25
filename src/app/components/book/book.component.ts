import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/Book';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, OnDestroy{
  books: Book[] = [];
  selectedImage: string = '';
  isImageVisible: boolean = false;
  userRole: string = '';
  private userRoleSubscription: Subscription | null = null; // Suscripción al observable del rol

  constructor(private booksService: BookService, private authService: AuthService) {}

  
  ngOnInit(): void {
    // Suscribirse al observable de AuthService para actualizar userRole dinámicamente
    this.userRoleSubscription = this.authService.getUserRoleObservable().subscribe(
      (role) => {
        this.userRole = role || ''; // Actualiza el rol o lo vacía si no hay sesión
      }
    );

    // Cargar libros desde el servicio
    this.booksService.getAllBooks().subscribe(
      (data) => {
        this.books = data;
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    this.userRoleSubscription?.unsubscribe();
  }


  showFullImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.isImageVisible = true;
  }

  hideFullImage(): void {
    this.isImageVisible = false;
  }
}
