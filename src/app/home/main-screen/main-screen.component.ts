import {Component, ElementRef, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AddBookComponent} from './add-book/add-book.component';
import {AddCopyComponent} from './add-copy/add-copy.component';
import {AuthService} from '../../security/auth.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../../models/book';
import {config} from '../../config';
import {BookCopy} from '../../models/bookcopy';
import {catchError, map, startWith, take} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Borrowings} from '../../models/borrowings';
import {User} from '../../models/user';
import {DatePipe, formatDate} from '@angular/common';
import {PeriodicElement} from '../../models/periodicelement';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {FormControl} from '@angular/forms';
import {BorrowDialogComponent} from './borrow-dialog/borrow-dialog.component';
import {EditBookComponent} from './edit-book/edit-book.component';
import {EditBookCopyComponent} from './edit-book-copy/edit-book-copy.component';
import {BookCopySource} from '../../models/bookCopySource';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [DatePipe]
})
export class MainScreenComponent implements OnInit {
  displayedColumnsBook: string[] = ['id', 'author', 'genre', 'title', 'action'];
  displayedColumnsBookCopy: string[] = ['id', 'isbn', 'page_amount', 'publish_date', 'publisher', 'status', 'book', 'action'];
  displayedBorrowings: string[] = ['id', 'borrow_end_time', 'borrow_start_time', 'reservation_time', 'status', 'book_copy_id', 'user_id', 'action'];
  expandedElement: PeriodicElement | null;

  user: User =  { } as User;
  users: any;
  book: PeriodicElement[];
  bookCopy: any;
  borrowing: Borrowings =  { } as Borrowings;
  allBorrowing: any;
  bookId: any;

  bookList = false;
  bookCopiesList = false;
  allBorrowingList = false;
  librarianButton = false;
  userButton = false;
  reservationButton = true;


  currDate: any;
  endTime: Date;
  end: any;
  pipe = new DatePipe('en-US');
  bookCopyId: any;
  borrowingHeader: any;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    // tslint:disable-next-line:variable-name
    private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getCurrentUser().subscribe(value => {
      // @ts-ignore
      this.user = value;
      console.log(this.user);
      // tslint:disable-next-line:triple-equals
      if (this.user.role == 'ROLE_LIBRARIAN'){
        this.librarianButton = true;
        console.log('ROLE_LIBRARIAN');
      }else{
        this.userButton = true;
        console.log('ROLE_USER');
      }
    });
    this.getAllUsers().subscribe(value => {
      // @ts-ignore
      this.users = value;
    });

    const now = Date.now();
    this.currDate = new Date();
    this.currDate = this.pipe.transform(now, 'yyyy-MM-dd');
    console.log(this.currDate);

