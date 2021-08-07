import { Book } from './book';

export interface BookCopy {
  isbn: string;
  pageAmount: string;
  publishDate: string;
  publisher: string;
  status: string;
  book: Book[];
}
