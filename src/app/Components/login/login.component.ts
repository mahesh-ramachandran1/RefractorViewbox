import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = {
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

  constructor(private http: HttpClient, private cookieService: CookieService,private router: Router) {}

  ngOnInit(): void {
    this.oktaLogin = window['jsonLogindisable'];
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    let net: any = null;
    let username: string | null = null;
    let userDomain: string | null = null;
    this.jsonLoginSet = false;
    const ssoLoginAllow = window['ssoLogin'];

    if (ssoLoginAllow === true || ssoLoginAllow === 'true') {
      if (isIE) {
        net = new ActiveXObject("WScript.NetWork");
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

    this.showADLogin = window['showADLogin'];
    this.jsonLogin = window['jsonLogin'];
    this.enableAzureADLogin = (window['enableAzureADLogin'] && window['enableAzureADLogin'].toString().toLowerCase() === "true") ? true : false;

    this.cookieService.set('Domain_Access', this.showADLogin, { 'expires': expireDate, 'path': '/' });

    if (userDomain !== null && userDomain !== "undefined" && username !== null && username !== "undefined") {
      const dateTime = new Date();
      const dateTimenew = dateTime.getFullYear() + '-' + ('0' + (dateTime.getMonth() + 1)).slice(-2) + '-' + ('0' + dateTime.getDate()).slice(-2) + ' ' + ('0' + dateTime.getHours()).slice(-2) + ':' +
        ('0' + dateTime.getMinutes()).slice(-2) + ':' + ('0' + dateTime.getSeconds()).slice(-2);

      this.accountService.setAduser(username, userDomain, dateTimenew).subscribe(response => {
        if (response.Status == 0) {
          this.languageService.setLanguageToDefault();
          this.ssoLogin(response);
        }
      });
    }

    if (this.router.url.split('/')[5] == 'SSO') {
      this.MSALPopup();
    }
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
    const osVersion = userAgent.match(/\(([^)]+)\)/)[1];
    if (osVersion !== undefined && osVersion !== null && osVersion !== "") {
      osVersion.split(";");
    }
    return browserName[0] === "Firefox/52" && osVersion[0] === "Windows NT 6.1";
  }

  removeCookies(): void {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1);
    const cookies = this.cookieService.getAll();
    Object.keys(cookies).forEach(key => {
      if (!['authorizedAccess', '__RequestVerificationToken', 'Domain_Access', '__APPLICATION_LANGUAGE', 'ipAddress', 'ForceSessionLogout'].includes(key)) {
        this.cookieService.delete(key, '/', expireDate);
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
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
      const net = new ActiveXObject("WScript.NetWork");
      this.model.userName = net.UserName;
      this.model.userDomain = net.UserDomain;
    }
  }

  getLanguages(): void 
  {
    this.http.get<any[]>('/api/languages').subscribe(languages => {
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

      this.model.languages = languages;
      this.model.logout = sessionStorage.getItem('logout') === 'true';
    });
    // Your getLanguages function
  }

  JsonOktaLogin(): void {
    this.jsonLoginSet = true;
    this.router.navigate(['JsonLogin']);
  }
  async getAutoDeleteNewUser(): Promise<void> {
    const response = await accountService.getAutoDeleteNewUser();
    sessionStorage.setItem("AutoDeleteNewUser", response);
  }
  async getLanguage(): Promise<void> {
    const languages = await languageService.getLanguages();
    const lang = $cookies.get('__APPLICATION_LANGUAGE') || "en";
  
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
        $cookies.put('__APPLICATION_LANGUAGE', languages[i].value, { 'expires': expireDate, 'path': '/' });
        languages.splice(i, 1);
        languageService.setLanguageToDefault();
      }
    }
  
    this.languages = languages;
    this.logout = sessionStorage.getItem('logout') == 'true';
  }
  
  async getViewboxName(): Promise<void> {
    if (accountService.getViewBoxN()) {
      this.projectName = accountService.getViewBoxN();
    } else {
      const response = await accountService.getViewboxName();
      accountService.setViewBoxN(response);
      this.projectName = response;
    }
  }
  
  async getInactiveUser(): Promise<void> {
    const response = await accountService.getInactiveUser();
    sessionStorage.setItem("InActiveUser", response);
  }
  
  async getLogoSetting(): Promise<void> {
    const response = await accountService.getLogoSetting();
    this.clientLogo = response.LogoName;
  }
  
  async getAuthTimeout(): Promise<void> {
    const response = await accountService.getCookieLogoutTime();
    sessionStorage.setItem("AuthTimeout", response);
  }
  
  savePassword(): void {
    if (this.remember) {
      localStorage.setItem('rememberMe', this.remember);
    } else {
      localStorage.setItem('rememberMe', false);
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
      document.getElementById('password').focus();
    }
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
    await languageService.setLanguage(language, false);
    isLanguageChanged = true;
    changedLanguage = language;
    await this.getLanguage();
  }
  
  getSystemInfo(): void {
    const logDetail = sessionStorage.getItem("SessionName");
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
      Website: `${$location.$$host}:${$location.$$port}`
    };
  
    accountService.GetSystemInfo(logData)
      .then(function (response) {
        // Handle the response if needed
      });
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
      
  
  // Add other methods as needed
}
