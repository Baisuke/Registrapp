import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL de tu API personalizada
  private apiUrl = 'http://localhost:3000/api'; // Cambia esto según la URL de tu backend

  constructor(private http: HttpClient) {}

  // Rutas para manejar los datos del usuario
  storeUserData(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/storeUserData`, userData);
  }

  getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUserData`);
  }

  // Métodos existentes (JSONPlaceholder)
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  getPost(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/posts/${id}`);
  }

  addPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/posts`, post);
  }

  updatePost(id: number, post: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`);
  }
}
