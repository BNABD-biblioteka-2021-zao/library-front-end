import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  baseUrl =  'localhost:8092/api/v1/auth/register';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: '',
      name: '',
      password: ''
    });
  }

  ngOnInit(): void {
  }

  submit(): void {
    console.log(this.form.getRawValue());

    var req:HttpRequest = this.http.post(this.baseUrl, this.form.getRawValue());
    console.log(req);

    this.http.post(this.baseUrl, this.form.getRawValue())
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }
}
