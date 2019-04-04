//Requiring PageObjects
const BetObjects = require ('../../pageObjects/bet_page_objects');
const CommonObjects = require('../../pageObjects/common_page_objects');

//Instantiate PageObjects
var betObjects = new BetObjects();
var commonObjects = new CommonObjects();

/*
//Pre-conditions
before(() => {
  cy.request({
    method: 'POST',
    url: '/mindera-rush',
    form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
    body: {
      username: 'danbar.testing@gmail.com',
      password: 'Testing01=!'
    }
  })
  
  // just to prove we have a session
  cy.getCookie('cypress-session-cookie').should('exist')
})
*/

beforeEach(() => {
  cy.visit('/rush/game?token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzEzZTdmZDFlOWUyYTRkZWQzYjI5MmQyYTdmNGU1MTk1NzQzMDgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiODQyMjA1NDU5MDEtbnFqa3BwdGtyMW1wMmU1Mmg2aWdmYzJjZXBoN203czAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NDIyMDU0NTkwMS1ucWprcHB0a3IxbXAyZTUyaDZpZ2ZjMmNlcGg3bTdzMC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMDgxNTg5NzQ2OTA0MDc5MDI1OSIsImhkIjoibWluZGVyYS5jb20iLCJlbWFpbCI6ImRhbmlsby5iYXJib3NhQG1pbmRlcmEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiIyT3NDZUQ0ZllyTGtoSWxiX0dpRnp3IiwibmFtZSI6IkRhbmlsbyBCYXJib3NhIiwicGljdHVyZSI6Imh0dHBzOi8vbGg2Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tLTFlTGZsbTk3OFkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUNIaTNyZjlMYlFqMW5oaU5fM05yWXNPYmREWm9DNkp1Zy9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiRGFuaWxvIiwiZmFtaWx5X25hbWUiOiJCYXJib3NhIiwibG9jYWxlIjoiZW4tR0IiLCJpYXQiOjE1NTQzNjQ3MjcsImV4cCI6MTU1NDM2ODMyNywianRpIjoiZTVhMTA5YWRhODg5MDRjZjY1MGUyZTcwNzI5OThmNmUzNTgzZjc4YyJ9.LSvYuJZbJLLL4n79sYbDdzhIoLMAmOGpWF_vJiGriiiFmD-5bY0_iZs3ECINO3PZDMOhrpIjutzF5_DtCFIEIiG-S-PdiANLJmic2V2csgJoTPnDLOAcqG_20_plkoaygxAj9kINlYFd0Gnw6W5V9ewmXuobarWvATHy_IrdWjyBospB86qTKhKEalfv3DCxLoRKrtOcPCdlWMhx50QN_j8kLgEIP1fJEs2Nwd1B8L1P4TkD1d29GMIUdgySHGBry72ZhsqDWx7hT1wdBvsFN5Mad330OYMebY-LBfeTSES0Q-7O4umBpcDVoKy5ArkAh2xvPyINdOkesStMQHkqHQ&currency=EUR&language=')
})

//Functions
let betConfirmation = () => {
  cy
  .get(commonObjects.confirmingBetScreen)
  .should('be.visible')
  .get(commonObjects.betConfirmingText)
  .contains('Confirming bet...')
  .get(commonObjects.confirmationSpinner)
  .should('be.visible')
  .get(commonObjects.betAcceptedContainer)
  .should('be.visible')
  .get(commonObjects.betAcceptedIcon)
  .should('be.visible')
  .get(commonObjects.betAcceptedText)
  .contains('Bet Accepted')

  //verifying if the elements disappeared
  .get(commonObjects.confirmingBetScreen)
  .should('not.be.visible')
  .get(commonObjects.betAcceptedContainer)
  .should('not.be.visible')
}

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

let tryToPlaceBet = () => {
  cy
  .get(betObjects.confirmBetButton)
  .click()
}

