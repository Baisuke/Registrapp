import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ResetPasswordPage } from './recuperarpass.page';
import { of } from 'rxjs';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertController: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    // Crear espías (mocks) para Router y AlertController
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

    // Configuración del módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [ResetPasswordPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Verificar que el componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // 2. Verificar el comportamiento de resetPass cuando el usuario ingresa un nombre
  it('should show success alert and navigate to home when user enters a name', async () => {
    component.usuario = 'usuario@ejemplo.com';

    spyOn(component, 'presentAlert').and.callThrough();  // Espiar el método de alerta

    await component.resetPass();

    expect(component.presentAlert).toHaveBeenCalledWith(
      'Contraseña recuperada exitosamente',
      '',
      'Se enviaron los datos al correo del usuario: usuario@ejemplo.com'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home'], {
      state: { nombre_usuario: 'usuario@ejemplo.com' }
    });
  });

  // 3. Verificar el comportamiento de resetPass cuando no se ingresa un nombre
  it('should show error alert when no user name is entered', async () => {
    component.usuario = '';  // Dejar el campo vacío

    spyOn(component, 'presentAlert').and.callThrough();  // Espiar el método de alerta

    await component.resetPass();

    expect(component.presentAlert).toHaveBeenCalledWith(
      'Error',
      'Datos incompletos',
      'Por favor, ingresa tu nombre de usuario.'
    );
    expect(mockRouter.navigate).not.toHaveBeenCalled();  // No debe navegar si no hay nombre
  });

  // 4. Verificar que el método back navega a la página de inicio
  it('should navigate to home when back is called', () => {
    component.back();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
