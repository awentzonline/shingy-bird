
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('shingy', 'assets/shingy.png');
    this.load.image('bone', 'assets/bone.png');
    this.load.image('background', 'assets/hellscape.jpg');
    this.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
    this.load.audio('background-music', ['assets/background-music.mp3', 'assets/background-music.ogg']);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
