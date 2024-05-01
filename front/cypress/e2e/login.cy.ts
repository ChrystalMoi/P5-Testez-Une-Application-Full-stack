describe('Login spec', () => {
  // Test: La connexion réussie avec des identifiants corrects devrait mener aux sessions
  it('La connexion réussie avec des identifiants corrects devrait mener aux sessions', () => {
    // Given - Configuration des réponses simulées pour la connexion et la session
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

    // When - Effectue les actions de connexion avec les bon identifiants
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Then - Vérifie la redirection vers la page des session et l'absence de message d'erreur
    cy.url().should('include', '/sessions');
    cy.get('.error').should('not.exist');
  });

  // Test: La connexion échoue avec des identifiants incorrects
  it('La connexion échoue avec des identifiants incorrects', () => {
    // Given: Configuration pour simuler un échec de connexion
    cy.intercept('POST', '/api/auth/login', { statusCode: 400 });

    // When: Effectue les actions de connexion avec de mauvais identifiants
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Then: Vérifie que l'utilisateur reste sur la page de connexion et voit un message d'erreur
    cy.url().should('include', '/login');
    cy.get('.error').should('exist');
  });

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

  // Test: Activation/désactivation du bouton en fonction de ce qui est saisi
  it('Le bouton devrait être activé/désactivé en fonction de ce qui est saisi', () => {
    // Given - Visite de la page de connexion et vérification que le bouton est désactivé
    cy.visit('/login');
    cy.get('button[type="submit"]').should('be.disabled');

    // When - Saisi une partie des identifiants
    cy.get('input[formControlName=email]').type('yoga');
    cy.get('input[formControlName=password]').type('test!1234');

    // Then - Vérifie que le bouton reste désactivé
    cy.get('button[type="submit"]').should('be.disabled');

    // When - Saisi le reste des identifiants
    cy.get('input[formControlName=email]').type('@studio.com');

    // Then - Vérifie que le bouton est activé
    cy.get('button[type="submit"]').should('not.be.disabled');

    // When - Efface le mot de passe
    cy.get('input[formControlName=password]').clear();

    // Then - Vérificatiion que le bouton est à nouveau désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
