import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient) {}

  sendUserData(userData: any) {
    return this.http.post('192.168.140.15:3000/api/mark-attendance', userData);
  }
}
