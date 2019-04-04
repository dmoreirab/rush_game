//Requiring PageObjects
const WrapperObjects = require ('../../pageObjects/wrapper_page_objects');
const CommonObjects = require('../../pageObjects/common_page_objects');

//Instantiate PageObjects
var wrapperObjects = new WrapperObjects();
var commonObjects = new CommonObjects();

//Pre-conditions
beforeEach(() => {
  cy.visit('/mindera-rush')
})

describe('Testing Game Wrapper', () => {

    it('Should change language', () => {
      cy
      .get(wrapperObjects.languageDropdownMenuContainer)
      .click()
      .get(wrapperObjects.languageDropdownMenu)
      .select('English')
      .should('have.value', 'en-GB')

      .get(wrapperObjects.languageDropdownMenuContainer)
      .click()
      .get(wrapperObjects.languageDropdownMenu)
      .select('Portuguese')
      .should('have.value', 'pt-PT')

      .get(wrapperObjects.languageDropdownMenuContainer)
      .click()
      .get(wrapperObjects.languageDropdownMenu)
      .select('English')
      .should('have.value', 'en-GB')
    })

    it('Should receive alert when trying to play without logging in', () => {
      const stub = cy.stub()
      cy.on('window:alert', stub)

      cy
      .get(wrapperObjects.rushButton)
      .click()
      .then(() => {
        expect(stub.getCall(0))
        .to.be.calledWith('Please sign in to play.')
      })
    })

    it('Should display all the correct elements when the user is logged out', () => {
      cy
      .get(wrapperObjects.clockIcon)
      .should('be.visible')
      .get(wrapperObjects.time)
      .should('be.visible')
      .get(wrapperObjects.playTime)
      .should('not.be.visible') 
      .get(wrapperObjects.buzzBrand)
      .should('be.visible')   
      .get(wrapperObjects.googleSignInButton)
      .should('be.visible')
      .get(wrapperObjects.googleButtonText).children()
      .contains('Sign in')   
    })

    xit('Should display all the correct elements when the user is logged in', () => {
      cy
      .get(wrapperObjects.clockIcon)
      .should('be.visible')
      .get(wrapperObjects.time)
      .should('be.visible')
      .get(wrapperObjects.playTime)
      .should('not.be.visible') 
      .get(wrapperObjects.buzzBrand)
      .should('be.visible')   
      .get(wrapperObjects.googleSignInButton)
      .contains('Login')   
    })

    xit('Should click the google sign in button and open new instance of the browser', () => {
      
    })
})