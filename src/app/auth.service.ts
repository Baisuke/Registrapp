import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private userRole: string | null = null; // Rol del usuario actual

  login(username: string, password: string): boolean {
    if (username === 'profesor' && password === '1234') {
      this.isAuthenticated = true;
      this.userRole = 'profesor'; // Rol asignado
      return true;
    } else if (username === 'usuario' && password === '1234') {
      this.isAuthenticated = true;
      this.userRole = 'usuario'; // Rol asignado
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserRole(): string | null {
    return this.userRole;
  }

  logout() {
    this.isAuthenticated = false;
    this.userRole = null;
  }
}
