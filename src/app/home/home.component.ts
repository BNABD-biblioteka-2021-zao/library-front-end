import { Component, OnInit } from '@angular/core';
import {config} from '../config';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  onTest() {
    this.http.get<any[]>(config.apiUrl + '/test/hello').subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }
}
