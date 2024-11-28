import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';
import * as QRCode from 'qrcode';
import { HttpClient } from '@angular/common/http';
import { AdminPage } from './admin.page';
import { of } from 'rxjs';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockStorage: jasmine.SpyObj<Storage>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAlertController: jasmine.SpyObj<AlertController>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    // Creación de espías (mocks) para los servicios y dependencias
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockStorage = jasmine.createSpyObj('Storage', ['get']);
    mockApiService = jasmine.createSpyObj('ApiService', ['getAttendance']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

    // Configuración del módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [AdminPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Storage, useValue: mockStorage },
        { provide: ApiService, useValue: mockApiService },
        { provide: HttpClient, useValue: mockHttpClient },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should navigate to home and logout when logout is called', () => {
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockAuthService.logout.and.callThrough();

    component.logout();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
