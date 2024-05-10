describe('Gestion du compte utilisateur', () => {
  // Définition des détails de l'utilisateur
  const userDetails = {
    id: 1,
    email: 'yoga@studio.com',
    lastName: 'Yoga',
    firstName: 'Studio',
    admin: false,
    createdAt: '2024-05-06T22:22:22',
    updatedAt: '2024-05-06T21:21:21',
  };

  // Test : L'utilisateur doit voir ses propres informations
  it("L'utilisateur doit voir ses informations personnelles", () => {
    // Interception de la requête de connexion
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });

    // Interception de la requête de session
    cy.intercept({
      method: 'GET',
      url: '/api/session',
    }).as('session');

    // Interception de la requête pour récupérer les détails utilisateur
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/1',
      },
      userDetails
    ).as('userDetails');

    // Navigation vers la page de connexion et saisie des informations
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Clic sur le bouton de compte utilisateur (app.component.html)
    cy.get('[data-test-id="me-account"]').should('exist').click();

    // Vérification des détails utilisateur affichés
    cy.get('p').contains('yoga@studio');
  });

  // Test : L'utilisateur doit être capable de supprimer son propre compte
  it("L'utilisateur doit être capable de supprimer son compte", () => {
    // Interception de la requête de connexion
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });

    // Interception de la requête de session
    cy.intercept({
      method: 'GET',
      url: '/api/session',
    }).as('session');

    // Interception de la requête pour récupérer les détails utilisateur
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/1',
      },
      userDetails
    ).as('userDetails');

    // Interception de la requête de suppression du compte utilisateur
    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200,
    });

    // Navigation vers la page de connexion et saisie des informations
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Clic sur le bouton de compte utilisateur (app.component.html)
    cy.get('[data-test-id="me-account"]').should('exist').click();

    // Vérification de la présence de 'me' dans l'URL
    cy.url().should('contain', 'me');

    // Clic sur le bouton de suppression de compte (me.component.html)
    cy.get('[data-test-id="button-delete-account"]').should('exist').click();

    // Vérification que 'me' n'est plus présent dans l'URL après la suppression
    cy.url().should('not.contain', 'me');
  });
});
