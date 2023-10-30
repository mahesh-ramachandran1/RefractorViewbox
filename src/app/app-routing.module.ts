import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JasonLoginComponent } from './Components/login/jsonLogin/json-login/json-login.component';
import { LoginComponent } from './Components/login/login.component';

const routes: Routes = [
  {path : '' , component :LoginComponent},
  {path :'login', component :LoginComponent},
  {path : 'jasonLogin', component :JasonLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
