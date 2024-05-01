import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Vérifie si submit() appelle AuthService lors de la soumission du formulaire
  it('submit doit appeler le service', () => {
    //Given - Simule AuthService pour retourner une observable vide lors de l'inscription
    let authServiceSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(void 0));

    //When - Déclenche la soumission du formulaire
    component.submit();

    //Then - Vérifie si register() d'AuthService a été appelée
    expect(authServiceSpy).toHaveBeenCalled();
  });

  // Vérifie si la méthode submit() gère les erreurs lors de la soumission du formulaire
  it("submit devrait gérer l'erreur", () => {
    // Given - Simulation d'une erreur de AuthService lors de l'inscription
    let authServiceSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('Erreur simulée')));

    // When - Déclenchement de la soumission du formulaire
    component.submit();

    // Then - Vérifie si le drapeau onError est défini sur true
    expect(component.onError).toBe(true);
  });
});
