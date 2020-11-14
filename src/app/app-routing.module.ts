import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { RecetteListComponent } from './recette/recette-list/recette-list.component'
import { RecetteDetailComponent } from './recette/recette-detail/recette-detail.component'
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';
import {LogoutComponent} from "./logout/logout.component";

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'recette/list', component: RecetteListComponent, canActivate: [AuthGuardService] },
  { path: 'recette/detail/:id', component: RecetteDetailComponent, canActivate: [AuthGuardService] },
  { path: 'recette/new', component: RecetteDetailComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
