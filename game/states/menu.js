
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.background = this.game.add.sprite(0, 0, 'background');
      
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.titleText = this.game.add.text(this.game.world.centerX, this.game.height * 0.2, 'Shingybird', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(
      this.game.world.centerX, this.game.height * 0.6,
      'AOL sent super-hacker futurist Shingy\n15 years into the future for business ideas.\nWhat he saw was maddening.\nClick to gain altitude.\nGet big points for flying high!\nDon\'t mess up your hair on the bones or fall into the pit!',
      { font: '26px Arial', fill: '#ffffff', align: 'center'}
    );
    this.instructionsText.anchor.setTo(0.5, 0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;
