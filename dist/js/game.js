(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 400, Phaser.AUTO, 'shingy');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

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

},{}],4:[function(require,module,exports){

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
    var backgroundMusic = this.game.add.audio('background-music', 1.0, true);
    backgroundMusic.play();
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.background = this.game.add.sprite(0, 0, 'background');
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(0, 0, 'shingy');
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.acceleration.y = 400;
      this.sprite.body.setSize(125, this.sprite.height, 125, 40);
      this.boneGroup = this.game.add.group();
      this.boneGroup.enableBody = true;
      this.boneGroup.createMultiple(10, 'bone');
      this.boneCountdown = 0;
      var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      spaceKey.onDown.add(this.jump, this);
      this.game.input.onDown.add(this.jump, this);

      this.score = 0;
      this.scoreText = this.game.add.bitmapText(
        this.game.width * 0.6, this.game.height * 0.8, 'font', '0', 64
      );
    },
    update: function() {
      this.boneGroup.forEachAlive(function (bone) {
        if (bone.x <= -bone.width) {
          bone.kill();
        }
      });
      this.boneCountdown -= this.game.time.elapsed;
      if (this.boneCountdown <= 0) {
        this.addObstacle();
        this.boneCountdown = 1000;
      }
      this.game.physics.arcade.overlap(this.sprite, this.boneGroup, this.onDied.bind(this, 'hair'), null);
      if (this.sprite.y > this.game.height * 1.1) {
        this.onDied('pit');
      } else if (this.sprite.y < -this.sprite.height) {
        this.onDied('hair');
      }
      var heightRatio = 1 - this.sprite.y / this.game.height;
      this.score += heightRatio * heightRatio * 10000 * this.game.time.elapsed / 1000;
      this.updateScoreText();
    },
    updateScoreText: function () {
      this.scoreText.text = this.score.toFixed(0);
    },
    // render: function() {
    //   this.game.debug.body(this.sprite);
    //   this.game.debug.body(this.boneGroup);
    // },
    jump: function () {
      this.sprite.body.velocity.y -= 250;
    },
    onDied: function (reason) {
      this.game.state.start('gameover', true, false, this.score, reason);
    },
    addObstacle: function () {
      var bone = this.boneGroup.getFirstDead();
      bone.reset(this.game.width, -Math.random() * 300 - 250);
      bone.body.velocity.x = -200;
    }
  };
  
  module.exports = Play;
},{}],6:[function(require,module,exports){

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

},{}]},{},[1]);
