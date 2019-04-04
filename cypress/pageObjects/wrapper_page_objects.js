const WrapperObjects = function ()  {
    this.languageDropdownMenuContainer = 'body > div.header > div.col.right > div > div.language-container';
    this.languageDropdownMenu = '#languageSelection';
    this.englishLanguageOption = '#languageSelection > option:nth-child(1)';
    this.portugueseLanguageOption = '#languageSelection > option:nth-child(2)';
    this.gameTime = '#localTime';
    this.rushButton = '#gameList > div';
    this.playTime = '#duration';
    this.clockIcon = '#timeContainer > div:nth-child(1) > img';
    this.time = '#localTime';
    this.buzzBrand = 'body > div.header > div.col.middle > img';
    this.googleSignInButton = '#googleSignIn';
    this.googleButtonText = '#googleSignIn > div > div > span';
};

module.exports = WrapperObjects;