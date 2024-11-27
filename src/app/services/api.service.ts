import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api'; // Ruta base del backend

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la asistencia de una sección en una fecha específica.
   * @param date Fecha en formato ISO o string válido.
   * @param section Sección a consultar.
   * @returns Observable con los datos de asistencia.
   */
  getAttendance(date: string, section: string): Observable<any> {
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Formato de la fecha
    const params = new HttpParams().set('date', formattedDate).set('section', section);

    return this.http.get(`${this.baseUrl}/get-attendance`, { params }); // Endpoint específico
  }

  /**
   * Marca la asistencia para un usuario.
   * @param attendanceData Datos de asistencia a enviar.
   * @returns Observable con la respuesta del backend.
   */
  markAttendance(attendanceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/mark-attendance`, attendanceData); // Endpoint ajustado
  }
}
