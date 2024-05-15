// Gestion générale des Sprites du jeu
// Dans chaque jeu, les sprites on une position
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    numberOfFrames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.numberOfFrames = numberOfFrames;
    this.currentFrame = 0;
    this.framesPlayed = 0;
    this.frameSpeed = 8;
    this.offset = offset;
    this.dead= false
  }

  // A quoi ressemble le sprite

  draw() {
    c.drawImage(
      this.image,
      // Récupérer une seule image de l'animation
      this.currentFrame * (this.image.width / this.numberOfFrames),
      0,
      this.image.width / this.numberOfFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.numberOfFrames) * this.scale,
      this.image.height * this.scale
    );
    // Attack box
    // if (this.isAttacking) {
    //   c.fillStyle = "green";
    //   c.fillRect(
    //     this.attackBox.position.x,
    //     this.attackBox.position.y,
    //     this.attackBox.width,
    //     this.attackBox.height
    //   );
    // }
  }


  animateFrames() {

      this.framesPlayed++;

      if (this.framesPlayed % this.frameSpeed === 0) {
        if (this.currentFrame < this.numberOfFrames - 1) {
          this.currentFrame++;
        } else {
          this.currentFrame = 0;
        }
      }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    direction = "right",
    position,
    velocity,
    color = "red",
    canAttack = true,
    imageSrc,
    scale = 1,
    numberOfFrames = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      numberOfFrames,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.canAttack = canAttack,
    this.color = color;
    this.direction = direction;
    this.isAttacking;
    this.health = 100;
    this.currentFrame = 0;
    this.framesPlayed = 0;
    this.frameSpeed = 5;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    if(!this.dead) {
      this.animateFrames();
    }
    // Offset permet de changer pour l'ennemi la position de l'attaque
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;


    // Draw the attack box
      // c.fillStyle='black'

      //     c.fillRect(
      //   this.attackBox.position.x,
      //   this.attackBox.position.y,
      //   this.attackBox.width,
      //   this.attackBox.height
      // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      // Pour arreter l'animation de chute avant de toucher le sol
      // et ne pas faire buger la transistion en les animation
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    let directionImage = this.direction == "left" ? "Left" : "";
    this.switchSprite("attack1" + directionImage);
    this.isAttacking = true;
    // Enlève setTimeOut car arrete attaque avant la bonne frame
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 250);
  }

  takeHit(){
    this.health -= 10;
    let directionImage = this.direction =='left' ? 'Left' : '';
    this.switchSprite('takeHit' + directionImage)
  }

  //   switchSprite(arg){
  //     this.image = this.sprites[arg].image
  //     this.framesMax = this.sprites[arg].framesMax
  //     this.framesCurrent = 0
  //  }
  switchSprite(sprite) {
    // Si l'animation est déjà entrain d'etre jouée
    // Et si la frame en cours est inférieure au nombres de frames de l'animations
    // Si l'animation de l'attaque n'est pas finie on ne peux pas changer

    // Overriding all other animations with the death animation
    if (
      (this.image === this.sprites.death.image) ||
      (this.image === this.sprites.deathLeft.image)
    ){
      if(this.currentFrame === this.sprites.death.numberOfFrames - 1){
        this.dead=true
      }

      return;
    }

    // Overriding all other animations with the takeHit animation
    if (
      (this.image === this.sprites.takeHit.image &&
        this.currentFrame < this.sprites.takeHit.numberOfFrames - 1) ||
      (this.image === this.sprites.takeHitLeft.image &&
        this.currentFrame < this.sprites.takeHitLeft.numberOfFrames - 1)
    )
      return;

    // Overriding all other animations with the attack animation
    if (
      (this.image === this.sprites.attack1.image &&
        this.currentFrame < this.sprites.attack1.numberOfFrames - 1) ||
      (this.image === this.sprites.attack1Left.image &&
        this.currentFrame < this.sprites.attack1Left.numberOfFrames - 1)
    )
      return;

    if (sprite == "idle") {
      if (this.image !== this.sprites.idle.image) {
        this.image = this.sprites.idle.image;
        this.numberOfFrames = this.sprites.idle.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "idleLeft") {
      if (this.image !== this.sprites.idleLeft.image) {
        this.image = this.sprites.idleLeft.image;
        this.numberOfFrames = this.sprites.idleLeft.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "run") {
      if (this.image !== this.sprites.run.image && this.velocity.y === 0) {
        {
          this.image = this.sprites.run.image;
          this.numberOfFrames = this.sprites.run.numberOfFrames;
          this.currentFrame = 0;
        }
      }
    }
    if (sprite == "runLeft") {
      if (this.image !== this.sprites.runLeft.image && this.velocity.y === 0) {
        {
          this.image = this.sprites.runLeft.image;
          this.numberOfFrames = this.sprites.runLeft.numberOfFrames;
          this.currentFrame = 0;
        }
      }
    }
    if (sprite == "jump") {
      if (this.image !== this.sprites.jump.image) {
        this.image = this.sprites.jump.image;
        this.numberOfFrames = this.sprites.jump.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "jumpLeft") {
      if (this.image !== this.sprites.jumpLeft.image) {
        this.image = this.sprites.jumpLeft.image;
        this.numberOfFrames = this.sprites.jumpLeft.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "fall") {
      if (this.image !== this.sprites.fall.image) {
        this.image = this.sprites.fall.image;
        this.numberOfFrames = this.sprites.fall.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "fallLeft") {
      if (this.image !== this.sprites.fallLeft.image) {
        this.image = this.sprites.fallLeft.image;
        this.numberOfFrames = this.sprites.fallLeft.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "attack1") {
      if (this.image !== this.sprites.attack1.image) {
        this.image = this.sprites.attack1.image;
        this.numberOfFrames = this.sprites.attack1.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "attack1Left") {
      if (this.image !== this.sprites.attack1Left.image) {
        this.image = this.sprites.attack1Left.image;
        this.numberOfFrames = this.sprites.attack1Left.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "death") {
      if (this.image !== this.sprites.death.image) {
        this.image = this.sprites.death.image;
        this.numberOfFrames = this.sprites.death.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "deathLeft") {
      if (this.image !== this.sprites.deathLeft.image) {
        this.image = this.sprites.deathLeft.image;
        this.numberOfFrames = this.sprites.deathLeft.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "takeHit") {
      if (this.image !== this.sprites.takeHit.image) {
        this.image = this.sprites.takeHit.image;
        this.numberOfFrames = this.sprites.takeHit.numberOfFrames;
        this.currentFrame = 0;
      }
    }
    if (sprite == "takeHitLeft") {
      if (this.image !== this.sprites.takeHitLeft.image) {
        this.image = this.sprites.takeHitLeft.image;
        this.numberOfFrames = this.sprites.takeHitLeft.numberOfFrames;
        this.currentFrame = 0;
      }
    }
  }

  // A quoi ressemble le sprite
  //   draw() {
  //     c.fillStyle = this.color;
  //     c.fillRect(this.position.x, this.position.y, this.width, this.height);

  //     // Attack box
  //     if (this.isAttacking) {
  //       c.fillStyle = "green";
  //       c.fillRect(
  //         this.attackBox.position.x,
  //         this.attackBox.position.y,
  //         this.attackBox.width,
  //         this.attackBox.height
  //       );
  //     }
  //   }
}
