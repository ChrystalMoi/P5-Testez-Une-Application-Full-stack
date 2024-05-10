describe('Logout spec', () => {
  // Test: La déconnexion doit renvoyer à la page de connexion
  it('La déconnexion doit renvoyer à la page de connexion', () => {
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

    cy.intercept({ method: 'GET', url: '/api/session' }, []).as('session');

    // Effectue une connexion
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // When - Clique sur le bouton de déconnexion
    cy.contains('Logout').click();

    // Then - Vérifie que l'URL ne contient pas '/sessions'
    cy.url().should('not.contain', '/sessions');
  });
});
