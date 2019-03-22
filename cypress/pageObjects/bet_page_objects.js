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
    this.betPausedUpperText = '#root > main > section.sc-fjdhpX.fCEyoV > section.sc-jzJRlG.krDPzq > div > div > div.sc-jDwBTQ.hhVIim.sc-iwsKbI.iuaTZF > p.sc-bwzfXH.kUufAs';
    this.betPausedBottomText = '#root > main > section.sc-fjdhpX.fCEyoV > section.sc-jzJRlG.krDPzq > div > div > div.sc-jDwBTQ.hhVIim.sc-iwsKbI.iuaTZF > p.sc-bwzfXH.fwDhTb';
};

module.exports = BetObjects;
