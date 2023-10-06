// cypress/integration/app.spec.js

describe('Pruebas de la aplicación React', () => {
  before(() => {
    // Esta parte se ejecutará una sola vez antes de todas las pruebas
  });

  beforeEach(() => {
    // Carga la aplicación React antes de cada prueba
    cy.visit('http://localhost:3000/');
  });

  it('debería mostrar el título de la aplicación', () => {
    cy.get('[data-testid="vite-react-title"]').should(
      'have.text',
      'Vite + React'
    );
  });

  it('debería incrementar el contador al hacer clic en el botón', () => {
    cy.get('button').contains('count is 0').click();
    cy.get('button').contains('count is 1');
  });

  it('debería cargar y mostrar el texto desde la API', () => {
    // Simula una respuesta de la API
    cy.intercept('GET', 'http://localhost:8080', {
      statusCode: 200,
      body: 'Texto de prueba desde la API',
    });

    cy.get('p').contains('Texto de prueba desde la API');
  });
});
