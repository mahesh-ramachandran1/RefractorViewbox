import { Component, Inject, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { PasswordTextboxComponent } from 'src/app/shared/components/password-text-box/password-text-box.component';
import { ConfirmDialogueViewComponent } from 'src/app/shared/components/confirm-dialogue-view/confirm-dialogue-view.component';
import { LoginService } from 'src/app/services/login.service';
import { AccountService } from 'src/app/services/account/account.service';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  notdefine :boolean =false;
  isCapsLockOn : boolean = false;
  jsonLogin : boolean = true;
  showADLogin : boolean = false;
  logout : boolean = false;
  showTextWarning :boolean = false;
  showUserNameInvalid :boolean = false;
  showPasswordInvalid :boolean = false;
  showAuthorizedAccess :boolean = false;
  passaword! :any;
  selectedLanguage!: string;
  selectedOption!: string;
  projectName: string | undefined;
  clientLogo! : string;
  forceLogoutMessage :string | undefined;
  userName! : string;
  submitText! : string;
 languages:any[] = [
  { value: 'en', title: 'English' },
  { value: 'hi', title: 'Hindi' }
];
options:any[] = ['a','b'];

loginFlag: number = 0;
  oktaLogin: any;
  jsonLoginSet: boolean = true;
  authorizedAccess: boolean | undefined;
  remember: boolean | undefined;
  isForceLogout: any;
  showForceLogoutMessage: boolean | undefined;
  token: string | null | undefined;
  enableAzureADLogin: boolean | undefined;
  LanguageService: any;
  MSALPopup: any;
  setLanguageToDefault: any;
  textWarning: boolean | undefined;
  userNameInvalid: boolean | undefined;
  passwordWarning: boolean | undefined;
  password: string | undefined;
  passwordInvalid: boolean | undefined;
  loading: boolean | undefined;
  modalTitle: string | undefined;
  modalText: string | undefined;
  modalLoading: boolean | undefined;
  modelBtnClose: boolean | undefined;
  modelForceLogout: boolean | undefined;
   isLanguageChanged: boolean = false;
 changedLanguage: any; // Change the type to match the actual type of changedLanguage
  blockFirefox: boolean = false;
  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Perform the action you want to take on Enter key press
      this.login(); // For example, you might want to call your login function
    }
  }
