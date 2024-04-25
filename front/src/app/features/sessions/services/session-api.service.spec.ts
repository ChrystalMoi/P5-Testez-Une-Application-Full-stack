import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Session } from '../interfaces/session.interface';
import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpTestingController: HttpTestingController;
  let sessionMock: Session;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [
        SessionApiService
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Vérifie si delete() appelle DELETE pour supprimer une session par ID
  it('delete() devrait appeler DELETE pour supprimer une session par ID', () => {
    // Given

    // When
    service.delete('3').subscribe();

    // Then
    const req = httpTestingController.expectOne(service['pathService'] + '/3');
    expect(req.request.method).toEqual('DELETE');
  });

  // Vérifie si detail() appelle GET pour obtenir les détails de la session
  it('detail() devrait appeler GET et retourner les détails de la session', () => {
    // Given

    // When
    service.detail('3').subscribe();

    // Then
    const req = httpTestingController.expectOne(service['pathService'] + '/3');
    expect(req.request.method).toEqual('GET');
  });

  // Vérifie si all() appelle GET pour obtenir toutes les sessions
  it('all() devrait appeler GET pour obtenir toutes les sessions', () => {
    // Given

    // When
    service.all().subscribe();

    // Then
    const req = httpTestingController.expectOne(service['pathService']);
    expect(req.request.method).toEqual('GET');
  });

  // Vérifie si create() appelle POST pour créer une nouvelle session
  it('create() devrait appeler POST pour créer une nouvelle session', () => {
    // Given

    // When
    service.create(sessionMock).subscribe();

    // Then
    const req = httpTestingController.expectOne(service['pathService']);
    expect(req.request.method).toEqual('POST');
  });

  // Vérifie si update() appelle PUT pour mettre à jour une session
  it('update() devrait appeler PUT pour mettre à jour une session', () => {
    //Given

    //When
    service.update('123', sessionMock).subscribe();

    //Then
    const req = httpTestingController.expectOne(service['pathService'] + '/123');
    expect(req.request.method).toEqual('PUT');
  });

  // Vérifie si participate() fonctionne et appelle POST pour enregistrer une participation
  it('participate() devrait fonctionner et appeler POST pour enregistrer une participation', () => {
    // Given

    // When
    service.participate('1', '123').subscribe();

    // Then
    const req = httpTestingController.expectOne(
      service['pathService'] + '/1/participate/123'
    );
    expect(req.request.method).toEqual('POST');
  });

  // Vérifie si unParticipate() fonctionne et appelle DELETE pour annuler une participation
  it('unParticipate() devrait fonctionner et appeler DELETE pour annuler une participation', () => {
    // Given

    // When
    service.unParticipate('1', '123').subscribe();

    // Then
    const req = httpTestingController.expectOne(service['pathService'] + '/1/participate/123');
    expect(req.request.method).toEqual('DELETE');
  });
});
