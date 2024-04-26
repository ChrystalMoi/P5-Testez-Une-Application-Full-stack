import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

import { routes } from '../../../../app-routing.module';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let sessionApiService: SessionApiService;
  let router: Router;
  let navigateSpy: jest.SpyInstance<Promise<Boolean>>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const sessionMock: Session = {
    name: 'NomMock',
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
        MatSnackBarModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    sessionApiService = TestBed.inject(SessionApiService);
    navigateSpy = jest.spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // L'initialisation devrait démarrer la bonne session et appeler le service
  it("l'initialisation devrait démarrer la bonne session et appeler le service", () => {
    // Given - On crée un espion pour surveiller l'appel detail() du service API de session
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockReturnValue(of(sessionMock));
    component['sessionId'] = '12'; // Définition de l'ID de session

    // When - On déclenche l'initialisation du composant avec ngOnInit()
    component.ngOnInit();

    // Then - Vérification si detail() est appelée avec l'ID de session correct
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('12');
  });

  // Retourner en arrière devrait appeler la méthode du composant
  it('retourner en arrière devrait appeler la méthode du composant', () => {
    // Given -  On crée un espion pour surveiller l'appel à la méthode back()
    let componentBack = jest.spyOn(component, 'back');

    // When - On appel la méthode back()
    component.back();

    // Then - On vérifie si la méthode back() est définie
    expect(componentBack).toBeDefined();
    // On vérifie si la méthode back() a été appelée
    expect(componentBack).toHaveBeenCalled();
  });

  // La participation devrait appeler le service avec les identifiants
  it('la participation devrait appeler le service avec les identifiants', () => {
    // Given - On définit l'ID de session et l'ID d'utilisateur
    component['sessionId'] = '1';
    component['userId'] = '3';
    // On crée un espion pour surveiller l'appel à la méthode participate()
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'participate')
      .mockReturnValue(of(void 0));

    // When - On déclenche la participation
    component.participate();

    // Then - Vérification si la méthode participate() est appeler avec les bons identifiants
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('1', '3');
  });

  // La non participation devrait appeler le service avec les identifiants
  it('la non-participation devrait appeler le service avec les identifiants', () => {
    // Given - On définit l'ID de session et l'ID d'utilisateur
    component['userId'] = '3';
    component['sessionId'] = '1';
    // On crée un espion pour surveiller l'appel à la méthode unParticipate()
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'unParticipate')
      .mockReturnValue(of(void 0));

    // When - On déclenche la non participation
    component.unParticipate();

    // Then - On vérifie si la méthode unParticipate() est appelée avec les id corrects
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('1', '3');
  });

  // La suppression de la session devrait revenir aux sessions et appeler le service
  it('la suppression de la session devrait revenir aux sessions et appeler le service', () => {
    // Given - Définition de l'ID de session
    component['sessionId'] = '12';
    // On crée un espion pour surveiller l'appel à la méthode delete()
    let sessionApiServiceSpy = jest
      .spyOn(sessionApiService, 'delete')
      .mockReturnValue(of('test'));
    // On crée un espion pour surveiller l'appel à la méthode navigate() du routeur
    let navigateSpy = jest.spyOn(router, 'navigate');

    // When - On supprime la session
    component.delete();

    // Then - On vérifie si la méthode delete() est appelée avec l'ID de session correct
    expect(sessionApiServiceSpy).toHaveBeenCalledWith('12');
    // On vérifie si la méthode navigate() est appelée pour revenir à la liste des sessions
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});
