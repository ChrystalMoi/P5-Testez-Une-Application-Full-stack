import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Inscription devrait appeler la méthode HTTP
  it("l'inscription devrait appeler la méthode HTTP", () => {
    // Given - On crée une requête d'inscription
    let registerRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'TestEncore',
      password: 'azerty',
    };

    // When - On appel la méthode subscribe()
    service.register(registerRequest).subscribe();

    // Then - On attend une seule requete HTTP (post) pour l'inscription
    const req = httpTestingController.expectOne(
      service['pathService'] + '/register'
    );
    // Vérifications que la méthode HTTP utiliser est POST
    expect(req.request.method).toEqual('POST');
  });

  // La connexion devrait être appelé
  it('la connexion devrait être appelé', () => {
    // Given - On crée une requête de connexion
    let loginRequest: LoginRequest = {
      email: 'test@test.com',
      password: 'azerty',
    };

    // When - Nous appelons la méthode de connexion du service
    service.login(loginRequest).subscribe();

    // Then - On attend une seule requête HTTP (post) pour la connexion
    const req = httpTestingController.expectOne(
      service['pathService'] + '/login'
    );
    // Vérification que la méthode HTTP utiliser est POST
    expect(req.request.method).toEqual('POST');
  });
});
