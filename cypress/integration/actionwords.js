/// <reference types="Cypress" />

exports.Actionwords = {
  iNavigateToP1: function (p1) {
    cy.visit(p1)
    cy.get('img').should('exist')

  }
};