import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
// import { TranslateService } from '@ngx-translate/core';
// import { DynamicLocaleService } from 'ng-dynamic';
import { AccountService } from '../account/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
    baseApiUrl :string = environment.baseApiUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    // private translateService: TranslateService,
    // private dynamicLocaleService: DynamicLocaleService,
    private accountService: AccountService
  ) {}

  getLanguages(): Observable<any[]> {
    const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'de';

    return this.http.get<any[]>('http://localhost:55710/api/Language/' + lang)
      .pipe(
        map((response: any[]) => {
          return response.map((item: any) => ({
            id: item.Id,
            value: item.CountryCode,
            title: item.Description,
          }));
        })
      );
  }
      
  saveLanguage(lang: string) {
    // Implement your language mapping here (if necessary)

    return this.http.patch('/api/LastUsed/' + lang, {}).toPromise().then((response) => {
      this.setLanguage(lang, false);
      this.cookieService.delete('__DATE_FORMAT');
      localStorage.removeItem('dateFormatObject');
      this.init();
      return response;
    });
  }

  setLanguage(lang: string, save: boolean) {
    localStorage.setItem('languageChanged', 'true');
    this.cookieService.delete('__APPLICATION_LANGUAGE');
    lang = lang || 'de';
    // this.translateService.use(lang);

    switch (lang) {
      case 'en':
        // this.dynamicLocaleService.set('en-us');
        break;
      case 'de':
        // this.dynamicLocaleService.set('de-de');
        break;
      default:
        // this.dynamicLocaleService.set('en-us');
        break;
    }

    if (save) {
      this.saveLanguage(lang);
    }
  }

  getLastUsed() {
    return this.http.get('/api/LastUsed').toPromise();
  }

  getDateFormat() {
    return this.http.get('/api/Account/GetDateFormat').toPromise();
  }

  setLanguageToDefault() {
    const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'de';
    this.setLanguage(lang, false);
  }

  init() {
    const savedLang = this.cookieService.get('__APPLICATION_LANGUAGE');
    const savedDateFormat = this.cookieService.get('__DATE_FORMAT');
    const localDateFormat = localStorage.getItem('dateFormatObject');
    const isLoginPage = this.cookieService.get('IsLogin');

    if (savedLang == null) {
      this.getLastUsed().then(
        (response: any) => {
          if (response && response.CountryCode) {
            this.setLanguage(response.CountryCode, false);
          } else if (!response.CountryCode) {
            // Handle the case when no language is found
          } else {
            this.setLanguageToDefault();
          }
        },
        () => {
          // Handle the case when something went wrong
          this.setLanguageToDefault();
        }
      );
    } else {
      switch (savedLang) {
        case 'en':
        //   this.dynamicLocaleService.set('en-us');
        //   this.translateService.use('en');
          break;
        case 'de':
        //   this.dynamicLocaleService.set('de-de');
        //   this.translateService.use('de');
          break;
        default:
        //   this.dynamicLocaleService.set('en-us');
        //   this.translateService.use('en');
          break;
      }
    }

    if ((!savedDateFormat || !localDateFormat) && !isLoginPage) {
      this.getDateFormat().then(
        (response: any) => {
          if (response) {
            this.cookieService.set('__DATE_FORMAT', response.key, { expires: 1 });
            localStorage.setItem('dateFormatObject', JSON.stringify(response));
          } else {
            this.cookieService.set('__DATE_FORMAT', 'en-gb', { expires: 1 });
            localStorage.setItem(
              'dateFormatObject',
              '{"key":"en-gb","value":"English (Great Britain)","format":"dd-MM-yyyy"}'
            );
          }
        },
        () => {
          // Handle the case when something went wrong
        }
      );
    }
  }


  
}
