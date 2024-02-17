import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import {SignupComponent} from "./components/signup/signup.component";
import {ChatComponent} from "./components/chat/chat.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {TestComponent} from "./components/test/test.component";
import {ResultComponent} from "./components/result/result.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ClaimAdministratorComponent} from "./components/claim-administrator/claim-administrator.component";
import {UserComponent} from "./components/user/user.component";
import {AuthorizepatientguardService} from "./services/AuthorizePatientGuard/authorizepatientguard.service";
import {AuthorizedoctorguardService} from "./services/AuthorizeDoctorGuard/authorizedoctorguard.service";
import {AuthorizeforgotguardServiceService} from "./services/AuthorizeforgotguardService/authorizeforgotguard-service.service";
import {AuthorizecombinedguardService} from "./services/authorizecombinedguard/authorizecombinedguard.service";
import {AlertComponent} from "./components/alert/alert.component";
import {AdminSpaceComponent} from "./components/admin-space/admin-space.component";
import {AuthorizeGuardService} from "./services/AuthorizeGuard/authorize-guard.service";

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthorizeforgotguardServiceService]},
  { path: 'home', component: HomeComponent },
  { path: 'alert', component: AlertComponent },
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent, canActivate: [AuthorizeforgotguardServiceService]},
  { path: 'chat', component: ChatComponent, canActivate: [AuthorizecombinedguardService]},
  { path: 'test', component: TestComponent, canActivate: [AuthorizecombinedguardService]},
  { path: 'result', component: ResultComponent, canActivate: [AuthorizecombinedguardService]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthorizecombinedguardService]},
  { path: 'admin-space', component: AdminSpaceComponent, canActivate: [AuthorizeGuardService]},
  { path: 'admin-space/manage-accounts', component: UserComponent, canActivate: [AuthorizeGuardService]},
  { path: 'admin-space/manage-claims', component: ClaimAdministratorComponent, canActivate: [AuthorizeGuardService]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
