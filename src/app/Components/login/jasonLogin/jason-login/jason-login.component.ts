import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from 'src/app/services/account/account.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { Location } from '@angular/common';


declare global {
  interface Window {
    oktabaseUrl: string;
    oktaredirectUri: string;
    oktaclientId: string;
    oktalogo: string;
    oktaOrgUri: string;
  }
}
@Component({
  selector: 'app-jason-login',
  templateUrl: './jason-login.component.html',
  styleUrls: ['./jason-login.component.css']
})
export class JasonLoginComponent implements OnInit {
  projectName!: string;
  blockFirefox: boolean = false;
  model: any = {};
  userAgent!: string;
  browserName: any[] = [];
  osVersion!: string  ;
  clientLogo: any;
  remember: any;
  textWarning!: boolean;
  userName!: string;
  userNameInvalid!: boolean;
  passwordWarning!: boolean;
  showForceLogoutMessage!: boolean;
  password!: string;
  passwordInvalid!: boolean;
  isLanguageChanged!: boolean;
  changedLanguage!: string;
  Location: any;
  payload: any;
  oktalogo: any;
  loading: boolean = false;
  oktabaseUrl: any;
  oktaredirectUri: any;
  oktaclientId: any;
  oktaOrgUri: any;
  isForceLogout: boolean = false;
  modalTitle!: string;
  modalText!: string;
  modalLoading: boolean = false;
  modelForceLogout: boolean = false;
  modelBtnClose: boolean = false;
  modelClose: boolean = false;
  osVersion1!: string[];
  constructor(private router: Router,private route: ActivatedRoute,private languageService: LanguageService,private cookies: CookieService,private accountService: AccountService) { }

  ngOnInit(): void {
    this.userAgent = navigator.userAgent;
    this.browserName = this.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (this.userAgent) {
      const match = this.userAgent.match(/\(([^)]+)\)/);
      if (match) {
        this.osVersion = match[1];
      }
    }
    if (this.osVersion && this.osVersion.length > 0) {
      this.osVersion1 = this.osVersion.split(";");
    }

    if (this.browserName[0] == "Firefox/52" && this.osVersion[0] == "Windows NT 6.1") {
      this.blockFirefox = true;
    }

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const cookies = this.cookies.getAll();

    Object.keys(cookies).forEach(key => {
      if (key != 'authorizedAccess' && key != '__RequestVerificationToken' && key != 'Domain_Access' && key != '__APPLICATION_LANGUAGE' && key != 'ipAddress' && key != "okta" && key != "id_token") {
        this.cookies.delete(key, '/');
      }
    });

    
    sessionStorage.removeItem('draggable-modal');
    sessionStorage.removeItem('dragTop');
    sessionStorage.removeItem('dragLeft');
    sessionStorage.removeItem('logOutTime');
    sessionStorage.removeItem('getSystems');

    let isLanguageChanged = false;
    let changedLanguage: any;
    let loginFlag = 0;

    this.model.userName = this.cookies.get('okta');
    this.model.authorizedAccess = false;

    this.model.oktabaseUrl = window.oktabaseUrl;
    this.model.oktaredirectUri = window.oktaredirectUri;
    this.model.oktaclientId = window.oktaclientId;
    this.model.oktalogo = window.oktalogo;
    this.model.oktaOrgUri = window.oktaOrgUri;
    this.cookies.set('IsLogin', 'true');

    if (this.cookies.get('authorizedAccess')) {
      const authorizedAccess = this.cookies.get('authorizedAccess');
      if (authorizedAccess == 'true') {
        this.model.authorizedAccess = true;

        setTimeout(() => {
          this.cookies.delete('authorizedAccess', '/');
        }, 1000);
      }
    } else {
      this.model.authorizedAccess = false;
    }

    this.model.remember = false;
    this.model.password = "";
    this.model.projectName = "";
    this.model.isForceLogout = false;
    this.model.userNameInvalid = false;
    this.model.passwordInvalid = false;
    this.model.loading = true;
    this.model.languages = [];
    this.model.submitText = 'Login';

    this.languageService.setLanguageToDefault();
    this.getLanguage();
    this.getViewboxName();
    this.getLogoSetting();
    this.getAuthTimeout();
    localStorage.removeItem('isSelectedSystemEnabled');
    sessionStorage.removeItem('draggable-modal');

