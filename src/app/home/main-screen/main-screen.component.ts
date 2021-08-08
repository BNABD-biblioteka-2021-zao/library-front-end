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


// tslint:disable-next-line:typedef
function openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action);
}

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
  displayedColumnsBookCopy: string[] = ['id', 'isbn', 'page_amount', 'publish_date', 'publisher', 'status', 'action'];
  displayedBorrowings: string[] = ['id', 'borrow_end_time', 'borrow_start_time', 'reservation_time', 'status', 'book_copy_id', 'user_id', 'action'];
  expandedElement: PeriodicElement | null;

  @ViewChild('bookId') bookId: ElementRef;
  @ViewChild('description') description: ElementRef;
  @ViewChild('bookCopyID') bookCopyID: ElementRef;
  @ViewChild('statusBookCopy') statusBookCopy: ElementRef;

  user: User =  { } as User;
  users: any;
  book: PeriodicElement[];
  bookPut: Book =  { } as Book;
  bookCopy: any;
  bookCopyPut: BookCopy =  { } as BookCopy;
  borrowing: Borrowings =  { } as Borrowings;
  myBorrowing: any;
  allBorrowing: any;
  bookCopy2BookCopyEdit: any = [];

  bookList = false;
  bookCopiesList = false;
  myBorrowingList = false;
  allBorrowingList = false;
  librarianButton = true;
  userButton = true;
  editBookButton = true;
  saveEditedBookButton = false;
  editBookCopyButton = true;
  saveEditedBookCopyButton = false;
  isEditable = true;
  isEditableBookCopy = true;
  isDescrEditable = false;


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
    });
    this.getAllUsers().subscribe(value => {
      // @ts-ignore
      this.users = value;
    });

    this.getBookCopies().subscribe(value => {
      this.bookCopy2BookCopyEdit = value;
      console.log(value);
    });

    const now = Date.now();
    this.currDate = new Date();
    this.currDate = this.pipe.transform(now, 'yyyy-MM-dd');
    console.log(this.currDate);

    this.endTime = new Date();
    this.endTime.setDate( this.endTime.getDate() + 30 );
    this.end = this.endTime.toString();
    this.end = this.pipe.transform(this.end , 'yyyy-MM-dd');
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

  // tslint:disable-next-line:typedef
  openBorrowDialog(id: any) {
    this.bookCopyId = id;
    this.dialog.open(BorrowDialogComponent, {data: {
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
      console.log(value);
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
        openSnackBar('123', '123');
      });
  }

  // tslint:disable-next-line:typedef
  editBookRow() {
    this.editBookButton = false;
    this.saveEditedBookButton = true;
    this.isEditable = false;
    this.isDescrEditable = true;
  }

  // tslint:disable-next-line:typedef
  saveEditedBookRow(id: any, title: any) {
    this.editBookButton = true;
    this.saveEditedBookButton = false;
    this.isEditable = true;
    this.isDescrEditable = false;
    // @ts-ignore
    // this.bookPut.id = this.bookId.nativeElement.innerHTML;
    this.bookPut.id = id;
    // @ts-ignore
    // this.bookPut.title = document.getElementById('title').value;
    this.bookPut.title = title;
    // @ts-ignore
    this.bookPut.genre = document.getElementById('genre').value;
    // @ts-ignore
    this.bookPut.author = document.getElementById('author').value;
    // @ts-ignore
    // this.bookPut.description = this.description.nativeElement.innerHTML;
    this.bookPut.description = this.user;
    console.log('book', this.bookPut);

    this.http.put(config.apiBookUrl,
      this.bookPut
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });

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
        // openSnackBar(error);
      });
  }

  // tslint:disable-next-line:typedef
  editBookCopyRow() {
    this.editBookCopyButton = false;
    this.saveEditedBookCopyButton = true;
    this.isEditableBookCopy = false;
  }

  // tslint:disable-next-line:typedef
  saveEditedBookCopyRow() {
    this.editBookCopyButton = true;
    this.saveEditedBookCopyButton = false;
    this.isEditableBookCopy = true;

    // @ts-ignore
    this.bookCopyPut.id = this.bookCopyID.nativeElement.innerHTML;
    // @ts-ignore
    this.bookCopyPut.isbn = document.getElementById('isbnElement').value;
    // @ts-ignore
    this.bookCopyPut.pageAmount = document.getElementById('pageAmount').value;
    // @ts-ignore
    this.bookCopyPut.publishDate = document.getElementById('publishDate').value;
    // @ts-ignore
    this.bookCopyPut.publisher = document.getElementById('publisher').value;
    // @ts-ignore
    this.bookCopyPut.status = this.statusBookCopy.nativeElement.innerHTML;

    for (const bookCopy of this.bookCopy2BookCopyEdit) {
      // tslint:disable-next-line:triple-equals
      if (bookCopy.id == this.bookCopyPut.id){
        this.bookCopyPut.bookId = bookCopy.bookId;
        console.log('BookID', this.bookCopyPut.bookId);
      }
    }
    console.log('bookCopy', this.bookCopyPut);

    this.http.put(config.apiBookCopyUrl,
      this.bookCopyPut
    ).subscribe((value) => {
      console.log(value);
      location.reload();
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
        // openSnackBar(error);
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
/*
  // tslint:disable-next-line:typedef
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }*/

  // tslint:disable-next-line:typedef
  onNameChange(val) {
    console.log('Changed', val);
  }
}
