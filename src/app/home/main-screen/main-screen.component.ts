import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
  displayedColumnsBook: string[] = ['id', 'author', 'descr', 'genre', 'title', 'action'];
  displayedColumnsBookCopy: string[] = ['id', 'isbn', 'page_amount', 'publish_date', 'publisher', 'book_id', 'action'];

  book: any;
  bookCopy: any;
  bookList = false;
  bookCopiesList = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
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

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(config.apiBookUrl + '/all');
  }

  getBookCopies(): Observable<BookCopy[]> {
    return this.http.get<BookCopy[]>(config.apiBookCopyUrl + '/all');
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
  }

  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.book.filter = filterValue.trim().toLowerCase();
    console.log('Filter', this.book);
  }

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
        openSnackBar(error);
      });
  }

  // tslint:disable-next-line:typedef
  editBookRow() {

  }

  // tslint:disable-next-line:typedef
  updateBookRow(){

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
