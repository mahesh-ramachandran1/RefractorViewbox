import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseApiUrl :string = environment.baseApiUrl;
  constructor(private http :HttpClient) { }

  validateLogin(){}

  getLanguages() : Observable<any[]> {
   return this.http.get<any[]> (this.baseApiUrl + '/api/Languages/en');
  }
}
