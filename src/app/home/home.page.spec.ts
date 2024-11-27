import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular'; // Importa IonicStorageModule para Storage


import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,  // Asegúrate de importar HttpClientModule para HttpClient
        IonicStorageModule.forRoot()  // Asegúrate de importar IonicStorageModule para Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: Verificar que el formulario tiene los controles 'username' y 'password'
  it('should create a form group with username and password controls', () => {
    expect(component.loginForm.contains('username')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  // Test 2: Verificar que el formulario es inválido cuando 'username' y 'password' están vacíos
  it('should mark the form as invalid when username and password are empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  // Test 3: Verificar que el formulario es válido cuando 'username' y 'password' tienen valores
  it('should mark the form as valid when username and password are filled in', () => {
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    expect(component.loginForm.valid).toBeTruthy();
  });
});

