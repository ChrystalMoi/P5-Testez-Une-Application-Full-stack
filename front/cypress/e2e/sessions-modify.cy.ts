describe('Sessions modify spec', () => {
  // Test : Modification d'une session en tant qu'admin
  it("modifie une session en tant qu'admin", () => {
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
          date: '2024-05-02T00:00:00.000+00:00',
          teacher_id: 1,
          description:
            'Description de la première session. Ca va être du feu !',
          users: [],
          createdAt: '2024-05-02T16:40:26',
          updatedAt: '2024-05-02T16:41:53',
        },
      ]
    ).as('session');

    // Intercepte la requête GET pour récupérer les détails d'une session spécifique
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Première session de notre histoire',
        date: '2023-05-02T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description de la première session. Ca va être du feu !',
        users: [1],
        createdAt: '2024-05-02T16:40:26',
        updatedAt: '2024-05-02T16:41:53',
      }
    ).as('session-detail');

    // Intercepte la requête GET pour récupérer les informations d'un enseignant spécifique
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

    // Intercepte la requête PUT pour mettre à jour une session spécifique
    cy.intercept(
      {
        method: 'PUT',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('session-update');

    // When - Connexion et navigation vers la page de modification de session
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Vérifie que le bouton pour modifier une session existe
    cy.get('[data-cy="button-edit"]').should('exist');
    cy.get('[data-cy="button-edit"]').click();

    // Remplit le formulaire de modification de session
    cy.get('textarea[formControlName=description]').type(
      "Du Yoga dans l'histoire"
    );
    cy.get('[data-test-id="button-submit"]').should('be.enabled');

    cy.get('input[formControlName=name]').clear();
    cy.get('[data-test-id="button-submit"]').should('be.disabled');
    cy.get('input[formControlName=name]').type(
      'Ca va être un enfer au cours de yoga !'
    );

    cy.get('input[formControlName=date]').clear();
    cy.get('[data-test-id="button-submit"]').should('be.disabled');
    cy.get('input[formControlName=date]').type('2025-04-02');

    // Soumet le formulaire de modification de session
    cy.get('[data-test-id="button-submit"]').click();

    // Then - Vérifie que l'URL contient '/sessions' après la modification de la session
    cy.url().should('contain', '/sessions');
  });
});
