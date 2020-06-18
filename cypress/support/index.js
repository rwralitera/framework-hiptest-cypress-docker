// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

import './commands'
const addContext = require('mochawesome/addContext')
const api = require('../utils/api').default;

// Alternatively you can use CommonJS syntax:
// require('./commands')

// cypress/support/index.js

beforeEach(function () {
	this.actionwords = Object.create(require('../integration/actionwords.js').Actionwords);
	// Tags: Datainit
	// now this runs prior to every test
	// across all files no matter what
	try {
		cy.clearCookies()
		cy.getCookies().should('be.empty')
	} catch (err) {
		cy.clearCookies() // catch error
		cy.getCookies().should('be.empty')
	}
})

afterEach(function () {
	if (this.currentTest.state === 'failed') {
		//Cypress.runner.stop()
		cy.task('log', "========================================TEST FAILED===============================================================================")
	}
});

Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
		const screenshotFileName = `${runnable.parent.title} -- ${runnable.parent.title} -- ${test.title} (failed).png`
		const regex = /\(uid:/gm
		const screenshotFileNameRegex = screenshotFileName.replace(regex, '(uid')
        addContext({ test }, `assets/${Cypress.spec.name}/${screenshotFileNameRegex}`)
    }
})
