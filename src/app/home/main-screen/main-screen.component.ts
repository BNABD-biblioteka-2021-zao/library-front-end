import {Component, Inject, OnInit} from '@angular/core';
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
import {catchError} from 'rxjs/operators';
import {error} from '@angular/compiler/src/util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Borrowings} from '../../models/borrowings';
import {User} from '../../models/user';
import {DatePipe} from '@angular/common';
import {PeriodicElement} from '../../models/periodicelement';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
  displayedColumnsBook: string[] = ['id', 'author', 'genre', 'title', 'action'];
  displayedColumnsBookCopy: string[] = ['id', 'isbn', 'page_amount', 'publish_date', 'publisher', 'status', 'action'];
  displayedBorrowings: string[] = ['id', 'borrow_end_time', 'borrow_start_time', 'reservation_time', 'status', 'book_copy_id', 'user_id', 'action'];
  expandedElement: PeriodicElement | null;

  user: User =  { } as User;
  book: PeriodicElement[];
  bookCopy: any;
  borrowing: Borrowings =  { } as Borrowings;
  myBorrowing: any;
  allBorrowing: any;
  bookList = false;
  bookCopiesList = false;
  myBorrowingList = false;
  allBorrowingList = false;
  librarianButton = true;
  userButton = true;
  currDate: any;
  test: any;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe) {
    this.currDate = this.datePipe.transform(this.currDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getCurrentUser().subscribe(value => {
      // @ts-ignore
      this.user = value;
      console.log(this.user);
    });
      /*
      // tslint:disable-next-line:triple-equals
      if (this.user.role == 'ROLE_LIBRARIAN'){
        this.librarianButton = true;
        console.log('ROLE_LIBRARIAN');
      }else{
        this.userButton = true;
        console.log('ROLE_USER');
      }*/
  }

  // tslint:disable-next-line:typedef
  openAddBookDialog() {
    this.dialog.open(AddBookComponent);
  }

  // tslint:disable-next-line:typedef
  openCopyBookDialog() {
    this.dialog.open(AddCopyComponent);
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

  // tslint:disable-next-line:typedef
  getCurrentUser(): Observable<User[]>{
    return this.http.get<User[]>(config.apiUser);
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
    this.myBorrowingList = false;
  }

  // tslint:disable-next-line:typedef
  onBookCopiesList() {
    this.getBookCopies().subscribe(value => {
      this.bookCopy = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  bookCopiesListShow() {
    this.bookCopiesList = true;
    this.bookList = false;
    this.allBorrowingList = false;
    this.myBorrowingList = false;
  }

  // tslint:disable-next-line:typedef
  onAllBorrowingsList() {
    this.getAllBorrowing().subscribe(value => {
      this.allBorrowing = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  allBorrowingListShow() {
    this.allBorrowingList = true;
    this.bookCopiesList = false;
    this.bookList = false;
    // this.myBorrowingList = false;
  }

  // tslint:disable-next-line:typedef
  onMyBorrowingsList() {

  }

  // tslint:disable-next-line:typedef
  myBorrowingListShow() {

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
        // openSnackBar(error);
      });
  }

  // tslint:disable-next-line:typedef
  editBookRow() {

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

    this.http.post(config.apiBorrowing,
      this.borrowing
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }

  // tslint:disable-next-line:typedef
  confirmBorrow() {

  }

  // tslint:disable-next-line:typedef
  updateBookRow(){

  }
  /*
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }*/

  // tslint:disable-next-line:typedef
  hello() {
    this.getHello().subscribe(value => {
      this.test = value;
      console.log(value);
    });
  }
  // tslint:disable-next-line:typedef
  getHello(){
    return this.http.get(config.apiTest + '/hello');
  }

  // tslint:disable-next-line:typedef
  getNice(){
    return this.http.get(config.apiTest + '/nice');
  }

  // tslint:disable-next-line:typedef
  getHelloUser(){
    return this.http.get(config.apiTest + '/user');
  }

  // tslint:disable-next-line:typedef
  getHelloLibr(){
    return this.http.get(config.apiTest + '/librarian');
  }

  // tslint:disable-next-line:typedef
  nice() {
    this.getNice().subscribe(value => {
      this.test = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  helloUser() {
    this.getHelloUser().subscribe(value => {
      this.test = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  helloLibr() {
    this.getHelloLibr().subscribe(value => {
      this.test = value;
      console.log(value);
    });
  }
}
