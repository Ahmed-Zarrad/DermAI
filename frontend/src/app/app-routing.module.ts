import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import {ChatbotComponent} from "./components/chatbot/chatbot.component";
import {SignupComponent} from "./components/signup/signup.component";
import {PageNotFoundComponent} from "./components/page-not-found/page-not-found.component";
import {TestComponent} from "./components/test/test.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'test', component: TestComponent },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
