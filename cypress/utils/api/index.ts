export default {
    waitForAPI: () => {
        cy.wait('@api');
    },
    registerApiAlias: () => {
        cy.server();
        cy.route('**/api/**').as('api');
    }
}