constructor( private accountService : AccountService,private loginService :LoginService, private languageService : LanguageService,private http: HttpClient, private cookieService: CookieService,private router: Router, private location: Location, private window: Window ,@Inject(PLATFORM_ID) private platformId: any) {}



  ngOnInit(): void 
  {
    this.getLanguages();
    this.login();
    this.changedLanguage();
    
    this.logout = false;
    this.projectName ="";
    this.oktaLogin = (window as any)['jsonLogindisable'];
    const isIE = /*@cc_on!@*/false || !!document.DOCUMENT_NODE;
    let net: any = null;
    let username: string | null = null;
    let userDomain: string | null = null;
    this.jsonLoginSet = true;
    const ssoLoginAllow = (window as any)['ssoLogin'];

    if (ssoLoginAllow === true || ssoLoginAllow === 'true') {
      if (isIE) {
        username = net.UserName;
        userDomain = net.UserDomain;
      }
    }

    this.authorizedAccess = false;
    this.cookieService.set("IsLogin", 'true');

    if (this.cookieService.get('authorizedAccess')) {
      const authorizedAccess = this.cookieService.get('authorizedAccess');
      if (authorizedAccess === 'true') {
        this.authorizedAccess = true;
        setTimeout(() => {
          this.cookieService.delete('authorizedAccess', '/');
        }, 1000);
      }
    } else {
      this.authorizedAccess = false;
    }

    this.remember = false;

    this.isForceLogout = localStorage.getItem("forceLogout") ? localStorage.getItem("forceLogout") : (this.cookieService.get("ForceSessionLogout") ? this.cookieService.get("ForceSessionLogout") : 'false');

    this.cookieService.delete("InvalidSession", '/');

    if (this.isForceLogout === "true") {
      this.forceLogoutMessage = "YouWereForcedToQuit";
      this.showForceLogoutMessage = true;
      localStorage.removeItem("forceLogout");
      this.cookieService.delete("ForceSessionLogout", '/');
    }

    this.token = sessionStorage.getItem('token') !== 'undefined' && sessionStorage.getItem('token') !== null ? sessionStorage.getItem('token') : undefined;

    this.showADLogin = (window as any)['showADLogin'];
    this.jsonLogin = (window as any)['jsonLogin'];
    this.enableAzureADLogin = ((window as any)['enableAzureADLogin'] && (window as any)['enableAzureADLogin'].toString().toLowerCase() === "true") ? true : false;
let expireDate = new Date();
expireDate.setDate(expireDate.getDate() + 1);
    this.cookieService.set('Domain_Access', '', { 'expires': expireDate, 'path': '/' });

    if (userDomain !== null && userDomain !== "undefined" && username !== null && username !== "undefined") {
      const dateTime = new Date();
      const dateTimenew = dateTime.getFullYear() + '-' + ('0' + (dateTime.getMonth() + 1)).slice(-2) + '-' + ('0' + dateTime.getDate()).slice(-2) + ' ' + ('0' + dateTime.getHours()).slice(-2) + ':' +
        ('0' + dateTime.getMinutes()).slice(-2) + ':' + ('0' + dateTime.getSeconds()).slice(-2);

      this.accountService.setAduser(username, userDomain, dateTimenew).subscribe((response: { Status: number; }) => {
        if (response.Status == 0) {
          this.languageService.setLanguageToDefault();
          this.ssoLogin(response);
        }
        this.ssoLogin(response); {
          throw new Error('Method not implemented.');
        }
      });
    }

    if (this.router.url.split('/')[5] == 'SSO') {
      this.MSALPopup();
    }
  }
  ssoLogin(response: { Status: number; }) {
    throw new Error('Method not implemented.');
  }
  

  initializeModel(): void {
    // Initialize model and fields here
    this.blockFirefox = this.checkFirefox();
    this.removeCookies();
    this.removeSessionStorage();
    this.checkIE();
  }

  checkFirefox(): boolean {
    const userAgent = navigator.userAgent;
    const browserName = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    const osVersionMatch = userAgent.match(/\(([^)]+)\)/);
    let osVersion: string | string[] | undefined;

    if (osVersionMatch) {
        osVersion = osVersionMatch[1];

        if (typeof osVersion === 'string' && osVersion !== '') {
            osVersion = osVersion.split(";");
        }
    }

    return browserName[0] === "Firefox/52" && osVersion !== undefined && (typeof osVersion === 'string' ? osVersion : osVersion[0]) === "Windows NT 6.1";
}



setLanguage(value: string) {
  // Implement the logic to set the selected language here
  console.log(`Selected language: ${value}`);
}
selectOption(languages: string) {
  this.selectedOption = languages; 
}
removeCookies(): void {
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);
  const cookies = this.cookieService.getAll();
  Object.keys(cookies).forEach(key => {
    if (!['authorizedAccess', '__RequestVerificationToken', 'Domain_Access', '__APPLICATION_LANGUAGE', 'ipAddress', 'ForceSessionLogout'].includes(key)) {
      this.cookieService.delete(key, '/', expireDate.toString());
    }
  });
}

removeSessionStorage(): void {
  sessionStorage.removeItem('draggable-modal');
  sessionStorage.removeItem('dragTop');
  sessionStorage.removeItem('dragLeft');
  sessionStorage.removeItem('logOutTime');
  sessionStorage.removeItem('getSystems');
}

checkIE(): void {
  const isIE = /*@cc_on!@*/false || !!document.DOCUMENT_NODE;
  if (isIE) {
      try {
          
      } catch (e) {
          console.error("Error accessing ActiveXObject: ", e);
          
      }
  }
}


getLanguages(): void 
{
  this.languageService.getLanguages().subscribe((languages: any ) =>{
    const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'en';

    for (let i = 0; i < languages.length; i++) {
      if (languages[i].value.toLowerCase() === lang) {
        this.selectedLanguage = languages[i].title;
        languages.splice(i, 1);
      }

      if (i === languages.length - 1 && !this.selectedLanguage) {
        switch (languages[i].title) {
          case 'German':
          case 'Deutch':
            this.selectedLanguage = languages[i].value === 'en' ? 'German' : 'Deutch';
            break;
          case 'English':
          case 'Englisch':
            this.selectedLanguage = languages[i].value === 'en' ? 'English' : 'Englisch';
            break;
          default:
            this.selectedLanguage = languages[i].title;
            break;
   }

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        this.cookieService.set('__APPLICATION_LANGUAGE', languages[i].value, { expires: expireDate, path: '/' });
        languages.splice(i, 1);
        this.setLanguageToDefault();
      }
    }

    this.logout = sessionStorage.getItem('logout') === 'true';
  });
  
}

