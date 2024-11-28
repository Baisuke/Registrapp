import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private userRole: string | null = null;
  private userName: string | null = null;

  // Lista de usuarios con RUT, contraseñas, roles y nombres
  private users = [
    { rut: '12345678-9', password: '1234', role: 'profesor', name: 'Carlos Pérez' },
    { rut: '98765432-1', password: '1234', role: 'profesor', name: 'María González' },
    { rut: '11222333-4', password: '1234', role: 'usuario', name: 'Pedro López' },
    { rut: '55667788-2', password: '1234', role: 'usuario', name: 'Ana Martínez' },
    { rut: '77889900-5', password: '1234', role: 'usuario', name: 'Luisa Fernández' },
  ];

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const storedRole = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('userName');
    this.isAuthenticated = !!storedRole;
    this.userRole = storedRole;
    this.userName = storedName;
  }

  login(rut: string, password: string): boolean {
    // Buscar usuario por RUT y contraseña en la lista
    const user = this.users.find((u) => u.rut === rut && u.password === password);
    if (user) {
      this.isAuthenticated = true;
      this.userRole = user.role;
      this.userName = user.name;
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
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

  getUserName(): string | null {
    return this.userName;
  }

  logout() {
    this.isAuthenticated = false;
    this.userRole = null;
    this.userName = null;
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }
}
