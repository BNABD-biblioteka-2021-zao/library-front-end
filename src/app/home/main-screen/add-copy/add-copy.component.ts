import { Component, OnInit } from '@angular/core';
import {Book} from '../../../models/book';
import {BookCopy} from '../../../models/bookcopy';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {config} from '../../../config';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-copy',
  templateUrl: './add-copy.component.html',
  styleUrls: ['./add-copy.component.css']
})
export class AddCopyComponent implements OnInit {
  bookcopy: BookCopy =  { } as BookCopy;
  // @ts-ignore
  books: any = [];
  booksCtrl = new FormControl();
  bookName: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ){
    this.books = this.booksCtrl.valueChanges
      .pipe(
        startWith(''),
        map(books => books ? this._filterStates(books) : this.books.slice())
      );
  }

  ngOnInit(): void {
    this.getBooks().subscribe(value => {
      this.books = value;
      console.log(value);
    });
  }

  // tslint:disable-next-line:typedef
  onAddBookCopy() {
    // @ts-ignore
    this.bookcopy.isbn = document.getElementById('isbn').value;
    // @ts-ignore
    this.bookcopy.pageAmount = document.getElementById('page_amount').value;
    // @ts-ignore
    this.bookcopy.publishDate = document.getElementById('publish_date').value;
    // @ts-ignore
    this.bookcopy.publisher = document.getElementById('publisher').value;
    // @ts-ignore
    this.bookName = document.getElementById('book_id').value;
    console.log(this.bookName);

    for (let book of this.books) {
      // tslint:disable-next-line:triple-equals
      if (book.title == this.bookName){
        this.bookcopy.book = book;
        console.log('Book', this.bookcopy.book);
      }
    }

    console.log(this.bookcopy);
    this.http.post(config.apiBookCopyUrl,
      this.bookcopy
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }

  public getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(config.apiBookUrl + '/all');
  }

  private _filterStates(value: string): Book[] {
    const filterValue = value.toLowerCase();

    return this.books.filter(books => books.title.toLowerCase().includes(filterValue));
  }
}
