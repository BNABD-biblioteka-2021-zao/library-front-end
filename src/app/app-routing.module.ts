import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { MainScreenComponent } from './home/main-screen/main-screen.component';
import {AuthGuard} from './security/guards/auth.guard';
import {MainGuard} from './security/guards/main.guard';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', redirectTo: ''},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'main',
    component: MainScreenComponent,
    canActivate:  [MainGuard],
  },
  {path: 'test', redirectTo: '/main'},


  {path: '**', redirectTo: ''}    // TODO 404-page; redirectTo: '/404'
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
