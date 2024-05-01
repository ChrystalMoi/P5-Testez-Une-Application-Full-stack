import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';

import { routes } from '../../../../app-routing.module';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthService;

  let sessionInformationMock: SessionInformation = {
    token: '12345',
    type: 'typeMock',
    id: 22,
    username: 'userNameMock',
    firstName: 'firstNameMock',
    lastName: 'lastNameMock',
    admin: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],

      providers: [SessionService],

      imports: [
        RouterTestingModule.withRoutes(routes),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // La soumission devrait appeler le service
  it('la soumission devrait appeler le service', () => {
    // Given - Création d'un espion pour surveiller l'appel à la méthode login()
    let authServiceSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of(sessionInformationMock));

    // When - Déclenchement de la soumission
    component.submit();

    // Then - Vérification de l'appel à la méthode login()
    expect(authServiceSpy).toHaveBeenCalled();
  });

  // Vérifie si onError() est défini sur true en cas d'échec de connexion
  it("doit définir onError sur true en cas d'échec de la connexion", () => {
    // Given - On simule un échec de la méthode login() en renvoyant une erreur
    let authServiceSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Erreur simulée')));

    // When - Déclenchement de la soumission
    component.submit();

    // Then - On vérifie que la variable onError est définie sur true après une erreur de connexion
    expect(component.onError).toBe(true);
  });
});
