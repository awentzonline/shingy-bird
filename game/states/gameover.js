
'use strict';
function GameOver() {}

GameOver.prototype = {
  init: function (finalScore, deathReason) {
    this.finalScore = finalScore;
    this.deathReason = deathReason;
  },
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    var loseText;
    switch (this.deathReason) {
      case 'hair':
        loseText = 'You messed up your hair on those bones!';
        break;
      case 'pit':
        loseText = 'You fell in the pit!';
        break;
    }
    loseText += '\n' + parseInt(this.finalScore) + ' points';
    this.congratsText = this.game.add.text(this.game.world.centerX, 200, loseText, { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
