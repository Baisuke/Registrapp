import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
  })
export class AuthService {
  private isAuthenticated = false; // Simula si el usuario está autenticado
  login(username: string, password: string): boolean {
  // Simulamos una validación de login
  if (username === 'usuario' && password === '1234') {
  this.isAuthenticated = true;
  return true;
  }
  return false;
  }
  isLoggedIn(): boolean {
  return this.isAuthenticated;
  }
  logout() {
  this.isAuthenticated = false;
  }
  }