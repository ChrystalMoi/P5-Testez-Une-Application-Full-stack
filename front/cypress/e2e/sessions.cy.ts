describe('Sessions spec', () => {
  // Test : Les sessions doivent être affichées après la connexion
  it('Les sessions doivent être affichées après la connexion', () => {
    // Given - Configuration pour simuler une connexion réussie
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

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
        {
          id: 2,
          name: 'Seconde session de legende',
          date: '2024-05-01T00:00:00.000+00:00',
          teacher_id: 2,
          description: 'Description de la seconde session',
          users: [],
          createdAt: '2024-05-01T16:49:26',
          updatedAt: '2024-05-01T16:49:26',
        },
      ]
    ).as('session');

    // When - Effectuer une connexion
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Attendre 3 secondes pour permettre le chargement des sessions
    cy.wait(3000);

    // Then - Vérifie que les sessions sont affichées
    cy.get('.mat-card-title').contains('histoire');
    cy.get('.mat-card-title').contains('legende');
  });

  // Test : Boutons Create, Edit, et Detail visibles après connexion admin
  it('Affiche les boutons Create, Edit, et Detail après connexion admin', () => {
    // Given - Intercepte les requêtes de connexion et de récupération des sessions
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept({ method: 'GET', url: '/api/session' }, [
      {
        id: 1,
        name: 'Première session de notre histoire',
        date: '2024-05-01T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description de la première session. Ca va être du feu !',
        users: [],
        createdAt: '2024-05-01T16:29:26',
        updatedAt: '2024-05-01T16:29:53',
      },
    ]).as('session');

    // When - Effectuer une connexion
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Attendre 3 secondes pour permettre le chargement des sessions
    cy.wait(3000);

    // Then - Vérifie la présence des boutons Create, Edit et Detail
    cy.get('.mat-raised-button').contains('Create').should('exist');
    cy.get('.mat-raised-button').contains('Edit').should('exist');
    cy.get('.mat-raised-button').contains('Detail').should('exist');
  });

  // Test : Les boutons Créer et Modifier masqués, Détail visible après connexion utilisateur non admin
  it('Les boutons Créer et Modifier masqués, Détail visible après connexion utilisateur non admin', () => {
    // Given - Configuration pour simuler une connexion en tant qu'utilisateur non administrateur
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });

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

    // When - Effectuer une connexion
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Attendre 3 secondes pour permettre le chargement des sessions
    cy.wait(3000);

    // Then - érifie que les boutons Créer et Modifier sont masqués, mais que le bouton Détail est affiché
    cy.get('.mat-raised-button').contains('Create').should('not.exist');
    cy.get('.mat-raised-button').contains('Edit').should('not.exist');
    cy.get('.mat-raised-button').contains('Detail').should('exist');
  });
});
