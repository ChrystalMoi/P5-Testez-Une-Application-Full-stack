import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { routes } from '../../../../app-routing.module';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { of } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let sessionApiService: SessionApiService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const sessionMock: Session = {
    name: 'nameMock',
    description: 'descriptionMock',
    date: new Date(),
    teacher_id: 1,
    users: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    sessionApiService = TestBed.inject(SessionApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Quitter la page devrait naviguer vers les sessions
  it('quitter la page devrait naviguer vers les sessions', () => {
    // Given
    let navigateSpy = jest.spyOn(router, 'navigate'); // Pour surveiller les redirections

    // When
    component['exitPage']('test'); // Déclenche la méthode exitPage du composant

    // Then
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']); // Vérifie si la navigation vers '/sessions' est effectuée
  });

  // Vérifie si les non-administrateurs sont redirigés lors de la mise à jour
  it('les non-administrateurs devraient être redirigés lors de la mise à jour', () => {
    // Given
    let navigateSpy = jest.spyOn(router, 'navigate'); // Pour surveiller les redirections
    mockSessionService.sessionInformation.admin = false; // Définit l'utilisateur comme non-administrateur
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/22'); // Simule une URL de mise à jour de session

    // When
    component.ngOnInit(); // Déclenche l'initialisation du composant

    // Then
    // Vérifie si une redirection vers '/sessions' est effectuée pour les non-administrateurs
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
    // Vérifie si la variable onUpdate est définie sur true pendant la mise à jour
    expect(component['onUpdate']).toBe(true);
  });

  // Vérifie si les administrateurs ne sont pas redirigés au démarrage
  it('les administrateurs ne devraient pas être redirigés au démarrage', () => {
    // Given
    let navigateSpy = jest.spyOn(router, 'navigate'); // Pour surveiller les redirections
    mockSessionService.sessionInformation.admin = true; // Définit l'utilisateur comme administrateur
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/22'); // Simule une URL de mise à jour de session

    // When
    component.ngOnInit(); // Déclenche l'initialisation du composant

    // Then
    // Vérifie qu'aucune redirection n'est effectuée pour les administrateurs
    expect(navigateSpy).not.toHaveBeenCalledWith(['/sessions']);
  });

  // Vérifie si les non-administrateurs sont redirigé vers les sessions au démarrage
  it('les non-admin devraient être redirigé vers les sessions au démarrage', () => {
    // Given
    let navigateSpy = jest.spyOn(router, 'navigate');
    mockSessionService.sessionInformation.admin = false;

    // When
    component.ngOnInit();

    // Then
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  // Créer devrait soumettre le formulaire et appeler le service
  it('créer devrait soumettre le formulaire et appeler le service', () => {
    // Given
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'create')
      .mockReturnValue(of(sessionMock)); // pour surveiller les appels à la méthode create du service API de session

    // When
    component.submit(); // Déclenche la méthode submit du composant

    // Then
    expect(sessionApiServiceSpy).toHaveBeenCalled(); // Vérifie si la méthode create du service API de session a été appelée
  });

  // Mettre à jour devrait soumettre le formulaire et appeler le service
  it('mettre à jour devrait soumettre le formulaire et appeler le service', () => {
    // Given
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'update')
      .mockReturnValue(of(sessionMock)); // Pour surveiller les appels à la méthode update du service API de session
    component['onUpdate'] = true; // Définit onUpdate sur true pour simuler un mode de mise à jour

    // When
    component.submit(); // Déclenche la méthode submit() du composant

    // Then
    expect(sessionApiServiceSpy).toHaveBeenCalled(); // Vérifie si la méthode update() du service API de session a été appelée
  });
});
