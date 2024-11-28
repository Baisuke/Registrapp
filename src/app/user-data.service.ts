import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private apiUrl = 'http://localhost:3000/api/mark-attendance'; // Cambiar localhost por la IP del servidor

  constructor(private http: HttpClient) {}

  sendUserData(userData: any) {
    // Formatear la fecha antes de enviarla
    if (userData.date) {
      userData.date = new Date(userData.date).toISOString().split('T')[0];
    }

    return this.http.post(this.apiUrl, userData); // Enviar datos al backend

  }
}