
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