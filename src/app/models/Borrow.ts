import { Book } from "./Book";

export interface Borrow{
    id: number;
    book: Book;
    borrowDate: string;
    returnDate: string | null;
}