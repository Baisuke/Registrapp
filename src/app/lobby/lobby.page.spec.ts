import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from '../services/api.service';
import { UserDataService } from '../user-data.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Share } from '@capacitor/share';
import { AuthService } from '../auth.service';
import { LobbyPage } from './lobby.page';
import { of } from 'rxjs';

describe('LobbyPage', () => {
  let component: LobbyPage;
  let fixture: ComponentFixture<LobbyPage>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockStorage: jasmine.SpyObj<Storage>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockUserDataService: jasmine.SpyObj<UserDataService>;
  let mockAlertController: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    // Creación de espías (mocks) para los servicios y dependencias
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockStorage = jasmine.createSpyObj('Storage', ['create']);
    mockApiService = jasmine.createSpyObj('ApiService', ['']);
    mockUserDataService = jasmine.createSpyObj('UserDataService', ['sendUserData']);
    mockAlertController = jasmine.createSpyObj('AlertController', ['create']);

    // Configuración del módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [LobbyPage],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AlertController, useValue: mockAlertController },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Storage, useValue: mockStorage },
        { provide: ApiService, useValue: mockApiService },
        { provide: UserDataService, useValue: mockUserDataService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyPage);
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
