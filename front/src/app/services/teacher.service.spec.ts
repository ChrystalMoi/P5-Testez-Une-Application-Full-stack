import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Configuration des modules et des fournisseur nécessaires pour le test
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });

    // Injection du service "TeacherService" et du contrôleur "HttpTestingController"
    service = TestBed.inject(TeacherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // Teste si le service "TeacherService" a bien été créé avec succès
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste si la méthode de récupération de tous les enseignants appel la méthode HTTP GET
  it('la récupération de tous les enseignants devrait appeler la méthode HTTP', () => {
    // Given

    // When
    service.all().subscribe();

    // Then
    // Vérifie qu'une seule requête GET a été effectuée avec la bonne URL
    const req = httpTestingController.expectOne(service['pathService']);
    expect(req.request.method).toEqual('GET');
  });

  // Teste si la méthode de récupération d'un prf par ID appelle la méthode HTTP GET
  it('la récupération de l\'enseignant par ID devrait appeler la méthode HTTP', () => {
    // Given

    // When
    service.detail('100').subscribe();

    // Then
    // Vérifie qu'une seule requête GET a été effectuée avec la bone URL, contenant l'ID spécifié
    const req = httpTestingController.expectOne(service['pathService'] + '/100');
    expect(req.request.method).toEqual('GET');
  });
});
