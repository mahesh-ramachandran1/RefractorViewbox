import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ConfirmDialogueViewComponent } from 'src/app/shared/components/confirm-dialogue-view/confirm-dialogue-view.component';
import { PassawordTextBoxComponent } from 'src/app/shared/components/passaword-text-box/passaword-text-box.component';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit 
{
  model = {
    userDomain:Int32Array,
    blockFirefox: false,
    selectedLanguage: '',
    languages: [],
    logout: false,
    clientLogo: '', // Add your clientLogo property here
    projectName: '', // Add your projectName property here
    userName: '', // Add your userName property here
    password: '', // Add your password property here
    // Add other properties as needed
  };
  
   loginFlag: number = 0;
  oktaLogin: any;
  jsonLoginSet: boolean = false;
  authorizedAccess: boolean | undefined;
  remember: boolean | undefined;
  projectName: string | undefined;
  isForceLogout: any;
  forceLogoutMessage: string | undefined;
  showForceLogoutMessage: boolean | undefined;
  token: string | null | undefined;
  showADLogin: any;
  jsonLogin: boolean =false;
  enableAzureADLogin: boolean | undefined;
  accountService: any;
  languageService: any;
  MSALPopup: any;
  setLanguageToDefault: any;
  selectedLanguage: any;
  languages: any;
  logout: boolean | undefined;
  clientLogo: any;
  textWarning: boolean | undefined;
  userName: string | undefined;
  userNameInvalid: boolean | undefined;
  passwordWarning: boolean | undefined;
  password: string | undefined;
  passwordInvalid: boolean | undefined;
  location: any;
  loading: boolean | undefined;
  modalTitle: string | undefined;
  modalText: string | undefined;
  modalLoading: boolean | undefined;
  modelBtnClose: boolean | undefined;
  modelForceLogout: boolean | undefined;
   isLanguageChanged: boolean = false;
 changedLanguage: any; // Change the type to match the actual type of changedLanguage
// let loginFlag: number = 0;
 isIE: boolean = /*@cc_on!@*/false || !!document.DOCUMENT_NODE;
 net: any = null; // Change the type to match the actual type of net
username: any = null; // Change the type to match the actual type of username
 userDomain: any = null; // Change the type to match the actual type of userDomain
  modelClose: boolean | undefined;
  setCursor: any;
  rememberMe: string | undefined;
  adUser: any;
  updateForceLogoutSession: any;
  resetCursor: any;
lang: any;


  constructor(private loginService :LoginService ,private http: HttpClient, private cookieService: CookieService,private router: Router, private window: Window ,@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {

    this.loginService.getLanguages().subscribe(languages =>{
      const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'en';

      for (let i = 0; i < languages.length; i++) {
        if (languages[i].value.toLowerCase() === lang) {
          this.model.selectedLanguage = languages[i].title;
          languages.splice(i, 1);
        }

        if (i === languages.length - 1 && !this.model.selectedLanguage) {
          switch (languages[i].title) {
            case 'German':
            case 'Deutch':
              this.model.selectedLanguage = languages[i].value === 'en' ? 'German' : 'Deutch';
              break;
            case 'English':
            case 'Englisch':
              this.model.selectedLanguage = languages[i].value === 'en' ? 'English' : 'Englisch';
              break;
            default:
              this.model.selectedLanguage = languages[i].title;
              break;
     }

          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);
          this.cookieService.set('__APPLICATION_LANGUAGE', languages[i].value, { expires: expireDate, path: '/' });
          languages.splice(i, 1);
          this.setLanguageToDefault();
        }
      }

      // this.model.languages = languages ;
      this.model.logout = sessionStorage.getItem('logout') === 'true';
    });
    this.oktaLogin = (window as any)['jsonLogindisable'];
    const isIE = /*@cc_on!@*/false || !!document.DOCUMENT_NODE;
    let net: any = null;
    let username: string | null = null;
    let userDomain: string | null = null;
    this.jsonLoginSet = false;
    const ssoLoginAllow = (window as any)['ssoLogin'];

    if (ssoLoginAllow === true || ssoLoginAllow === 'true') {
      if (isIE) {
        // net = new ActiveXObject("WScript.NetWork");
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
    this.projectName = "";

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
    this.cookieService.set('Domain_Access', this.showADLogin, { 'expires': expireDate, 'path': '/' });

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
    this.model.blockFirefox = this.checkFirefox();
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
            // const net = new ActiveXObject("WScript.NetWork");
            // this.model.userName = net.UserName;
            // this.model.userDomain = net.UserDomain;
        } catch (e) {
            console.error("Error accessing ActiveXObject: ", e);
            // Handle the error as needed
        }
    }
}


  getLanguages(): void 
  {
    this.loginService.getLanguages().subscribe(languages =>{
      const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'en';

      for (let i = 0; i < languages.length; i++) {
        if (languages[i].value.toLowerCase() === lang) {
          this.model.selectedLanguage = languages[i].title;
          languages.splice(i, 1);
        }

        if (i === languages.length - 1 && !this.model.selectedLanguage) {
          switch (languages[i].title) {
            case 'German':
            case 'Deutch':
              this.model.selectedLanguage = languages[i].value === 'en' ? 'German' : 'Deutch';
              break;
            case 'English':
            case 'Englisch':
              this.model.selectedLanguage = languages[i].value === 'en' ? 'English' : 'Englisch';
              break;
            default:
              this.model.selectedLanguage = languages[i].title;
              break;
     }

          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);
          this.cookieService.set('__APPLICATION_LANGUAGE', languages[i].value, { expires: expireDate, path: '/' });
          languages.splice(i, 1);
          this.setLanguageToDefault();
        }
      }

      // this.model.languages = languages ;
      this.model.logout = sessionStorage.getItem('logout') === 'true';
    });
    
    // Your getLanguages function
  }

  JsonOktaLogin(): void {
    this.jsonLoginSet = true;
    this.router.navigate(['JsonLogin']);
  }
  async getAutoDeleteNewUser(): Promise<void> {
    const response = await this.accountService.getAutoDeleteNewUser();
    sessionStorage.setItem("AutoDeleteNewUser", response);
  }
  async getLanguage(): Promise<void> {
    const languages = await this.languageService.getLanguages();
    const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'en';
  
    for (let i = 0; i < languages.length; i++) {
      if (languages[i].value.toLowerCase() == lang) {
        this.selectedLanguage = languages[i].title;
        languages.splice(i, 1);
      }
  
      if (i == languages.length - 1 && !this.selectedLanguage) {
        switch (languages[i].title) {
          case 'German':
          case 'Deutch':
            if (languages[i].value == 'en')
              this.selectedLanguage = 'German';
            else
              this.selectedLanguage = 'Deutch';
            break;
          case "English":
          case "Englisch":
            if (languages[i].value == 'en')
              this.selectedLanguage = 'English';
            else
              this.selectedLanguage = 'Englisch';
            break;
          default:
            this.selectedLanguage = languages[i].title;
            break;
        }
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        this.cookieService.set('__APPLICATION_LANGUAGE', languages[i].value, expireDate, '/');
        languages.splice(i, 1);
        this.languageService.setLanguageToDefault();
      }
    }
  
    this.languages = languages;
    this.logout = sessionStorage.getItem('logout') == 'true';
  }
  
  async getViewboxName(): Promise<void> {
    if (this.accountService.getViewBoxN()) {
      this.projectName = this.accountService.getViewBoxN();
    } else {
      const response = await this.accountService.getViewboxName();
      this.accountService.setViewBoxN(response);
      this.projectName = response;
    }
  }
  
  async getInactiveUser(): Promise<void> {
    const response = await this.accountService.getInactiveUser();
    sessionStorage.setItem("InActiveUser", response);
  }
  
  async getLogoSetting(): Promise<void> {
    const response = await this.accountService.getLogoSetting();
    this.clientLogo = response.LogoName;
  }
  
  async getAuthTimeout(): Promise<void> {
    const response = await this.accountService.getCookieLogoutTime();
    sessionStorage.setItem("AuthTimeout", response);
  }
  
  savePassword(): void {
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
  
  async setLanguage(language: string): Promise<void> {
    await this.languageService.setLanguage(language, false);
    const isLanguageChanged = true;
    const changedLanguage = language;
    await this.getLanguage();
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
        Website: `${this.location.host}:${this.location.port}`
      };
  
      this.accountService.GetSystemInfo(logData)
        .then((response: any) => {
          // Handle the response if needed
        })
        .catch((error: any) => {
          // Handle errors if any
        });
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

        this.accountService
          .login(
            this.userName,
            this.password,
            this.token,
            this.remember,
            logData,
            dateTimenew
          )
          .subscribe(
            (response: { Status: number; Body: string; }) => {
              localStorage.removeItem('forceLogout');
              localStorage.removeItem('dateFormatObject');
              // $cookies.delete('__DATE_FORMAT');
              // $cookies.delete('IsLogin');
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
                    // Handle the response if needed
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
                  // this.router.navigate(['AuthenticationPage']);
                  // this.router.navigate(['/authentication']); // Use Angular Router to navigate
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

    // if (loginFlag == 0) {
      sessionStorage.setItem('logout', 'false');

      // Assuming getSystemInfo is a function defined in your service
      this.getSystemInfo();

      // Assuming validateLoginInputs is a function defined in your service
      // if (this.validateLoginInputs()) {

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

      // this.ADlogin(this.userName, '', this.userDomain, dateTimenew)
      // {
      //     if (Response !== undefined || Response !== null) {
      //       localStorage.removeItem('dateFormatObject');
      //       localStorage.removeItem('__DATE_FORMAT');
      //       localStorage.removeItem('IsLogin');

      //       localStorage.setItem('rememberMe', this.rememberMe || ''); // Assuming rememberMe is a string

      //       if (!Response) {
      //         this.loading = true;
      //       }

      //       if (Response.length === 0) {
      //         if (this.isLanguageChanged) {
      //           // this.saveLanguage(this.changedLanguage);
      //         }
      //         this.adUser = JSON.parse(sessionStorage.getItem('adtoken') || '{}');
      //         localStorage.setItem('username', `${this.userName}`);
      //         this.modalTitle = 'EmailSent';
      //         this.modalText = 'AuthenticationTokenSentViaEmail';
      //         this.modalLoading = false;
      //         this.loading = true;
      //         this.modelBtnClose = true;
      //         this.modelForceLogout = false;
      //         const loginFlag = 0;
      //         this.router.navigate(['/Dashboard/list']);
      //       } else if (Response.length === 1) {
      //         this.loading = true;
      //         localStorage.setItem('username', `${this.userName}`);
      //         setTimeout(() => {
      //           this.router.navigate(['/AuthenticationPage']);
      //         }, 500);
      //       } else if (Response.length === 2) {
      //         // if ( SystemMaintanance=== 'SystemMaintanance') {
      //         //   window.location.href = '/Account/Login#/maintenanceNotification';
      //           return;
      //         }
      //         this.passwordWarning = false;
      //         this.textWarning = true;
      //         this.loading = true;
      //         const loginFlag = 0;
            // } else if (Response.length === 7) 
            // {
            //   this.modalTitle = Response.Header;
            //   this.modalText = Response.Body;
            //   this.modalLoading = false;
            //   this.loading = true;
            //   this.modelClose = true;
            //   this.modelBtnClose = true;
            //   this.modelForceLogout = true;
            //   document.querySelector('#confirmDialog')?.classList.add('show');

            //   // Bind function to Force & Ok button
            //   const forceButton = document.querySelector('#btnForceConfirmYes');
            //   forceButton?.addEventListener('click', () => {
            //     this.setCursor();
            //     this.updateForceLogoutSession(this.userName)
            //       .subscribe((resp: any) => {
            //         this.resetCursor();
            //         if (resp.status) {
            //           const loginFlag = 0;
            //           document.querySelector('#confirmDialog')?.classList.delete('show');
            //           this.msalogin();
            //         }
            //       });
            //   });

            //   const okButton = document.querySelector('#btnYesConfirmYesNo');
            //   okButton?.addEventListener('click', () => {
            //     const loginFlag = 0;
            //     document.querySelector('#confirmDialog')?.classList.delete('show');
            //   });}
//             }else {
//               const loginFlag = 0;
//               this.loading = true;
//               this.modalTitle = Response.Header;
//               this.modalText = response.Body;
//               this.modalLoading = false;
//               this.modelBtnClose = true;
//               this.modelClose = true;
//               document.querySelector('#confirmDialog')?.classList.add('show');

//               // Bind function to Ok button
//               const okButton = document.querySelector('#btnYesConfirmYesNo');
//               okButton?.addEventListener('click', () => {
//                 if (response.Status !== 10) {
//                   document.querySelector('#confirmDialog')?.classList.delete('show');
//                 } else {
//                   window.location.href = '/Account/Login#/';
//                 }
//               });
//             }
//           }ADlogin(userName: string | undefined, arg1: string, userDomain: any, dateTimenew: string) {
//     throw new Error('Method not implemented.');
//   }
//  else {
//             this.resetCursor();
//           }
//         });
//     }
//   saveLanguage(changedLanguage: any) {
//     throw new Error('Method not implemented.');
//   }
//   ADlogin(userName: string | undefined, arg1: string, userDomain: any, dateTimenew: string) {
//     throw new Error('Method not implemented.');
//   }
//   }
 

  ssoLogin(Response , Int32Array); {
    localStorage.removeItem('forceLogout');
    localStorage.removeItem('dateFormatObject');
    localStorage.removeItem('__DATE_FORMAT');
    localStorage.removeItem('IsLogin');
    // isForceLogout :boolean = false;

    localStorage.setItem('rememberMe', `true`);
    if (!Response){
        // model.loading = true;
        // let changedLanguage = 'en';
        // let languageService ='';
    //     let Response: { Status: number  } 
    // if (Response  && Response.Status === 0) {
    //     if (onlanguagechange) {
    //         // languageService.saveLanguage(changedLanguage.toString());
    //     }}

        // accountService.getOnlyRights().subscribe((response) => {
        //     var hasAdminRight, hasDocumentArchive, hasExportRight, hasAVAdmin, hasAdUser, hasAdminDelete;
        //     var expireDate = new Date();
        //     expireDate.setDate(expireDate.getDate() + 1);

        //     if (response.data !== undefined && response.data !== null && response.data !== "") {
        //         hasAdminRight = response.data.AdminRights;
        //         hasAVAdmin = response.data.AVAdminRights;
        //         hasDocumentArchive = response.data.DocumentArchiveRights;
        //         hasAdUser = response.data.ADUser;
        //         hasAdminDelete = response.data.AdminDelete;

        //         if (response.status === 200) {
        //             hasExportRight = response.data.ExportRights;
        //         } else {
        //             hasExportRight = false;
        //         }

        //         localStorage.setItem('hasExportRight', hasExportRight);
        //         if (hasAdminRight) localStorage.setItem('hasAdminRight', hasAdminRight);
        //         localStorage.setItem('hasDocumentArchive', hasDocumentArchive);
        //         if (hasAVAdmin) localStorage.setItem('hasAVAdmin', hasAVAdmin);
        //         localStorage.setItem('hasAdUser', hasAdUser);
        //         localStorage.setItem('hasAdUserSSO', hasAdUser);
        //         localStorage.setItem('hasAdminDelete', hasAdminDelete);
        //     } else {
        //         localStorage.removeItem('hasExportRight');
        //         localStorage.removeItem('hasAdminRight');
        //         localStorage.removeItem('hasDocumentArchive');
        //         localStorage.removeItem('hasDocumentation');
        //         localStorage.removeItem('hasAVAdmin');
        //         localStorage.removeItem('hasAdUser');
        //         localStorage.removeItem('hasAdUserSSO');
        //         localStorage.removeItem('hasAdminDelete');
        //     }

        //     accountService.getDocumentsByUserRights().subscribe((response) => {
        //         if (response.DataRetrievalProtocol && response.ProcessDocumentation) {
        //             localStorage.setItem('hasDocumentation', 'false');
        //         } else {
        //             localStorage.setItem('hasDocumentation', 'true');
        //         }

        //         window.location.href = "/#/Dashboard/list";
        //     });
        // });
    }
    // Add other response.Status conditions here...
    // ...
};

// model.MSALPopup = function () {

//   const msalConfig = {
//       auth: {
//           clientId: (window as any).azureADClientId,
//           authority: `https://login.microsoftonline.com/${(window as any).azureADTenantId}`,
//           redirectUri: (window as any).azureADRedirectUri,
//           tenantId: (window as any).azureADTenantId
//       },
//       cache: {
//           cacheLocation: "sessionStorage",
//           storeAuthStateInCookie: false,
//       },
//       system: {
//           loggerOptions: {
//               loggerCallback: (level: any, message: any, containsPii: any) => {
//                   if (containsPii) {
//                       return;
//                   }
//                   switch (level) {
//                       case msal.LogLevel.Error:
//                           console.error(message);
//                           return;
//                       case msal.LogLevel.Info:
//                           console.info(message);
//                           return;
//                       case msal.LogLevel.Verbose:
//                           console.debug(message);
//                           return;
//                       case msal.LogLevel.Warning:
//                           console.warn(message);
//                           return;
//                   }
//               }
//           }
//       }
//   };

//   const loginRequest = {
//       scopes: ["User.Read"]
//   };

//   const myMsal = new msal.PublicClientApplication(msalConfig);

//   // For Popup

//   myMsal.loginPopup(loginRequest)
//       .then((loginResponse: { account: { username: any; }; }) => {

//           var userName = loginResponse.account.username;

//           accountService.MSAlogin(userName).subscribe((response: { Status: number; Body: any; Header: any; }) => {
//               var r = response;
//               if (response.Status == 0) {
//                   model.userName = response.Body;
//                   model.msalogin();
//               }
//               else {
//                   model.modalTitle = response.Header;
//                   model.modalText = response.Body;
//                   model.modalLoading = false;
//                   model.loading = true;
//                   model.modelClose = true;
//                   model.modelBtnClose = true;
//                   model.modelForceLogout = false;
//                   angular.element(("#confirmDialog")).modal('show');
//                   var okButton = angular.element('#btnYesConfirmYesNo');
//                   okButton.bind('click', () => {
//                       angular.element(("#confirmDialog")).modal('hide');
//                   });
//               }
//           });
//           console.log(loginResponse);

//       }).catch((error: { errorCode: string; }) => {
//           //login failure
//           var lang = localStorage.getItem('__APPLICATION_LANGUAGE') || "en";
//           if (error.errorCode !== "user_cancelled") {
//               var scope = model;
//               scope.$applyAsync(() => {
//                   scope.modalLoading = false;
//                   scope.modelBtnClose = true;
//                   scope.modelClose = true;
//                   scope.modelForceLogout = false;
//                   scope.modalTitle = "Warning";
//                   scope.modalText = lang == 'en' ? 'Something went wrong. Please try again or contact to support team.' : 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder wenden Sie sich an das Support-Team.';
//               });

//               angular.element("#confirmDialog").modal('show');
//               // Bind function to Ok button
//               var okButton = angular.element('#btnYesConfirmYesNo');
//               okButton.bind('click', (e: any) => {
//                   angular.element(("#confirmDialog")).modal('hide');
//               });
//           }
//           console.log(error);
//       });
// };



  // Add other methods as needed

function validateLoginInputs() {
  throw new Error('Function not implemented.');
}
  



function ssoLogin(response: any, any: any) {
  throw new Error('Function not implemented.');
}
   }}
