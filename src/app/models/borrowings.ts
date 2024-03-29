import { BookCopy } from './bookcopy';
import { User } from './user';

export interface Borrowings {
  id: bigint;
  user: User[];
  bookCopy: BookCopy[];
  status: string;
  reservationTime: any;
  borrowStartTime: any;
  borrowEndTime: any;
}
