import {Book} from './book';

export interface BookCopySource {
  id: bigint;
  publishDate: string;
  pageAmount: string;
  publisher: string;
  status: string;
  isbn: string;
  book: Book[];
  bookId: bigint;
}
