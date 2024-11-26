import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) {}

  sendUserData(userData: any): Observable<any> {
    return this.http.post('http://tuservidor.com/api/sendUserData', userData);
  }
}
