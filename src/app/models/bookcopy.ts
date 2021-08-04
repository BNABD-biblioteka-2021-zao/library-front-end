import { Book } from './book';

export interface BookCopy {
  isbn: string;
  pageAmount: string;
  publishDate: string;
  publisher: string;
  book: Book[];
}
