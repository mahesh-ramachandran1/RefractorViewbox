import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { AccountService } from './services/account/account.service';
import { JasonLoginComponent } from './Components/login/jasonLogin/jason-login/jason-login.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    JasonLoginComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    
    
    
    
  ],
  providers: [CookieService,{ provide: Window, useValue: window },{ provide: PLATFORM_ID, useValue: 'browser' },LoginService,AccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
