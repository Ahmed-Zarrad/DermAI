import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './Components/home/home.component';
import { AuthInterceptorService } from './Services/AuthInterceptor/auth-interceptor.service';
import { SignupComponent } from './components/signup/signup.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ResultComponent } from './components/result/result.component';
import { TestComponent } from './components/test/test.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { AlertComponent } from './components/alert/alert.component';
import { AdminSpaceComponent } from './components/admin-space/admin-space.component';
import { ClaimAdministratorComponent } from "./components/claim-administrator/claim-administrator.component";
import { UserComponent } from "./components/user/user.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    PageNotFoundComponent,
    NavBarComponent,
    ResultComponent,
    TestComponent,
    ProfileComponent,
    ChatComponent,
    AlertComponent,
    AdminSpaceComponent,
    ClaimAdministratorComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
