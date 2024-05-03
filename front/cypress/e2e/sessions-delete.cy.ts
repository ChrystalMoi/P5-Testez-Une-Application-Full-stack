describe('Session delete', () => {
  // Test : Suppression d'une session par un administrateur
  it('Un administrateur doit pouvoir supprimer une session', () => {
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
          date: '2024-05-01T00:00:00.000+00:00',
          teacher_id: 1,
          description:
            'Description de la première session. Ca va être du feu !',
          users: [],
          createdAt: '2024-05-01T16:29:26',
          updatedAt: '2024-05-01T16:29:53',
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
        date: '2024-05-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description de la première session. Ca va être du feu !',
        users: [1],
        createdAt: '2024-05-01T16:29:26',
        updatedAt: '2024-05-01T16:29:53',
      }
    ).as('session-detail');

    // Intercepte la requête GET pour récupérer les informations d'un enseignant spécifique
    cy.intercept(
      {
        method: 'GET',
        url: '/api/teacher/1',
      },
      {
        id: 1,
        lastName: 'BASTID',
        firstName: 'Chrystal',
        createdAt: '2022-07-22T22:22:22',
        updatedAt: '2022-07-22T22:22:22',
      }
    ).as('teacher');

    // Intercepte la requête DELETE pour supprimer une session spécifique
    cy.intercept(
      {
        method: 'DELETE',
        url: '/api/session/1',
      },
      {
        statusCode: 200,
      }
    ).as('session-delete');

    // Visite la page de connexion et authentification
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Clic sur le bouton pour accéder aux détails de la session
    cy.get('[data-cy="button-detail"]').click();
    cy.get('.ml1').contains('Delete');

    // When - Clic sur le bouton de suppression de la session
    cy.get('.ml1').contains('Delete').click();

    // Then - Vérifie que l'URL contient '/sessions' après la suppression de la session
    cy.url().should('include', '/sessions');
  });
});