JsonOktaLogin(): void {
  this.jsonLoginSet = true;
  this.router.navigate(['JsonLogin']);
}
async getAutoDeleteNewUser(): Promise<void> {
  const response = await this.accountService.getAutoDeleteNewUser();
  sessionStorage.setItem("AutoDeleteNewUser", "");
}


async getViewboxName(): Promise<void> {
  try {
    const response = await this.accountService.getViewboxName().toPromise();
    this.projectName = response;
  } catch (error) {
    console.error('Error fetching ViewboxName:', error);
  }
}

async getInactiveUser(): Promise<void> {
  try {
    const response = await this.accountService.getInactiveUser().toPromise();
    sessionStorage.setItem("InActiveUser", JSON.stringify(response));
  } catch (error) {
    console.error('Error fetching InactiveUser:', error);
  }
}

async getLogoSetting(): Promise<void> {
  try {
    const response = await this.accountService.getLogoSetting().toPromise();
    this.clientLogo = response.LogoName;
  } catch (error) {
    console.error('Error fetching LogoSetting:', error);
  }
}

async getAuthTimeout(): Promise<void> {
  try {
    const response = await this.accountService.getCookieLogoutTime().toPromise();
    sessionStorage.setItem("AuthTimeout", JSON.stringify(response));
  } catch (error) {
    console.error('Error fetching CookieLogoutTime:', error);
  }
}
savePassword(): void
 {
  if (this.remember) {
    localStorage.setItem('rememberMe', 'true'); // Convert boolean to string
  } else {
    localStorage.setItem('rememberMe', 'false'); // Convert boolean to string
  }
}


passwordValidation(): void {
  this.textWarning = false;
}

validateUserName(): void {
  if (this.userName !== "") {
    this.userNameInvalid = false;
    this.textWarning = false;
    this.passwordWarning = false;
    this.showForceLogoutMessage = false;
  } else if (this.userName === "") {
    this.textWarning = false;
    this.userNameInvalid = true;
    this.showForceLogoutMessage = false;
  }
}
validatePassword(): void {
  if (this.password !== "") {
    this.textWarning = false;
    this.passwordInvalid = false;
    this.passwordWarning = false;
    this.showForceLogoutMessage = false;
  } else if (this.password === "") {
    this.passwordWarning = true;
    this.textWarning = false;
    this.showForceLogoutMessage = false;
    const passwordElement = document.getElementById('password');
    if (passwordElement !== null) {
      passwordElement.focus();
    }    }
}

enterLogin(event: KeyboardEvent): void {
  const keyCode = event.which || event.keyCode;

  if (keyCode === 13) {
    if (this.password !== undefined && this.password !== "") {
      // Add logic for handling enter key press after entering password
    }
  }
}

removeError(): void {
  this.textWarning = false;
  this.userNameInvalid = false;
  this.showForceLogoutMessage = false;
}



getSystemInfo(): void 
{
  const logDetail = sessionStorage.getItem("SessionName");
  const logDetails = logDetail !== null ? JSON.parse(logDetail) : null;
  if (logDetails) {
    const logData = {
      BrowserSize: logDetails[0].BrowserSize,
      MonitorResolution: logDetails[0].MonitorResolution,
      IP: logDetails[0].IP,
      OS: logDetails[0].OS,
      JavaScriptActive: logDetails[0].JavaScriptActive,
      CookieEnable: logDetails[0].CookieEnable,
      FlashVersion: logDetails[0].FlashVersion,
      JavaVersion: logDetails[0].JavaVersion,
      BrowserName: logDetails[0].BrowserName,
      BrowserVersion: logDetails[0].BrowserVersion,
      LogType: 'Login',
    };

    this.accountService.getOnlyRights().subscribe(
      response => {
      },
      error => {
      }
    );
  }
}
validateLoginInputs(): boolean {
  this.passwordInvalid = true;
  this.userNameInvalid = true;
  this.passwordWarning = false;
  this.validateUserName();
  this.validatePassword();

  return !this.passwordInvalid && !this.userNameInvalid;
}
userType(state: string): void {
  if (state === 'ActiveDirectoryLog') {
    sessionStorage.setItem('adtoken', 'true');
    this.router.navigate([state]);
  }
}
    
