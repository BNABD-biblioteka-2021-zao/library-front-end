import {Component, Inject, OnInit} from '@angular/core';
import {config} from '../../../config';
import {BookCopy} from '../../../models/bookcopy';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../../../models/book';

@Component({
  selector: 'app-edit-book-copy',
  templateUrl: './edit-book-copy.component.html',
  styleUrls: ['./edit-book-copy.component.css']
})
export class EditBookCopyComponent implements OnInit {

  bookCopyPut: BookCopy =  { } as BookCopy;
  bookCopies: any = [];
  bookCopy2BookCopyEdit: BookCopy =  { } as BookCopy;
  books: any = [];
  bookInput2Dialog: Book =  { } as Book;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getBookCopies().subscribe(value => {
      this.bookCopies = value;

      for (const bookCopy of this.bookCopies) {
        // tslint:disable-next-line:triple-equals
        if (bookCopy.id == this.data.bookCopyId){
          this.bookCopy2BookCopyEdit = bookCopy;
        }
      }
    });
    this.getBooks().subscribe(value => {
      this.books = value;
      console.log(this.bookCopy2BookCopyEdit);
      for (const book of this.books) {
        // tslint:disable-next-line:triple-equals
        if (book.id == this.bookCopy2BookCopyEdit.bookId){
          this.bookInput2Dialog = book;
          console.log(this.bookInput2Dialog);
        }
      }
    });
  }

  // tslint:disable-next-line:typedef
  saveEditedBookCopy() {
    this.bookCopyPut.id = this.bookCopy2BookCopyEdit.id;
    // @ts-ignore
    this.bookCopyPut.isbn = document.getElementById('isbn').value;
    // @ts-ignore
    this.bookCopyPut.pageAmount = document.getElementById('page_amount').value;
    // @ts-ignore
    this.bookCopyPut.publishDate = document.getElementById('publish_date').value;
    // @ts-ignore
    this.bookCopyPut.publisher = document.getElementById('publisher').value;
    // @ts-ignore
    this.bookCopyPut.status = this.bookCopy2BookCopyEdit.status;

    console.log('bookCopy', this.bookCopyPut);

    this.http.put(config.apiBookCopyUrl,
      this.bookCopyPut
    ).subscribe((value) => {
      console.log(value);
      location.reload();
    });
  }

  getBookCopies(): Observable<BookCopy[]> {
    return this.http.get<BookCopy[]>(config.apiBookCopyUrl + '/all');
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(config.apiBookUrl + '/all');
  }
}
