//Requiring PageObjects
const BetObjects = require ('../../pageObjects/bet_page_objects');
const CommonObjects = require('../../pageObjects/common_page_objects');

//Instantiate PageObjects
var betObjects = new BetObjects();
var commonObjects = new CommonObjects();

beforeEach(() => {
  cy.clearCookies() 
  cy.clearLocalStorage() 
  cy.viewport(1280, 720)
  cy.visit('/rush/?token=uVLReTuvKKpkH10WeYPOG3XdB3fvucVQi8LmWRtwWtObWKKs11KwnLPJfRDeXEeLocIzUHSX9D4ZcgpRBqaAmw6H0RJpnyttpC1lgO599wsDUph5tneh5ahJsLRYp2Vs&currency=EUR&language=en-GB') 
  
  .get(commonObjects.howToPlayButton)
  .click()
  .get(commonObjects.howToPlaySkipButton)
  .click()
})

//Functions

let addAllTokens = () => {
  cy
  .get(betObjects.chipsContainer)
  .each(($el) => {
    cy
    .wrap($el)
    .click()
  })
}

//User can only bet if the BUST text is on game screen
let waitUntilUserCanBet = () => {
  cy
  .get(commonObjects.placeBetTimerText, { timeout: 120000 })
  
}

let waitUntilUserCanBetOnNewRound = () => {
  cy
  .get(commonObjects.placeBetTimerText, { timeout: 120000 })
  .get(commonObjects.nextRoundTimerText)
  .should('not.exist')
  .get(commonObjects.nextRoundTimerText, { timeout: 120000 })
  .get(commonObjects.placeBetTimerText, { timeout: 120000 })
}

let tryToPlaceBet = () => {
  cy
  .get(betObjects.confirmBetButton)
  .click()
}

let gameStarted = () => {
  cy
  .get(commonObjects.nextRoundTimerText, { timeout: 120000 })

  .get(commonObjects.nextRoundTimerText)
  .should('not.exist')
}

let betAndConfirm = () => {
  addAllTokens()
  tryToPlaceBet()
}

let placeOverMaximumLimitBet = () => {
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  addAllTokens()
  tryToPlaceBet()
}

let generateRandomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}


let inputAutobetRandomMultiplier = () => {
    let randomMultiplier = ''; 

    for(let i = 0; i < 4; i++) {
      const num = generateRandomIntInRange(1,9)
      if(i == 1) {
          randomMultiplier += '.';
      }
      else {
          randomMultiplier += num;
      }
    }
    return randomMultiplier;
}

let eraseAutobetMultiplier = () => {
  cy
  .get(betObjects.autoCashoutMultiplierInput)
  .clear()
}

let setMininumCashoutValue = () => {
  cy
    .get(betObjects.autoCashoutMultiplierInput)
    .type('1.01')
} 

let setMaximumAutobetValue = () => {
  cy
    .get(betObjects.autobetRoundsSelect)
    .select('10')
}


