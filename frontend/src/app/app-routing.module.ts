import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import {SignupComponent} from "./components/signup/signup.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {TestComponent} from "./components/test/test.component";
import {ResultComponent} from "./components/result/result.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {AuthorizepatientguardService} from "./services/AuthorizePatientGuard/authorizepatientguard.service";
import {AuthorizedoctorguardService} from "./services/AuthorizeDoctorGuard/authorizedoctorguard.service";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'test', component: TestComponent, canActivate: [AuthorizepatientguardService,AuthorizedoctorguardService]},
  { path: 'result', component: ResultComponent, canActivate: [AuthorizepatientguardService,AuthorizedoctorguardService]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthorizepatientguardService,AuthorizedoctorguardService]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
