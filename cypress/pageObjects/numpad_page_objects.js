const NumpadObjects = function() {
   
    this.numpadWrapper = '[data-test="num-pad-wrapper"]';
    this.numpadBackspace = '[data-test="num-pad-del"]';
    this.numpadRow = '[data-test="num-pad-row"] a';
    this.dotNumpad = '[data-test="num-pad-dot"]';
    this.oneNumpad = '[data-test="num-pad-1"]';
    this.confirmButtonNumpad = '[data-test="auto-cash-out-modal-confirm-button"]';
    this.closeButtonNumpad = '[data-test="auto-cash-out-modal-close-button"]';
    this.multiplier = '[data-test="auto-cash-out-modal-multiplier"]';
};

module.exports = NumpadObjects;
