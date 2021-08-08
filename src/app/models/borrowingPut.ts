import { BookCopy } from './bookcopy';
import { User } from './user';

export interface Borrowings {
  borrowEndTime: any;
  borrowStartTime: any;
  reservationTime: any;
  status: string;
  bookCopy: BookCopy[];
  user: User[];
}
