import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/Book';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { BorrowService } from 'src/app/services/borrow.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  books: Book[] = [];
  borrowedBooks: number[] = []; // IDs de libros actualmente prestados
  selectedImage: string = '';
  isImageVisible: boolean = false;
  userRole: string = '';
  userId: number | null = null;
  private userRoleSubscription: Subscription | null = null; // Suscripción al observable del rol

  constructor(private booksService: BookService, private authService: AuthService, private borrowService: BorrowService) {}

  
  ngOnInit(): void {
    // Suscribirse al observable de AuthService para actualizar userRole dinámicamente
    this.userRoleSubscription = this.authService.getUserRoleObservable().subscribe(
      (role) => {
        this.userRole = role || ''; // Actualiza el rol o lo vacía si no hay sesión
      }
    );
     // Obtener el userId del token JWT
     const token = this.authService.getAuthToken();
     if (token) {
       const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del token
       this.userId = payload.userId; // Obtener userId del token
     }
    this.loadBooks();
  }

  private loadBooks(): void {
    // Cargar todos los libros desde el servicio
    this.booksService.getAllBooks().subscribe(
      (data) => {
        this.books = data;
  
        // Si el usuario está autenticado, cargar los libros prestados
        if (this.userId) {
          this.borrowService.getBorrowedBooks(this.userId).subscribe(
            (borrowedBooks) => {
              // Extraer solo los IDs de los libros prestados
              this.borrowedBooks = borrowedBooks.map((borrow) => borrow.book.id);
            },
            (error) => {
              console.error('Error al cargar libros prestados:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al cargar los libros:', error);
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

  borrowBook(bookId: number): void {
    if (this.userId) {
      this.borrowService.borrowBook(this.userId, bookId).subscribe({
        next: () => {
          this.borrowedBooks.push(bookId); // Agregar libro a los prestados
          this.loadBooks(); // Recargar libros después de la acción
        },
        error: (err) => {
          console.error('Error al obtener el libro:', err);
        },
      });
    }
  }

  returnBook(bookId: number): void {
    if (this.userId) {
      this.borrowService.returnBook(this.userId, bookId).subscribe({
        next: () => {
          this.borrowedBooks = this.borrowedBooks.filter((id) => id !== bookId); // Eliminar libro de los prestados
          this.loadBooks();
        },
        error: (err) => {
          console.error('Error al devolver el libro:', err);
        },
      });
    }
  }

  isBorrowed(bookId: number): boolean {
    return this.borrowedBooks.includes(bookId); // Verificar si el libro está prestado
  }

}
