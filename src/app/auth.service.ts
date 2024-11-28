import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private userRole: string | null = null;
  private userName: string | null = null;
  private userRut: string | null = null; // Nuevo atributo para el RUT del usuario

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
    const storedRut = localStorage.getItem('userRut'); // Recuperar RUT desde localStorage

    this.isAuthenticated = !!storedRole;
    this.userRole = storedRole;
    this.userName = storedName;
    this.userRut = storedRut; // Asignar el RUT recuperado
  }

  login(rut: string, password: string): boolean {
    // Buscar usuario por RUT y contraseña en la lista
    const user = this.users.find((u) => u.rut === rut && u.password === password);
    if (user) {
      this.isAuthenticated = true;
      this.userRole = user.role;
      this.userName = user.name;
      this.userRut = user.rut; // Asignar el RUT del usuario autenticado

      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRut', user.rut); // Guardar el RUT en localStorage
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

  getUserRut(): string | null { // Nuevo método para obtener el RUT
    return this.userRut;
  }

  logout() {
    this.isAuthenticated = false;
    this.userRole = null;
    this.userName = null;
    this.userRut = null; // Limpiar el RUT al cerrar sesión
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRut'); // Eliminar el RUT de localStorage
  }
}