login(): void {
  if (this.jsonLoginSet) {
    return;
  }
  let loginFlag =0;
  if (loginFlag === 0) {
    sessionStorage.setItem('logout', 'false');
    this.getSystemInfo();

    this.loading = false;
    this.modalTitle = '';
    this.modalText = '';
    this.modalLoading = false;
    this.modelBtnClose = false;
    this.modelForceLogout = false;

    const logDetail = sessionStorage.getItem('SessionName');
    const logDetails = JSON.parse(logDetail || 'null');

    if (logDetails) {
      const logData = {
        BrowserSize: logDetails[0]?.BrowserSize,
        MonitorResolution: logDetails[0]?.MonitorResolution,
        IP: logDetails[0]?.IP,
        OS: logDetails[0]?.OS,
        JavaScriptActive: logDetails[0]?.JavaScriptActive,
        CookieEnable: logDetails[0]?.CookieEnable,
        FlashVersion: logDetails[0]?.FlashVersion,
        JavaVersion: logDetails[0]?.JavaVersion,
        BrowserName: logDetails[0]?.BrowserName,
        BrowserVersion: logDetails[0]?.BrowserVersion,
        LogType: 'Login'
      };

      const dateTime = new Date();
      const dateTimenew =
        dateTime.getFullYear() +
        '-' +
        ('0' + (dateTime.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateTime.getDate()).slice(-2) +
        ' ' +
        ('0' + dateTime.getHours()).slice(-2) +
        ':' +
        ('0' + dateTime.getMinutes()).slice(-2) +
        ':' +
        ('0' + dateTime.getSeconds()).slice(-2);

      loginFlag = 1;

      // -----------need to create a account service--------
      this.accountService
        .login(
          this.userName,
          this.password?this.passaword:'',
          this.token?this.token:'',
          this.remember?this.remember:false,
          logData,
          dateTimenew,
          ""
        )
        .subscribe(
          (response: { Status: number; Body: string; }) => {
            localStorage.removeItem('forceLogout');
            localStorage.removeItem('dateFormatObject');
           
            this.isForceLogout = false;

            localStorage.setItem('rememberMe', `${this.remember}`);

            if (!response) {
              this.loading = true;
            }

            if (response?.Status === 0) {
              if (this.isLanguageChanged) {
                this.languageService.saveLanguage(this.changedLanguage);
              }

              this.accountService.getOnlyRights().subscribe(
                (response: any) => {
                  
                },
                (error: any) => {
                  console.error(error);
                }
              );

              // Continue handling response.Status...
            } else if (response?.Status === 1) {
              this.loading = true;
              localStorage.setItem('username', `${this.userName}`);

              setTimeout(() => {
                sessionStorage.setItem('adtoken', 'false');
               
              }, 500);
            } else if (response?.Status === 2) {
              if (response?.Body === 'SystemMaintenance') {
                this.router.navigate(['/Account/Login', { outlets: { primary: 'maintenanceNotification' } }]);
                return;
              }
              this.passwordWarning = false;
              this.textWarning = true;
              this.loading = true;
              loginFlag = 0;
            }
            // Add other conditions as needed
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }
}
msalogin(): void
 {
  if (this.jsonLoginSet) {
    return;
  }

  
    sessionStorage.setItem('logout', 'false');

    // Assuming getSystemInfo is a function defined in your service
    this.getSystemInfo();

   
    this.loading = false;
    this.modalTitle = '';
    this.modalText = '';
    this.modalLoading = false;
    this.modelBtnClose = false;
    this.modelForceLogout = false;

    const logDetail = sessionStorage.getItem('SessionName');
    const logDetails = JSON.parse(logDetail || '[]');
    const logData = {
      BrowserSize: logDetails[0].BrowserSize,
      MonitorResolution: logDetails[0].MonitorResolution,
      IP: logDetails[0].IP,
      OS: logDetails[0].OS,
      JavaScriptActive: logDetails[0].JavaScriptActive,
      CookieEnable: logDetails[0].CookieEnable,
      FlashVersion: logDetails[0].FlashVersion,
      JavaVersion: logDetails[0].JavaVersion,
      BrowserName: logDetails[0].BrowserName,
      BrowserVersion: logDetails[0].BrowserVersion,
      LogType: 'Login'
    };

    const dateTime = new Date();
    const dateTimenew = dateTime.getFullYear() + '-' + ('0' + (dateTime.getMonth() + 1)).slice(-2) + '-' + ('0' + dateTime.getDate()).slice(-2) + ' ' + ('0' + dateTime.getHours()).slice(-2) + ':' +
      ('0' + dateTime.getMinutes()).slice(-2) + ':' + ('0' + dateTime.getSeconds()).slice(-2);

    const loginFlag = 1;

   
};

}



// Add other methods as needed


 