//User can only bet if the BUST text is on game screen
let waitUntilBettingPauses = () => {
  cy
  .get(betObjects.betPausedContainer, { timeout: 120000 })
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

//Proper Tests
describe('Testing Bets', () => {
  xit('should start the game in the bet tab', () => {
    
  })

  it('should have the confirm button disabled if stake is 0', () => {
    waitUntilUserCanBet()
    cy
    .get(betObjects.stake)
    .should('have.text', '€0,00')
    tryToPlaceBet()
    
    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')
  })

  it('should place a simple bet', () => {
    waitUntilUserCanBet()
    cy
    .get(betObjects.tokenOne)
    .click()
    .get(betObjects.tokenTen)
    .click()

    waitUntilUserCanBet()
    tryToPlaceBet()

    //check for all the elements of confirmation
    betConfirmation() 
  })

  it('should clear a bet and verify that the confirm button is disabled', () => {
    waitUntilUserCanBet()
    cy
    .get(betObjects.tokenFive)
    .click()

    .get(betObjects.clearStake)
    .click()

    .get(betObjects.stake)
    .should('have.text', '€0,00')

    waitUntilUserCanBet()
    tryToPlaceBet()

    cy
    .get(commonObjects.confirmingBetScreen)
    .should('not.be.visible')
  })

  it('should add a token of every value to the stake', () => {
    waitUntilUserCanBet()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '€86,00')

    waitUntilUserCanBet()
    tryToPlaceBet()

    betConfirmation()
  })

  it('should return the stake to a previous state', () => {
    waitUntilUserCanBet()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '€86,00')

    waitUntilUserCanBet()
    tryToPlaceBet()
    betConfirmation()

    cy
    .get(betObjects.clearStake)
    .click()

    .get(betObjects.stake)
    .should('have.text', '€0,00')
  })

  it('should add multiple and different tokens', () => {
    addAllTokens()
    addAllTokens()
    addAllTokens()
    addAllTokens()
    cy
    .get(betObjects.stake)
    .should('have.text', '€344,00')

    waitUntilUserCanBet()
    tryToPlaceBet()

    betConfirmation()
  })

  it('should bust the game without placing bets and check elements', () => {
    waitUntilUserCanBet()
    cy
    .get(commonObjects.busted)
    .should('have.text', 'Bust')
    .get(commonObjects.placeBetTimer)
    .should('not.be.empty')
  })

  it('should warn the player when betting is paused', () => {
    cy
    .get(betObjects.betPausedContainer, { timeout: 120000 })
    
    .get(betObjects.betPausedUpperText)
    .should('have.text', 'Betting Paused!')
    .get(betObjects.betPausedBottomText)
    .should('have.text', 'Wait for current game to end')
    .get(betObjects.confirmBetButton)
    .should('not.be.visible')
  })

  it('should not allow the player to bet when betting is paused', () => {
    cy
    .get(betObjects.betPausedContainer, { timeout: 120000 })
    .get(betObjects.confirmBetButton)
    .should('not.be.visible')
  })

  it('should display timer for new bets when the game busts', () => {
    waitUntilUserCanBet()
    cy
    .get(commonObjects.placeBetTimerText)
    .should('be.visible')
    .contains('Place your bet in:')

    .get(betObjects.confirmBetButton)
    .should('be.visible')
  })

  it('should display timer when the game is about to start', () => {
    waitUntilUserCanBet()
    cy
    .get(commonObjects.nextRoundTimerText, { timeout: 120000 })
    .should('be.visible')
    .contains('Next Round Starts in:')
  })

  it('should not display counters when the game is running', () => {
    gameStarted()

    cy
    .get(commonObjects.busted)
    .should('not.exist')
    .get(commonObjects.placeBetTimer)
    .should('not.exist')
  })

  xit('should not display the bet tab when a bet was placed and the game is running', () => {
    waitUntilUserCanBet()
    betAndConfirm()

    cy
    .get(betObjects.cashOutBtn)
    .should('have.attr', 'disabled')

    gameStarted()
    
    cy
    .get(commonObjects.betTabContainer)
    .should('not.exist')
    .get(commonObjects.tabsContainer)
    .should('not.exist')

  })
  
  it('should cash out the bet and verify winning elements', () => {
    waitUntilUserCanBet()
    betAndConfirm()

    gameStarted()
    cy
    .get(betObjects.cashOutBtn)
    .click()

    .get(commonObjects.cashedOutReturn)
    .should('be.visible')
    .get(commonObjects.cashedOutMultiplier)
    .should('be.visible')
    .get(commonObjects.winToast)
    .should('be.visible')
  })

  it('should display the multiplier when the player bets and the game starts ', () => {
    waitUntilUserCanBet()
    betAndConfirm()

    gameStarted()
    cy
    .get(betObjects.cashOutBtn)
    .should('be.visible')
    .get(commonObjects.multiplier)
    .should('be.visible')
  })

  it('should display current stake and last game bets after betting', () => {
    waitUntilUserCanBet()
    betAndConfirm()

    gameStarted()
    cy
    .get(betObjects.betSummary)
    .should('be.visible')
    .get(betObjects.betSummaryStake)
    .should('have.text', 'Stake: €86,00')
    .get(betObjects.betSummaryLastStake)
    .should('be.visible')
  })
})

