import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  // Création d'un utilisateur mocker
  let userAdminMock: SessionInformation = {
    token: 'tokenMock',
    type: 'typeMock',
    id: 1,
    username: 'userNameMock',
    firstName: 'firstNameMock',
    lastName: 'lastNameMock',
    admin: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Vérifie si la méthode $isLogged() du service retourne une valeur fausse au démarrage
  it('le service isLogged devrait être fausse au démarrage', () => {
    expect(service.$isLogged()).not.toBeTruthy;
  });

  // Vérifie si l'appel à la méthode logIn() du service modifie isLogged pour qu'il soit vrai
  it('logIn devrait rendre isLogged à vrai', () => {
    // Given

    // When
    service.logIn(userAdminMock);

    // Then
    expect(service.isLogged).toBeTruthy;
  });

  // Vérifie si l'appel à la méthode logOut() du service rend isLogged faux
  it('logOut devrait rendre islogged à faux', () =>{
    // Given

    // When
    service.logOut();

    // Then
    expect(service.isLogged).not.toBeTruthy;
  });

});