//Proper Tests
describe('Testing Desktop Bets', () => {
  
  it('should verify all elements in a complete round without betting', () => {
    //***** BETTING PHASE ******//

    waitUntilUserCanBetOnNewRound()

    //should display timer for new bets when the game busts
    cy
    .get(commonObjects.placeBetTimerText)
    .should('be.visible')
    .contains('Place your bet in:')

    //should bust the game without placing bets and check elements
    cy
    .get(commonObjects.busted)
    .should('have.text', 'Bust')
    .get(commonObjects.placeBetTimer)
    .should('not.be.empty')

    //should have the confirm button disabled if stake is 0
    .get(betObjects.stake)
    .should('have.text', '€0,00')
    tryToPlaceBet()
    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')

    //should add a token of every value to the stake multiple times
    addAllTokens()
  
    cy
    .get(betObjects.stake)
    .should('have.text', '€86,00')

    //should clear a bet and verify that the confirm button is disabled
    .get(betObjects.clearStake)
    .click()
    .get(betObjects.stake)
    .should('have.text', '€0,00')
    .get(betObjects.confirmBetButton)
    tryToPlaceBet()
    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')

    //

    //***** BETS CLOSED PHASE ******//
    cy.get(commonObjects.nextRoundTimerText, { timeout: 120000 })

    //should display timer when the game is about to start
    cy
    .should('be.visible')
    .contains('Next round starts in:')

    //should warn the player when betting is paused
    .get(betObjects.betPausedUpperText)
    .should('have.text', 'Betting Paused!')
    .get(betObjects.betPausedBottomText)
    .should('have.text', 'Wait for current game to end')
    .get(betObjects.confirmBetButton)
    .should('not.be.visible')

    //***** GAME PHASE ******//
    gameStarted()

    //should not display counters when the game is running
    cy
    .get(commonObjects.busted)
    .should('not.exist')
    .get(commonObjects.placeBetTimer)
    .should('not.exist')
  })

  it('should verify all elements in a complete round after betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()
    
    cy
    .get(betObjects.stake)
    .should('have.text', '€86,00')
    waitUntilUserCanBet()
    setMininumCashoutValue()
    setMaximumAutobetValue()
    betAndConfirm()
    cy
    .get(betObjects.cashOutBtn)
    .should('have.attr', 'disabled')
    //***** BETS CLOSED PHASE ******//
    cy.get(commonObjects.nextRoundTimerText, { timeout: 120000 })

    //should display timer when the game is about to start
    cy
    .should('be.visible')
    .contains('Next round starts in:')

    //***** GAME PHASE ******//
    gameStarted()

    //should display the multiplier when the player bets and the game starts
    cy
    .get(betObjects.cashOutBtn)
    .should('be.visible')
    .get(commonObjects.multiplier)
    .should('be.visible')

    //should cash out the bet and verify winning elements
    cy.get(commonObjects.lastWinTitle, { timeout: 120000 })
    cy
    .get(commonObjects.lastWinValue)
    .should('have.text', '€1,72')

    //***** BUST PHASE ******//
    cy.get(commonObjects.autobetTimerText, { timeout: 120000 })
    
    //should return the stake to a previous state after a complete round
    .get(betObjects.stake)
    .should('have.text', '€172,00')
    .get(betObjects.clearStake)
    .click()
    .get(betObjects.stake)
    .should('have.text', '€0,00')
  })

  it('should verify all elements of history tab in a complete round without betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()
    cy.get(commonObjects.bustValue).then(($bustValue) => {

    const bustValueWithoutX = $bustValue.text()
    const bustValueWithX = bustValueWithoutX + 'x';
    
    cy.get(commonObjects.historyTab)
    .click()
    .get(commonObjects.historyOne).first()
    .should('have.text', bustValueWithX)
    .get(commonObjects.historyTabContainer)
    .should('be.visible')  
    })
  })

  it('should verify all elements of history tab in a complete round after betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()
    waitUntilUserCanBet()
    betAndConfirm()
    cy
    .get(betObjects.cashOutBtn)
    .should('have.attr', 'disabled')

    //***** BETS CLOSED PHASE ******//
    

    //***** GAME PHASE ******//
    gameStarted()

    //***** BUST PHASE ******//
    cy.get(commonObjects.placeBetTimerText, { timeout: 120000 })
    
    .get(commonObjects.historyTab)
    .click()
    .get(commonObjects.historyOne).eq(2)
    .should('have.text',  '€172,00')

    cy.get(commonObjects.bustValue).then(($bustValue) => {

      const bustValueWithoutX = $bustValue.text()
      const bustValueWithX = bustValueWithoutX + 'x';
      cy
      .get(commonObjects.historyOne).first()
      .should('have.text', bustValueWithX)
    })
  })

  it('should not let the user bet more than the maximum bet', () => {
    waitUntilUserCanBetOnNewRound()
    placeOverMaximumLimitBet()

    cy
    .get(betObjects.stake)
    .should('have.text', '€482,00')
    .get(commonObjects.confirmingBetScreen)
    .should('be.visible')
  })

  it('should modify an auto cashout value', () => {
    //***** BETTING PHASE ******//
    const multiplier1 = inputAutobetRandomMultiplier()
    waitUntilUserCanBetOnNewRound()

    cy
    .get(betObjects.autoCashoutMultiplierInput)
    .type(multiplier1)
    .get(betObjects.autobetTitleInactive)
    .click()

    .get(betObjects.autoCashoutMultiplierInput)
    .invoke('attr', 'value')
    .should('contain', multiplier1 + 'x')
  
    //Select random number, change it to another and verify confirmation

    eraseAutobetMultiplier()

    const multiplier2 = inputAutobetRandomMultiplier()

    cy
    .get(betObjects.autoCashoutMultiplierInput)
    .type(multiplier2)
    .get(betObjects.autobetTitleInactive)
    .click()

    .get(betObjects.autoCashoutMultiplierInput)
    .invoke('attr', 'value')
    .should('contain', multiplier2 + 'x')
  
    //Disable autobet
    cy
    .get(betObjects.autoCashoutTitleActive)
    .should('be.visible')
    .get(betObjects.autoCashoutToggleActive)
    .should('be.visible')
    .click()

    cy
    .get(betObjects.autoCashoutMultiplierInput)
    .should('be.visible')
    .get(betObjects.autoCashoutTitleInactive)
    .should('be.visible')
    .get(betObjects.autoCashoutToggleInactive)
    .should('be.visible')
    .click()
  })

  it.only('should modify an auto bet value', () => {
    waitUntilUserCanBetOnNewRound()
    //choose an autobet number
    const selectNum1 = generateRandomIntInRange(1,10)
    cy
    .get(betObjects.autobetRoundsSelect)
    .select(selectNum1.toString())
    
    .get(betObjects.autobetRoundsDisplay)
    .should('have.text', selectNum1.toString())

    //edit autobet number
    const selectNum2 = generateRandomIntInRange(0,10)

    cy
    .get(betObjects.autobetRoundsSelect)
    .select(selectNum2.toString())
    
    .get(betObjects.autobetRoundsDisplay)
    .should('have.text', selectNum2.toString())
    .get(betObjects.autobetTitleActive)
    .should('be.visible')
    .get(betObjects.autoBetToggleActive)
    .should('be.visible')
    .click()

    .get(betObjects.autobetTitleActive)
    .should('not.be.visible')
    .get(betObjects.autoBetToggleActive)
    .should('not.be.visible')
    .get(betObjects.autoBetToggleInactive)
    .click()
    .get(betObjects.autobetRoundsDisplay)
    .should('have.text', selectNum2.toString())
  })
  
  it('should verify elements from autobet and auto cashout in an active round', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()
    
    cy
    .get(betObjects.autoCashoutMultiplierInput)
    .click()

    const multiplier1 = inputAutobetRandomMultiplier()
    waitUntilUserCanBetOnNewRound()

    cy
    .get(betObjects.autoCashoutMultiplierInput)
    .type(multiplier1)
    .get(betObjects.autobetTitleInactive)
    .click()

    .get(betObjects.autoCashoutMultiplierInput)
    .invoke('attr', 'value')
    .should('contain', multiplier1 + 'x')

    const selectNum1 = generateRandomIntInRange(1,10)

    cy
    .get(betObjects.autobetRoundsSelect)
    .select(selectNum1.toString())
    
    .get(betObjects.autobetRoundsDisplay).then(autobetNum => {
      const chosenAutobetNumber = autobetNum.text()

      waitUntilUserCanBet()
      betAndConfirm()

      //***** BETS CLOSED PHASE ******//
      cy.get(commonObjects.nextRoundTimerText, { timeout: 120000 })

      //***** GAME PHASE ******//
      gameStarted()

      cy
      .get(commonObjects.autoCashoutGameValue)
      .should('have.text', multiplier1 + 'x')

      .get(commonObjects.autoBetGameValue)
      .should('have.text', chosenAutobetNumber)
    })
    //***** BUST PHASE ******//    
  })

  it('should compare last game results with history tab last results', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    cy
    .get(commonObjects.historyTab)
    .click()

    const listValues = [];
    for(let i = 0; i < 5; i++) {
      cy.get(commonObjects.lastGameItemList).eq(i).then(elem => {
        listValues[i] = elem.text();

        if(i == 0) {
          cy
          .get(commonObjects.historyOne).eq(i)
          .should('have.text', listValues[i])
        }
        else {
          cy
          .get(commonObjects.historyOne).eq(4 * i)
          .should('have.text', listValues[i])
        }
      })      
    }
  })

  it('should verify balance and bet value after betting', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    cy
    .get(commonObjects.betTitle)
    .should('be.visible')
    .get(commonObjects.balanceTitle)
    .should('be.visible')

    .get(commonObjects.balanceAmount).then(elem => {
      const balanceAmount = elem.text()
      cy.log(balanceAmount)

    })
  })

  it('should verify that the bets are locked after confirming a bet', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()

    tryToPlaceBet()

    cy
    .get(betObjects.lockedBetsScreen)
    .should('not.be.visible')
    cy
    .get(betObjects.lockedBetsScreen)
    .should('be.visible')
    cy
    .get(betObjects.lockedBets)
    .should('be.visible')
  })

  it.only('should verify option elements', () => {
    //***** BETTING PHASE ******//
    waitUntilUserCanBetOnNewRound()

    //should place a simple bet
    addAllTokens()

    tryToPlaceBet()

    cy
    .get(betObjects.lockedBetsScreen)
    .should('not.be.visible')
    cy
    .get(betObjects.lockedBetsScreen)
    .should('be.visible')
    cy
    .get(betObjects.lockedBets)
    .should('be.visible')

    .get(commonObjects.rulesInfo)
    .click()
    .get(commonObjects.rulesInfoWrapper)
    .should('be.visible')
    .get(commonObjects.rulesInfoWrapperCloseBtn)
    .click()
    .get(commonObjects.rulesInfoWrapper)
    .should('not.be.visible')
    .get(commonObjects.rulesInfoWrapperCloseBtn)
    .should('not.be.visible')

    .get(commonObjects.faqBtn)
    .click()
    .get(commonObjects.faqWrapper)
    .should('be.visible')
    .get(commonObjects.faqCloseBtn)
    .click()
    .get(commonObjects.faqWrapper)
    .should('not.be.visible')
    .get(commonObjects.faqCloseBtn)
    .should('not.be.visible')

    .get(commonObjects.howToPlayBtn)
    .click()
    .get(commonObjects.howToPlayButton)
    .click()
    .get(commonObjects.howToPlaySkipButton)
    .click()
  })

})

