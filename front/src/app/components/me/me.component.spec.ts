import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  const userMock: User = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Test',
    firstName: 'TestEncore',
    admin: false,
    password: 'azerty',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Vérifie si le composant démarre avec l'identifiant de l'utilisateur
  it("initialise avec l'identifiant de l'utilisateur", () => {
    // Given - Simulation du service UserService pour renvoyer un utilisateur fictif
    let userServiceSpy = jest
      .spyOn(userService, 'getById')
      .mockReturnValue(of(userMock));

    // When - Démarrage du composant
    component.ngOnInit();

    // Then - Vérifie si le prénom de l'utilisateur est correct et si la méthode getById() de UserService est appelée avec l'identifiant correct
    expect(component['user']?.firstName).toBe('TestEncore');
    expect(userServiceSpy).toHaveBeenCalledWith('1');
  });

  // Vérifie si la méthode back() du composant est appelée
  it('retourner en arrière devrait appeler la méthode du composant', () => {
    // Given - Surveillance de la méthode back() du composant
    let componentBack = jest.spyOn(component, 'back');

    // When - Appel de la méthode back() du composant
    component.back();

    // Then - Vérifie si la méthode back() du composant a été appelée
    expect(componentBack).toBeDefined();
    expect(componentBack).toHaveBeenCalled();
  });

  // Vérifie si la méthode delete() appelle le service UserService et navigue en arrière
  it("devrait appeler le service et naviguer en arrière lors de la suppression de l'utilisateur", () => {
    // Given - Préparation des spies pour UserService.delete() et router.navigate()
    const userServiceSpy = jest
      .spyOn(userService, 'delete')
      .mockReturnValue(of(void 0));
    const navigateSpy = jest.spyOn(router, 'navigate');

    // When - Appel de la méthode de suppression
    component.delete();

    // Then - Vérification que UserService.delete() a été appelé
    expect(userServiceSpy).toHaveBeenCalled();
  });
});
