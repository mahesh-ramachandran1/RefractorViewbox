import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-json-logout',
  templateUrl: './json-logout.component.html',
  styleUrls: ['./json-logout.component.css']
})
export class JasonLogoutComponent implements OnInit {

  constructor( private router: Router,
    private cookieService: CookieService,
    private accountService: AccountService ) { }

  ngOnInit(): void {

    this.accountService.logout().subscribe(() => {
      this.cookieService.delete('_UserName');
      this.cookieService.delete('_CurrentUser');

      this.cookieService.delete('hasAVAdmin');
      this.cookieService.delete('hasAdminRight');
      this.cookieService.delete('hasDocumentArchive');
      this.cookieService.delete('hasDocumentation');
      this.cookieService.delete('isAVAdmin');
      this.cookieService.delete('hasExportRight');
      this.cookieService.delete('hasAdUser');

      this.cookieService.delete('tableExist');
      this.cookieService.delete('viewExist');
      this.cookieService.delete('documentArchiveExist');
      this.cookieService.delete('exportCenter');


      sessionStorage.clear();
      localStorage.clear();
      sessionStorage.setItem('In Process', 'false');
      this.router.navigate(['login']); 
    });

  }

}
