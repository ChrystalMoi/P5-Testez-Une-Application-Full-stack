import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService
      ],
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // Vérifie qu'il n'y a pas de requêtes HTTP en attente ou en cours après chaque test
  afterEach(() => {
    httpTestingController.verify();
  });

  // Teste si le service UserService a été créé avec succès
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste si la méthode de suppression d'utilisateur appelle la méthode HTTP DELETE
  it('la suppression de l\'utilisateur par ID doit appeler la méthode HTTP', () => {
    //Given

    //When
    service.delete('100').subscribe();

    //Then
    // Vérifie qu'une seule requête DELETE a été effectuée avec la bonne URL
    const req = httpTestingController.expectOne(service['pathService'] + '/100');
    expect(req.request.method).toEqual('DELETE');
  });
});
