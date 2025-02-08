import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/Book';
import { AuthService } from 'src/app/services/auth.service';
import { BorrowService } from 'src/app/services/borrow.service';
import { Borrow } from 'src/app/models/Borrow';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-my-borrows',
  templateUrl: './my-borrows.component.html',
  styleUrls: ['./my-borrows.component.css']
})
export class MyBorrowsComponent implements OnInit{
  borrowedBooks: Borrow[] = []; // Almacena los libros prestados
  userId: number | null = null;

  constructor(private borrowService: BorrowService, private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el userId del token JWT
    const token = this.authService.getAuthToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload.userId;
      console.log(this.userId);
    }

    if (this.userId) {
      // Cargar libros prestados
      this.borrowService.getBorrowedBooks(this.userId).subscribe(
        (data: Borrow[]) => {
          this.borrowedBooks = data;
        },
        (error) => {
          console.error('Error al cargar libros prestados:', error);
        }
      );
    }
  }

  returnBook(borrowId: number): void {
    if (this.userId) {
      this.borrowService.returnBook(this.userId, borrowId).subscribe({
        next: () => {
           this.borrowedBooks = this.borrowedBooks.filter((borrow) => borrow.book.id !== borrowId);
        },
        error: (err) => {
          console.error('Error al devolver el libro:', err);
        },
      });
    }
  }

  generatePDF(): void {
    const doc = new jsPDF();
    doc.text('Lista de Libros Prestados', 20, 10);

    const tableData = this.borrowedBooks.map(borrow => [
      borrow.book.title,
      borrow.book.author,
      borrow.book.isbn,
      borrow.book.publicationYear,
      borrow.book.genre
    ]);

    autoTable(doc, {
      head: [['Título', 'Autor', 'ISBN', 'Año', 'Género']],
      body: tableData,
      startY: 20
    });

    doc.save('Mis_Libros_Prestados.pdf');
  }
}
