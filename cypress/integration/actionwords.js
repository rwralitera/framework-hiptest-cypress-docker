/// <reference types="Cypress" />

exports.Actionwords = {
  theUserIsOnP1SectionOfP2PageForP3Company: function (p1, p2, p3) {
    cy.get('#ember926').click()
    cy.get('.name').contains(p3).first().click()
    cy.wait(5000) //Modification de la page après rafraichissement en 2 temps
    cy.get('.ember-view').contains(p1).click()
  },
  theUserIsLoggedInAsP1: function (p1) {
    cy.visit('/login')
    cy.get('#ember565').type('ralitera@october.eu')
    cy.get('#ember575').type('Rrw141189*')
    cy.get('#ember612').click()
    cy.get('#ember1044 > h1').should('exist')

  },
  theUserClicksOnP1Link: function (p1) {
    cy.get('.infos').contains(p1).click()

  },
  theUserShoulsSeeAFlagWithColorP1: function (p1) {
    cy.get('.scan-flag').should('have.class',p1)

  }
};