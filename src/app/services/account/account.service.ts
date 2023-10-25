import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, filter, forkJoin, map, of, takeUntil, throwError, timer } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl1 = environment.baseApiUrl;
  private apiUrl = environment.baseApiUrl +'/api/Account/'; // Update with your API URL

  private antiForgeryToken!: string;
  private apiList: Array<Observable<any>> = [];
  private diferredList: Array<Promise<any>> = [];
  private stopTimer = new BehaviorSubject<boolean>(false);
  private pendingRequests = new BehaviorSubject<number>(0);
  renderer: any;
  private resetTimerSubscription: Subscription | undefined;
  viewBoxName: string | undefined;
  cookieService: any;



  
  constructor(private http: HttpClient) {
    this.antiForgeryToken = (<HTMLInputElement>document.querySelector('input[name="__RequestVerificationToken"]'))?.value;
    this.checkBrowser();
  }
  private checkBrowser() 
  {
    const ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1 || ua.indexOf('Edge/') > -1) {
      const timer = 10000;
    }
  }

  public resetCursorFn() {
    timer(2000)
      .pipe(takeUntil(this.stopTimer))
      .subscribe(() => {
        const apiArray = [
          "/api/ViewboxSettings/GetViewboxServers",
          "/api/ViewboxSettings/GetViewboxInformation",
          "/api/ViewboxSettings/AddViewboxServerPerformance"
        ];
  
        const observables = apiArray.map(api => this.http.get(api));
  
        forkJoin(observables)
          .subscribe(
            () => {
              document.querySelector('html')?.setAttribute('style', 'cursor: auto');
              document.querySelector('body')?.setAttribute('style', 'cursor: auto; pointer-events: auto');
              const processingModal = document.querySelector('.Processing-modal');
              if (processingModal) {
                processingModal.classList.remove('Processing-modal');
                processingModal.classList.add('hidden');
              }
              const loadElement = document.querySelector('.load');
              if (loadElement) {
                loadElement.setAttribute('style', 'visibility: hidden');
              }
            },
            (error) => {
              // Handle error
            }
          );
      });
  }
  

  public listOfApi(promise: Observable<any>, deffered: Promise<any>, closeLoader: boolean = true) {
    this.apiList.push(promise);
    this.diferredList.push(deffered);
    if (closeLoader) {
      this.resetCursorFn();
    }
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return throwError(error); // Return an observable with the error
  }
  
  setAduser(username: string, userdomain: string, dateTime: string): Observable<any> 
  {
    const logDetails = JSON.parse(sessionStorage.getItem("SessionName") || '{}');
    
    if (!logDetails) {
      // Handle the case where logDetails is null or undefined
      return throwError("Error retrieving log details from session storage");
    }

    const userObj = {
      UserName: username,
      domain: userdomain,
      userSystemInfoDto: {
        BrowserSize: logDetails[0].BrowserSize,
        MonitorResolution: logDetails[0].BrowserSize,
        IP: logDetails[0].IP,
        OS: logDetails[0].OS,
        JavaScriptActive: logDetails[0].JavaScriptActive,
        CookieEnable: logDetails[0].CookieEnable,
        FlashVersion: logDetails[0].FlashVersion,
        JavaVersion: logDetails[0].JavaVersion,
        BrowserName: logDetails[0].BrowserName,
        BrowserVersion: logDetails[0].BrowserVersion,
        LogType: 'Login'
      },
      Date: dateTime
    };

    return this.http.post<any>(`${this.apiUrl}IsAdUser/`, userObj)
      .pipe(
        catchError(this.handleError)
      );



  }
  getAutoDeleteNewUser(): Observable<any> {
    return this.http.get(this.apiUrl +'GetAutoDeleteNewUser/').pipe(
      map((response: any) => {
        const data = response;
        const deffered = Promise.resolve('done');
        this.diferredList.push(deffered);
        return data;
      }),
      catchError((error: any) => {
        this.autoLogoutMessage(error.status);
        return throwError(error);
      })
    );
  }

  private autoLogoutMessage(status: number) {
    console.log('Auto logout message:', status);
  }




  public pendingPromises() {
    forkJoin(this.apiList).subscribe(
      (value) => {
        // Success callback where value is an array containing the success values
      },
      (error) => {
        // Error callback where error is the value of the first rejected observable
      }
    );
  }
  public closeLoader() {
    timer(2000)
      .pipe(takeUntil(this.stopTimer))
      .subscribe(() => {
        const apiArray = [
          "/api/ViewboxSettings/GetViewboxServers",
          "/api/ViewboxSettings/GetViewboxInformation",
          "/api/ViewboxSettings/AddViewboxServerPerformance"
        ];
  
        this.http
          .get<any[]>('/api/ViewboxSettings')
          .pipe(
            takeUntil(this.stopTimer),
            filter(responseArray => {
              return responseArray.some(response => apiArray.some(api => response.url?.includes(api)));
            })
          )
          .subscribe(responseArray => {
            if (responseArray.length === 0) {
              document.querySelector('html')?.setAttribute('style', 'cursor: auto');
              document.querySelector('body')?.setAttribute('style', 'cursor: auto; pointer-events: auto');
              const loadElement = document.querySelector('.load');
              if (loadElement) {
                loadElement.setAttribute('style', 'visibility: hidden');
              }
            } else {
              this.closeLoader();
              this.pendingPromises();
            }
          });
      });
  }
  
  
  public setCursor() {
    this.renderer.setStyle(document.documentElement, 'cursor', 'wait');
    this.renderer.setStyle(document.body, 'pointer-events', 'none');
  }
  getViewBoxName(): string | undefined {
    return this.viewBoxName;
  }

  setViewBoxName(name: string) {
    this.viewBoxName = name;
  }

  resetCursor() {
    this.resetCursorFn();
  }
  
  showProcessingModal(model: any, $scope: any, table: any, isExecuteStoreProcedure: boolean): void {
    // Start cursor loader
    document.querySelector('html')?.setAttribute('style', 'cursor: wait');
    document.querySelector('body')?.setAttribute('style', 'pointer-events: none');

    setTimeout(() => {
      if (model.leftProcessing || model.rightProcessing) {
        $scope.modelClose = true;
        model.leftProcessing = false;
        model.rightProcessing = false;
        $scope.modalLoading = true;
        $scope.modalLoadingText = isExecuteStoreProcedure ? 'SelectedDataAreBeingRecognizedAtThisMoment' : 'Processing';
        const confirmDialogGlobal = document.querySelector('#confirmDialogGlobal');
        if (confirmDialogGlobal) {
          confirmDialogGlobal.classList.remove('Processing-modal');
          confirmDialogGlobal.classList.add('hidden');
        }
        const confirmDialog = document.querySelector('#confirmDialog');
        if (confirmDialog) {
          confirmDialog.classList.add('Processing-modal');
        }
      }
    }, 2000);
  }

  hideProcessingModal(): void {
    const apiArray = [
      '/api/ViewboxSettings/GetViewboxServers',
      '/api/ViewboxSettings/GetViewboxInformation',
      '/api/ViewboxSettings/AddViewboxServerPerformance'
    ];

    const requests = apiArray.map(api => this.http.get(api));

    forkJoin(requests).subscribe(
      responseArray => {
        if (responseArray.length === 0) {
          const processingModal = document.querySelector('.Processing-modal');
          if (processingModal) {
            processingModal.classList.remove('Processing-modal');
            processingModal.classList.add('hidden');
          }
          this.resetCursorFn();
        }
      }
    );
  }

  setScreenSize(): void {
    const outerWidth = window.outerWidth.toString();
    sessionStorage.setItem('screenSize', outerWidth);
  }

  getScreenSize(): number {
    const screenSize = sessionStorage.getItem('screenSize');
    return screenSize ? parseInt(screenSize, 10) : 0;
  }


  login(username: string, password: string, token: string, remember: boolean, scope: any, logData: any, dateTime: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '__RequestVerificationToken': antiForgeryToken
    });

    const data = {
      UserName: username,
      Password: password,
      Token: token,
      IsRemember: remember,
      Url: window.location.href,
      UserDetoStatus: logData,
      Date: dateTime
    };

    return this.http.post<any>(this.apiUrl +'Login/', data, { headers })
      .pipe(
        // Handle response or errors here if needed
      );
  }

  // ADlogin(username: string, state: number, userdomain: string, dateTime: string, scope: any): Observable<any> 
  // {
  //   const antiForgeryToken = ''; // Replace with actual token
  //   const sessionValue = sessionStorage.getItem("SessionName");
    
  //     const logDetails = JSON.parse(sessionValue ?sessionValue : 'null' );
  //     console.log(logDetails);
    

  //   let logData;

  //   if (state == 2) {
  //     logData = {
  //       Username: username,
  //       userSystemInfoDto: {},
  //       domain: userdomain,
  //       Date: dateTime
  //     };
  //   } else {
  //     if (logDetails ) { // Check if logDetails is defined and has at least one element
  //       const firstLogDetail = logDetails[0];
  //       if (firstLogDetail) {
  //         logData = {
  //           Username: username,
  //           userSystemInfoDto: { 
  //             _BrowserSize: firstLogDetail.BrowserSize || null,
  //             get BrowserSize() {
  //               return this._BrowserSize;
  //             },
  //             set BrowserSize(value) {
  //               this._BrowserSize = value;
  //             },
  //             MonitorResolution: firstLogDetail.BrowserSize || null,
  //             IP: firstLogDetail.IP || null,
  //             _OS: firstLogDetail.OS || null,
  //             get OS() {
  //               return this._OS;
  //             },
  //             set OS(value) {
  //               this._OS = value;
  //             },
  //             JavaScriptActive: firstLogDetail.JavaScriptActive || null,
  //             CookieEnable: firstLogDetail.CookieEnable || null,
  //             FlashVersion: firstLogDetail.FlashVersion || null,
  //             JavaVersion: firstLogDetail.JavaVersion || null,
  //             BrowserName: firstLogDetail.BrowserName || null,
  //             BrowserVersion: firstLogDetail.BrowserVersion || null,
  //             LogType: 'Login'
  //           },
  //           domain: userdomain,
  //           Date: dateTime
  //         };
  //       }

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     '__RequestVerificationToken': antiForgeryToken
  //   });

  //   return this.http.post<any>('/api/Account/ADLogin', logData, { headers })
  //     .pipe(
  //       // Handle response or errors here if needed
  //     );
  // }
  

  //     }
 
  //    }


  tokenLogin(username: string, token: string, remember: boolean, browserData: any): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '__RequestVerificationToken': antiForgeryToken
    });
  
    return this.http.post<any>(this.apiUrl +'TokenLogin/', {
      UserName: username,
      Token: token,
      IsRemember: remember,
      UserDetoStatus: browserData
    }, { headers });
  }
  adtokenLogin(username: string, token: string, remember: boolean, state: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      '__RequestVerificationToken': antiForgeryToken
    });

    const url = this.apiUrl+`ADTokenLogin/${state}`;

    return this.http.post<any>(url, {
      UserName: username,
      Token: token,
      IsRemember: remember
    }, { headers });
  }
  
  logout(): Observable<boolean> {
    sessionStorage.removeItem('logout');

    return this.http.get<any>(this.apiUrl+'Logout/')
      .pipe(map(() => {
        sessionStorage.removeItem("getSystems");
        return true;
      }), catchError(error => {
        return of(false);
      }));
  }

  getUserInfo(): Observable<any> {
    const lang = this.cookieService.get('__APPLICATION_LANGUAGE') || 'de';

    return this.http.get<any>(this.apiUrl+'UserInfo/' + lang)
      .pipe(
        map(response => {
          this.cookieService.delete('isAdUser');
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);
          this.cookieService.set('isAdUser', response.AdUser, expireDate, '/');
          return response;
        }),
        catchError(error => {
          // Handle error
          return [];
        })
      );
  }

  userNameReminder(email: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post<any>(this.apiUrl +'UserNameReminder/', { Email: email }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    }).pipe(
      catchError(error => {
        // Handle error
        return [];
      })
    );
  }

  sendResetToken(userName: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post<any>(this.apiUrl +'PasswordResetToken/', { UserName: userName, Url: window.location.href }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    }).pipe(
      catchError(error => {
        // Handle error
        return [];
      })
    );
  }
  sendUpdatePasswordToken(userName: string): Observable<any> {
    return this.http.post<any>(this.apiUrl +'PasswordUpdateToken/', { UserName: userName, Url: window.location.href })
      .pipe(
        catchError(error => {
          // Handle error
          return [];
        })
      );
  }

  getTwoStepToken(userName: string): Observable<any> {
    return this.http.post<any>( this.apiUrl +'GenerateTwoStepToken/', { UserName: userName })
      .pipe(
        catchError(error => {
          // Handle error
          return [];
        })
      );
  }
  saveLanguage(userName: string, countryCode: string, systemId: string): Observable<any> {
    const sessionValue = sessionStorage.getItem("SessionName");

      const logDetails = JSON.parse(sessionValue ?sessionValue:'null' );
      console.log(logDetails);
        const logData = {
      BrowserSize: logDetails[0].BrowserSize,
      MonitorResolution: logDetails[0].BrowserSize,
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

    return this.http.patch<any>(this.apiUrl +`${userName}/${countryCode}/${systemId}`, logData)
      .pipe(
        catchError(error => {
          // Handle error
          return [];
        })
      );
  }
  getSystemInfo(logData: any): Observable<any> {
    return this.http.post(this.apiUrl+'GetSystemInfo/', logData);
  }
  getLogoSetting(): Observable<any> {
    return this.http.get(this.apiUrl1+'/api/ViewboxSettings/GetLogoSetting');
  }
  getInactiveUser(): Observable<any> {
    return this.http.get(this.apiUrl1+'/api/Account/GetInactiveUser/');
  }

  getViewboxName(): Observable<any> {
    return this.http.get(this.apiUrl1+"/api/ViewboxSettings/GetViewboxName/");
  }
  getCookieLogoutTime(): Observable<any> {
    return this.http.get(this.apiUrl1+'/api/ViewboxSettings/GetCookieExpireTime');
  }
  getOnlyRights(): Observable<any> {
    const pageDetails = {
      GetRights: true,
      ModuleName: 'NONE',
      ActionType: 'NONE',
      PageName: 'NONE',
      OptionalDetails: {
        TabName: 'NONE',
        FilterCount: 0,
        TableId: null,
        ColumnId: null,
        SearchValue: null
      }
    };

    return this.http.post(this.apiUrl+'CheckUserRights/', pageDetails);
  }
  getAllViewboxSystem(): Observable<any> {
    return this.http.get(this.apiUrl1+"/api/DeleteSystem/GetViewboxSystemsByUserRights");
  }

  resetPassword(userId: string, token: string, password: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"ResetPassword", {
      Id: userId,
      Token: token,
      Password: password
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }
  updateUsername(newUsername: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"UpdateUsername/", {
      UserName: newUsername
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }
  updateName(newName: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"Account/UpdateName/", {
      Name: newName
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }

  updateEmail(newEmail: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"UpdateEmail/", {
      Email: newEmail
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }

  updatePassword(passwords: string[], browserData: any): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"UpdatePassword/", {
      UserName: passwords[0],
      OldPassword: passwords[1],
      Password: passwords[2],
      browserData: browserData
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }

  updateTwoStepAuth(): Observable<any> {
    return this.http.get(this.apiUrl+"UpdateTwoStepAuth/");
  }

  sendConfirmationEmail(): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"SendVerificationEmail/", {
      Url: window.location.href
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }

  confirmEmail(userName: string, token: string): Observable<any> {
    const antiForgeryToken = ''; // Replace with actual token

    return this.http.post(this.apiUrl+"ConfirmEmail/", {
      UserName: userName,
      Token: token
    }, {
      headers: {
        '__RequestVerificationToken': antiForgeryToken
      }
    });
  }

  validateEmailFormat(email: string): boolean {
    const re = /^(?:[A-Za-z0-9]|[^\u0000-\u007F]|[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]|[^\u0000-\u007F])+@(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?(?:\.(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?)*$/;
    return !email || !re.test(email);
  }


  validateUsernameFormat(username: string): boolean {
    const re = /[^\u0000-\u007F]|^[A-Za-z0-9]|[^\u0000-\u007F]+(?:[._-][A-Za-z0-9]+)*$/;
    return !username || username.length === 0 || !re.test(username);
  }

  validateRoleNameFormat(name: string): boolean {
    const re = /^[a-zA-Z0-9+\-_À-ÖØ-öø-ÿ ]+$/;
    return !name || name.length === 0 || !re.test(name);
  }
  
  validateNameFormat(name: string): boolean {
    const re = /^[a-zA-Z0-9@./#&+\-_À-ÖØ-öø-ÿ ]+$/;
    return !name || name.length === 0 || !re.test(name);
  }

  validateColumnShareNameFormat(columnName: string): boolean {
    const re = /^[a-zA-Z0-9 \u00C0-\u017F\s\S\W]+$/;
    return !columnName || columnName.length === 0 || !re.test(columnName);
  }

  validatePasswordFormat(password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl+"ValidatePassword/", { Password: password });
  }

  revalidatePassword(password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl+"ReValidatePassword/", { Password: password });
  }
}
