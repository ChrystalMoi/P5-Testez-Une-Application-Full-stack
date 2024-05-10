describe('Session create', () => {
  // Test : Création d'une session si tous les champs sont corrects
  it('Crée une session avec tous les champs corrects', () => {
    // Given - Configuration pour simuler une connexion en tant qu'administrateur
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Intercepte la requête GET pour récupérer les sessions et renvoie une session spécifique
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Première session de notre histoire',
          date: '2024-05-02T13:45:27.000+00:00',
          teacher_id: 1,
          description:
            'Description de la première session. Ca va être du feu !',
          users: [],
          createdAt: '2024-05-02T16:40:26',
          updatedAt: '2024-05-02T16:41:53',
        },
      ]
    ).as('session');

    // Intercepte la requête GET pour récupérer les enseignants et renvoie un enseignant spécifique
    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'BASTID',
          firstName: 'Chrystal',
          createdAt: '2022-07-22T22:22:22',
          updatedAt: '2022-07-22T22:22:22',
        },
      ]
    ).as('teachers');

    // Intercepte la requête POST pour créer une session et renvoie les données de la session créée
    cy.intercept('POST', '/api/session', {
      body: {
        id: 22,
        name: 'Session pour les chiens',
        date: '2025-08-22T13:45:27.000+00:00',
        teacher_id: 1,
        description: 'On test une description comme ça',
        users: [],
        createdAt: '2024-07-03T22:22:22.0138214',
        updatedAt: '2024-07-03T22:22:22.0138214',
      },
    });

    // Visite la page de connexion et remplit le formulaire avec des informations valides
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Vérifie que le bouton de création de session existe
    cy.get('[data-cy="button-create"]').should('exist');

    // When - Clic sur le bouton de création de session
    cy.get('[data-cy="button-create"]').click();

    // Vérifie que le bouton de soumission est désactivé initialement
    cy.get('[data-test-id="button-submit"]').should('be.disabled');

    // Remplit les champs du formulaire
    cy.get('input[formControlName=name]').type('Session pour les chiens');
    cy.get('input[formControlName=date]').type('2025-08-22');
    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('BASTID')
      .click();
    cy.get('textarea[formControlName=description]').type(
      'On test une description comme ça'
    );

    // Vérifie que le bouton de soumission est activé après avoir rempli tous les champs
    cy.get('[data-test-id="button-submit"]').should('be.enabled');

    // Vérifie que le bouton de soumission est désactivé si un champ est vidé puis rempli à nouveau
    cy.get('input[formControlName=name]').clear();
    cy.get('[data-test-id="button-submit"]').should('be.disabled');
    cy.get('input[formControlName=name]').type('Session pour les chiens');

    cy.get('input[formControlName=date]').clear();
    cy.get('[data-test-id="button-submit"]').should('be.disabled');
    cy.get('input[formControlName=date]').type('2025-08-22');

    // Soumet le formulaire
    cy.get('[data-test-id="button-submit"]').click();

    // Then - Vérifie que l'URL contient '/sessions' après la création de session
    cy.url().should('contain', '/sessions');
  });

  // Test : Affichage de l'erreur en cas d'absence d'un champ obligatoire
  it("Affiche une erreur en cas d'absence d'un champ obligatoire", () => {
    // Given - Configuration pour simuler une connexion en tant qu'administrateur
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Intercepte la requête GET pour récupérer les sessions et renvoie une session spécifique
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Première session de notre histoire',
          date: '2024-05-02T13:45:27.000+00:00',
          teacher_id: 1,
          description:
            'Description de la première session. Ca va être du feu !',
          users: [],
          createdAt: '2024-05-02T16:40:26',
          updatedAt: '2024-05-02T16:41:53',
        },
      ]
    ).as('session');

    // Intercepte la requête GET pour récupérer les enseignants et renvoie un enseignant spécifique
    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher',
      },
      [
        {
          id: 1,
          lastName: 'BASTID',
          firstName: 'Chrystal',
          createdAt: '2022-07-22T22:22:22',
          updatedAt: '2022-07-22T22:22:22',
        },
      ]
    ).as('teachers');

    // Visite la page de connexion et remplit le formulaire avec des informations valides
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Vérifie que le bouton de création de session existe
    cy.get('[data-cy="button-create"]').should('exist');

    // When - Clic sur le bouton de création de session
    cy.get('[data-cy="button-create"]').click();

    // Vérifie que le bouton de soumission est désactivé initialement
    cy.get('[data-test-id="button-submit"]').should('be.disabled');

    // Remplit les champs du formulaire, en laissant un champ obligatoire vide
    cy.get('input[formControlName=name]').clear();
    cy.get('[data-test-id="button-submit"]').should('be.disabled');
    cy.get('input[formControlName=name]').type('Session pour les chiens');
    cy.get('input[formControlName=date]').type('2025-08-22');
    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('BASTID')
      .click();
    cy.get('textarea[formControlName=description]').type(
      'On test une description comme ça'
    );

    // Suppression du contenu de name
    cy.get('input[formControlName=name]').clear();

    // Then - On vérifi que la propriété mat-form-field-invalid est ajouter
    cy.get('input[formControlName=name]')
      .parents('mat-form-field')
      .should('have.class', 'mat-form-field-invalid')
      .should('be.visible');

    cy.get('[data-test-id="button-submit"]').should('be.disabled');
  });
});
