describe('Register spec', () => {
  // Test: Inscription réussie avec les identifiants corrects qui doit mener aux sessions
  it("L'inscription réussie avec les identifiants corrects doit mener aux sessions", () => {
    // Given - Configuration pour simuler une inscription réussie
    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // When - L'utilisateur effectue une visite sur la page d'inscription et saisi les informations
    cy.visit('/register');
    cy.get('input[formControlName=firstName]').type('admin');
    cy.get('input[formControlName=lastName]').type('admin');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type="submit"]').click();

    // Then - Vérifie que l'URL contient '/login'
    cy.url().should('include', '/login');
  });

  // Test: Le bouton devrait être activé/désactivé en fonction de ce qui est saisi dans le formulaire
  it('Le bouton devrait être activé/désactivé en fonction de ce qui est saisi', () => {
    // Given - Visite de la page d'inscription et vérification que le bouton est désactive
    cy.visit('/register');
    cy.get('button[type="submit"]').should('be.disabled');

    // When - Saisie d'une partie des informations
    cy.get('input[formControlName=email]').type('test2@studio.com');
    cy.get('input[formControlName=password]').type('azerty!');

    // Then - Vérifie que le bouton reste désactivé
    cy.get('button[type="submit"]').should('be.disabled');

    // When - Saisie du reste des informations
    cy.get('input[formControlName=firstName]').type('nameFirst');
    cy.get('input[formControlName=lastName]').type('nameLast');

    // Then - Vérifie que le bouton est activé
    cy.get('button[type="submit"]').should('not.be.disabled');

    // When - Efface le mot de passe
    cy.get('input[formControlName=password]').clear();

    // Then - Vérifie que le bouton est à nouveau désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
