import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private userRole: string | null = null;

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const storedRole = localStorage.getItem('userRole');
    this.isAuthenticated = !!storedRole;
    this.userRole = storedRole;
  }

  login(username: string, password: string): boolean {
    if (username === 'profesor' && password === '1234') {
      this.isAuthenticated = true;
      this.userRole = 'profesor';
      localStorage.setItem('userRole', 'profesor');
      return true;
    } else if (username === 'usuario' && password === '1234') {
      this.isAuthenticated = true;
      this.userRole = 'usuario';
      localStorage.setItem('userRole', 'usuario');
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
    localStorage.removeItem('userRole');
  }
}
