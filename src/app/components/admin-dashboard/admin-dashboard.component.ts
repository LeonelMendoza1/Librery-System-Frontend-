import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/Book';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{
  books: Book[] = [];
  selectedImage: string = '';
  isImageVisible: boolean = false;
  userRole: string = '';
  private userRoleSubscription: Subscription | null = null; // Suscripción al observable del rol
  newBookForm: FormGroup;

  constructor(private booksService: BookService, private authService: AuthService, private fb: FormBuilder) {
    this.newBookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    isbn: ['', Validators.required],
    publicationYear: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
    genre: ['', Validators.required],
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  addBook(): void {
    if (this.newBookForm.valid) {
      const newBook = this.newBookForm.value;
      this.booksService.addBook(newBook).subscribe({
        next: (book) => {
          this.books.push(book);
          this.newBookForm.reset();
          const modalElement = document.getElementById('newBookModal');
          if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
          }
        },
        error: (err) => {
          console.error('Error al agregar el libro:', err);
        },
      });
    }
  }
  
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