    this.endTime = new Date();
    this.endTime.setDate( this.endTime.getDate() + 30 );
    this.end = this.endTime.toString();
    this.end = this.pipe.transform(this.end , 'yyyy-MM-dd');

  }

  // tslint:disable-next-line:typedef
  openAddBookDialog() {
    this.dialog.open(AddBookComponent);
  }

  // tslint:disable-next-line:typedef
  openCopyBookDialog() {
    this.dialog.open(AddCopyComponent);
  }

  // tslint:disable-next-line:typedef
  openBorrowDialog(id: any) {
    this.bookCopyId = id;
    this.dialog.open(BorrowDialogComponent, {data: {
        bookCopyId: this.bookCopyId
      }});
  }

  // tslint:disable-next-line:typedef
  openEditBookDialog(id: any) {
    this.bookId = id;
    this.dialog.open(EditBookComponent, {data: {
        bookCopyId: this.bookId
      }});
  }

  // tslint:disable-next-line:typedef
  openEditBookCopyDialog(id: any) {
    this.bookCopyId = id;
    console.log('editID', this.bookCopyId);
    this.dialog.open(EditBookCopyComponent, {data: {
        bookCopyId: this.bookCopyId
      }});
  }

  logOut(): void{
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(config.apiBookUrl + '/all');
  }

  getBookCopies(): Observable<BookCopy[]> {
    return this.http.get<BookCopy[]>(config.apiBookCopyUrl + '/all');
  }

  getAllBorrowing(): Observable<Borrowings[]> {
    return this.http.get<Borrowings[]>(config.apiBorrowing + '/all');
  }

  getMyBorrowing(): Observable<Borrowings[]> {
    return this.http.get<Borrowings[]>(config.apiBorrowing + '/allMy');
  }

  // tslint:disable-next-line:typedef
  getCurrentUser(): Observable<User[]>{
    return this.http.get<User[]>(config.apiUser);
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(config.apiUser + '/all');
  }

  // tslint:disable-next-line:typedef
  onBooksList() {
    this.getBooks().subscribe(value => {
      this.book = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  bookListShow(){
    this.bookList = true;
    this.bookCopiesList = false;
    this.allBorrowingList = false;
    // this.myBorrowingList = false;
  }

  // tslint:disable-next-line:typedef
  onBookCopiesList() {
    this.getBookCopies().subscribe(value => {
      this.bookCopy = value;
      console.log('ccccc', value);
    });
  }

  // tslint:disable-next-line:typedef
  bookCopiesListShow() {
    this.bookCopiesList = true;
    this.bookList = false;
    this.allBorrowingList = false;
    // this.myBorrowingList = false;
  }

  // tslint:disable-next-line:typedef
  onAllBorrowingsList() {
    this.borrowingHeader = 'Lista wszystkich wypożyczeń';
    this.getAllBorrowing().subscribe(value => {
      this.allBorrowing = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  onMyBorrowingsList() {
    this.borrowingHeader = 'Lista moich wypożyczeń';
    this.getMyBorrowing().subscribe(value => {
      this.allBorrowing = value;
      console.log('Moje', value);
    });
  }

  // tslint:disable-next-line:typedef
  allBorrowingListShow() {
    this.allBorrowingList = true;
    this.bookCopiesList = false;
    this.bookList = false;
    // this.myBorrowingList = false;
  }

  /*
  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.book.filter = filterValue.trim().toLowerCase();
    console.log('Filter', this.book);
  }*/

  // tslint:disable-next-line:typedef
  deleteBookRow(id: any) {
    this.http.delete(config.apiBookUrl + '/' + id)
      .subscribe(response =>
      {
        console.log(id);
        console.log(response);
        location.reload();
        // tslint:disable-next-line:no-shadowed-variable
      }, (error) => {
        console.log(error);
        this.openSnackBar('Nie można usunąć książki posiadającej kopie', 'Usuń najpierw kopie');
      });
  }

  // tslint:disable-next-line:typedef
  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  // tslint:disable-next-line:typedef
  deleteBookCopyRow(id: any) {
    this.http.delete(config.apiBookCopyUrl + '/' + id)
      .subscribe(response =>
      {
        console.log(id);
        console.log(response);
        location.reload();
        // tslint:disable-next-line:no-shadowed-variable
      }, (error) => {
        this.openSnackBar('Nie można usunąć wypożyczonego egzemplarza książki', '');
      });
  }

  // tslint:disable-next-line:typedef
  reservateBook(copyId: any) {
    // @ts-ignore
    // this.borrowing.reservationTime = this.currDate;
    console.log('copyId', copyId);
    // @ts-ignore
    this.borrowing.user = this.user.id;
    // @ts-ignore
    this.borrowing.bookCopy = copyId;

    this.http.post(config.apiBorrowing + '/add',
      this.borrowing
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }

  // tslint:disable-next-line:typedef
  deleteReservation(id: any) {

    this.http.delete(config.apiBorrowing + '/' + id)
      .subscribe(response =>
      {
        console.log(id);
        console.log(response);
        location.reload();
        // tslint:disable-next-line:no-shadowed-variable
      }, (error) => {
        this.openSnackBar('Nie można usunąć rezerwacji ze statusem "borrowed"', '');
      });
  }

  // tslint:disable-next-line:typedef
  confirmReservation(id: any, userName: any, bookCopy: any, status: any) {

    // @ts-ignore
    this.borrowing.id = id;

    for (const user of this.users) {
      // tslint:disable-next-line:triple-equals
      if (user.name == userName){
        // @ts-ignore
        this.borrowing.user = user;
        // console.log('User', this.borrowing.user);
      }
    }
    this.borrowing.reservationTime = null;
    this.borrowing.borrowStartTime = this.currDate;
    this.borrowing.borrowEndTime = this.end;
    this.borrowing.bookCopy = bookCopy;
    this.borrowing.status = 'borrowed';


    this.http.put(config.apiBorrowing + '/edit',
      this.borrowing
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });

    // tslint:disable-next-line:triple-equals
    if (status == 'borrowed'){

      this.borrowing.id = id;

      for (const user of this.users) {
        // tslint:disable-next-line:triple-equals
        if (user.name == userName){
          this.borrowing.user = user;
        }
      }

      this.borrowing.reservationTime = null;
      this.borrowing.borrowStartTime = this.currDate;
      this.borrowing.borrowEndTime = this.end;
      this.borrowing.bookCopy = bookCopy;
      this.borrowing.status = 'returned';

      this.http.put(config.apiBorrowing + '/edit',
        this.borrowing
      ).subscribe((value) => {
        console.log(value);
        location.reload();
      });
    }
  }
}
