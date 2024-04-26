import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app-routing.module';
import { SessionService } from './services/session.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

describe('AppComponent', () => {
  let router: Router;
  let app: AppComponent;

  const sessionServiceMock = {
    $isLogged(): Observable<boolean> {
      return of(true);
    },
    logOut(): void {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        MatToolbarModule,
      ],
      declarations: [AppComponent],
      providers: [{ provide: SessionService, useValue: sessionServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Vérifie l'état de connexion au début
  it("vérifie l'état de connexion au début", () => {
    // Given
    let state!: boolean;

    // When - on souscrit à l'observable de l'état de connexion
    app.$isLogged().subscribe((x) => (state = x));

    // Then - on vérifie que l'état de connexion est vrai au début
    expect(state).toBe(true);
  });

  // Vérifie la navigation à la racine lors de la déconnexion
  it('vérifie la navigation à la racine lors de la déconnexion', () => {
    // Given - on crée un espion pour surveiller l'appel à la méthode navigate() du routeur
    let navigateSpy = jest.spyOn(router, 'navigate');

    // When - On lance la déconnexion
    app.logout();

    // Then - on vérifie si la méthode navigate() du routeur est appelée pour naviguer vers la racine
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
