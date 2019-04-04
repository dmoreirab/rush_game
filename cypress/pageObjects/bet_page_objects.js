const BetObjects = function() {
   
    this.confirmBetButton = '[data-test=confirm-button]';
    this.tokenOne = '[data-test="chips-1-button"]';
    this.tokenFive = '[data-test="chips-5-button"]';
    this.tokenTen = '[data-test="chips-10-button"]';
    this.tokenTwenty = '[data-test="chips-20-button"]';
    this.tokenFifty = '[data-test="chips-50-button"]';
    this.clearStake = '[data-test="clear-button"]';
    this.stake = '[data-test=stake-value]';
    this.chipsContainer = '[data-test="chips-container"] li';
    this.betPausedContainer = '[data-test="bet-suspend"]';
    this.betPausedUpperText = '[data-test="bet-suspend-title"]';
    this.betPausedBottomText = '[data-test="bet-suspend-description"]';
    this.cashOutBtn = '[data-test="cashout-button"]';
    this.betSummary = '[data-test="bet-summary"]';
    this.betSummaryStake = '[data-test="bet-summary-stake"]';
    this.betSummaryStakeAmount = '[data-test="bet-summary-stake-amount"]';
    this.betSummaryLastStake = '[data-test="bet-summary-last-game"]';
    
};

module.exports = BetObjects;