    this.cookies.delete("InvalidSession", '/');

    this.model.payload = {
      "username": "",
      "password": "",
      "options": {
        "multiOptionalFactorEnroll": true,
        "warnBeforePasswordExpired": true
      }
    };



  }
  

  
  getLanguage() {
    this.languageService.getLanguages().subscribe(languages => {
      const lang = this.cookies.get('__APPLICATION_LANGUAGE') || "en";
      for (let i = 0; i < languages.length; i++) {
        if (languages[i].value.toLowerCase() == lang) {
          this.model.selectedLanguage = languages[i].title;
          languages.splice(i, 1);
        }

        if (i == languages.length - 1 && !this.model.selectedLanguage) {
          switch (languages[i].title) {
            case 'German':
            case 'Deutch':
              if (languages[i].value == 'en') {
                this.model.selectedLanguage = 'German';
              } else {
                this.model.selectedLanguage = 'Deutch';
              }
              break;
            case "English":
            case "Englisch":
              if (languages[i].value == 'en') {
                this.model.selectedLanguage = 'English';
              } else {
                this.model.selectedLanguage = 'Englisch';
              }
              break;
            case "French":
            case "Französisch":
              if (languages[i].value == 'en') {
                this.model.selectedLanguage = 'French';
              } else {
                this.model.selectedLanguage = 'Französisch';
              }
              break;
            case "Spanish":
            case "Spanisch":
              if (languages[i].value == 'en') {
                this.model.selectedLanguage = 'Spanish';
              } else {
                this.model.selectedLanguage = 'Spanisch';
              }
              break;
            default:
              this.model.selectedLanguage = languages[i].title;
              break;
          }
        }
      }
    });
  }

  async getViewboxName() {
    var viewBoxN = this.accountService.getViewboxName();

    if (viewBoxN) {
      return viewBoxN;
    } else {
      const response = await this.accountService.getViewboxName();
      this.accountService.setViewBoxN(response);
      return response;
    }
  }

  getLogoSetting() {
    this.accountService.getLogoSetting().subscribe((response) => {
      this.clientLogo = response.LogoName;
    });
  }

  getAuthTimeout() {
    this.accountService.getCookieLogoutTime().subscribe((response) => {
      sessionStorage.setItem("AuthTimeout", response);
    });
  }
  savePassword() {
    if (this.remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.setItem('rememberMe', 'false');
    }
  }

  passwordValidation() {
    this.textWarning = false;
  }
  
  validateUserName() {
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
  
  onEnter(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }
  validatePassword() {
    if (this.password !== "") {
      this.textWarning = false;
      this.passwordInvalid = false;
      this.passwordWarning = false;
      this.showForceLogoutMessage = false;
    } else {
      this.passwordWarning = true;
      this.textWarning = false;
      this.showForceLogoutMessage = false;
      const passwordInput = document.querySelector('#password') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }
  
  enterLogin(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13 && this.password !== undefined && this.password !== "") {
    }
  }

  removeError() {
    this.textWarning = false;
    this.userNameInvalid = false;
    this.showForceLogoutMessage = false;
  }
  setLanguage(language: string) {
    this.languageService.setLanguage(language, false);
    this.isLanguageChanged = true;
    this.changedLanguage = language;
    this.getLanguage();
  }


  getSystemInfo() {
    const logDetail = sessionStorage.getItem('SessionName');
  
    if (logDetail !== null) {
      const logDetails = JSON.parse(logDetail);
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
        Website: `${this.Location.host}:${this.Location.port}`
      };
  
      this.accountService.GetSystemInfo(logData)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
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
  
  jsonLogin(): void {
    this.payload.username = this.userName;
    this.payload.password = this.password;
  
    this.accountService.oktaLogin(this.userName,"")
    .subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }

  
  
  ssoLogin(response: any): void {
    localStorage.removeItem('forceLogout');
    localStorage.removeItem('dateFormatObject');
    this.cookies.delete('__DATE_FORMAT');
    this.cookies.delete('IsLogin');
    this.isForceLogout = false;

    localStorage.setItem('rememberMe', this.remember.toString());
    if (!response)
      this.loading = true;

    if (response.Status === 0) {
      if (this.isLanguageChanged) {
        this.languageService.saveLanguage(this.changedLanguage);
      }

      this.accountService.getOnlyRights().subscribe((rightsResponse: any) => {
        const hasAdminRight = rightsResponse.data.AdminRights;
        const hasAVAdmin = rightsResponse.data.AVAdminRights;
        const hasOkta = rightsResponse.data.OktaUser;
        const hasDocumentArchive = rightsResponse.data.DocumentArchiveRights;
        const hasAdUser = rightsResponse.data.ADUser;
        const hasAdminDelete = rightsResponse.data.AdminDelete;

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);

        let hasExportRight = false;
        if (rightsResponse.status === 200) {
          hasExportRight = rightsResponse.data.ExportRights;
        }

        this.cookies.set('hasExportRight', hasExportRight.toString(), { expires: expireDate, path: '/' });

        if (hasAdminRight) {
          this.cookies.set('hasAdminRight', hasAdminRight.toString(), { expires: expireDate, path: '/' });
        }

        this.cookies.set('hasDocumentArchive', hasDocumentArchive.toString(), { expires: expireDate, path: '/' });

        if (hasAVAdmin) {
          this.cookies.set('hasAVAdmin', hasAVAdmin.toString(), { expires: expireDate, path: '/' });
        }

        if (hasOkta) {
          this.cookies.set('hasOkta', hasOkta.toString(), { expires: expireDate, path: '/' });
        }

        this.cookies.set('hasAdUser', hasAdUser.toString(), { expires: expireDate, path: '/' });
        this.cookies.set('hasAdUserSSO', hasAdUser.toString(), { expires: expireDate, path: '/' });
        this.cookies.set('hasAdminDelete', hasAdminDelete.toString(), { expires: expireDate, path: '/' });

        this.accountService.getDocumentsByUserRights().subscribe((docResponse: any) => {
          if (docResponse.DataRetrievalProtocol && docResponse.ProcessDocumentation) {
            this.cookies.set('hasDocumentation', 'false', { expires: expireDate, path: '/' });
          } else {
            this.cookies.set('hasDocumentation', 'true', { expires: expireDate, path: '/' });
          }

          this.router.navigate(['/Dashboard/list']);
        });
      });

    } else if (response.Status === 1) {
      this.loading = true;
      localStorage.setItem('username', this.userName);
      setTimeout(() => {
        sessionStorage.setItem('adtoken', 'false');
        this.router.navigate(['/AuthenticationPage']);
      }, 500);

    } else if (response.Status === 2) {
      if (response.Body === 'SystemMaintanance') {
        window.location.href = '/Account/Login#/maintenanceNotification';
        return;
      }

      this.passwordWarning = false;
      this.textWarning = true;
      this.loading = true;
      const loginFlag = 0;

    } else if (response.Status === 4) {
      this.modalTitle = 'SendingAuthenticationToken';
      this.modalText = 'YouAreSigningUpForTheFirstTimeSoWeAreSendingYouAuthenticationMail';
      this.modalLoading = true;
      this.modelForceLogout = false;
      this.modelBtnClose = true;
      this.modelClose = true;

      const confirmDialog = document.getElementById('confirmDialog');
      confirmDialog?.classList.add('show');

      this.accountService.getTwoStepToken(this.userName).subscribe((tokenResponse: any) => {
        if (tokenResponse.Status === 0) {
          localStorage.setItem('username', this.userName);
          localStorage.setItem('firstTime', 'true');

          this.modalTitle = 'EmailSent';
          this.modalText = 'AuthenticationTokenSentViaEmail';
          this.modalLoading = false;

          const okButton = document.getElementById('btnYesConfirmYesNo');
          okButton?.addEventListener('click', () => {
            confirmDialog?.classList.remove('show');
            setTimeout(() => {
              this.router.navigate(['/AuthenticationPage']);
            }, 500);
          });

          this.loading = true;

        } else {
          const loginFlag = 0;
          this.loading = true;

          this.modalTitle = tokenResponse.Header;
          this.modalText = tokenResponse.Body;
          this.modalLoading = false;
          this.modelBtnClose = true;
          this.modelClose = true;

          confirmDialog?.classList.add('show');

          const okButton = document.getElementById('btnYesConfirmYesNo');
          okButton?.addEventListener('click', () => {
            confirmDialog?.classList.remove('show');
          });
        }
      });
    }


  }
  
}
