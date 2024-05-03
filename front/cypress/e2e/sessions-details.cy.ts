describe('Session details', () => {
  // Test : Affichage des données de session et bouton de suppression si admin connecté
  it("Affichage correct des données et bouton 'Supprimer' si admin connecté", () => {
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
        date: '2024-04-02T00:00:00.000+00:00',
        teacher_id: 1,
        description:
          'Description de la première session. Ca va être du feu vert !',
        users: [1],
        createdAt: '2024-05-02T16:40:26',
        updatedAt: '2024-05-02T16:41:53',
      }
    ).as('session-detail');

    // Intercepte la requête GET pour récupérer les détails d'un enseignant spécifique
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

    // Visite la page de connexion et remplit le formulaire avec des informations valides
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // When - Effectue un clic sur le bouton de détail de session
    cy.get('[data-cy="button-detail"]').click();

    // Attendre 3 secondes pour permettre le chargement des sessions
    cy.wait(3000);

    // Then - Vérifie que les données de session sont correctement affichées
    cy.get('.mat-card-title').contains('Première');
    cy.get('.ml1').contains('April 2, 2024');
    cy.get('.ml1').contains('BASTID');
    cy.get('.description').contains('feu vert !');
    cy.get('.ml1').contains('Delete');
  });

  // Test : Affichage des données de session et pas du bouton de suppression si non-admin connecté
  it("Affichage correct des données et pas de bouton 'Supprimer' si non-admin connecté", () => {
    // Given - Configuration pour simuler une connexion en tant que non-administrateur
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
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
        date: '2024-04-02T00:00:00.000+00:00',
        teacher_id: 1,
        description:
          'Description de la première session. Ca va être du feu vert !',
        users: [1],
        createdAt: '2024-05-02T16:40:26',
        updatedAt: '2024-05-02T16:41:53',
      }
    ).as('session-detail');

    // Intercepte la requête GET pour récupérer les détails d'un enseignant spécifique
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

    // Visite la page de connexion et remplit le formulaire avec des informations valides
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    //When - Effectue un clic sur le bouton de détail de session
    cy.get('[data-cy="button-detail"]').click();

    //Then - Vérifie que les données de session sont correctement affichées
    cy.get('.mat-card-title').contains('Première');
    cy.get('.ml1').contains('April 2, 2024');
    cy.get('.ml1').contains('BASTID');
    cy.get('.description').contains('feu vert !');

    // Le bouton de suppression ne devrait pas être présent pour un non-administrateur
    cy.get('.ml1').should('not.contain', 'Delete');
  });
});
