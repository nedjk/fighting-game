const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// resize canvas
canvas.width = 1024;
canvas.height = 576;

// On utilise avec le context et l'api canvas
// x,y,width,height
// Donner un fond à notre canvas: position 0,0 et le fond prend toute la taille du canvas.
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x:0,
    y:0
  },
  imageSrc: "./img/background.png"
})

const shop = new Sprite({
  position: {
    x:625,
    y:128
  },
  imageSrc: "./img/shop_anim.png",
  scale:2.75,
  numberOfFrames: 6,
})


// Le sprite de notre personnage
const player = new Fighter({
  position: {
    x: 30,
    y: 0,
  },
  velocity: { x: 0, y: 0 },
  offset: {
    x: 215,
    y: 157,
  },
  imageSrc: "img/samurai/Idle.png",
  scale:2.5,
  numberOfFrames: 8,
  frameSpeed: 5,
  sprites:{
    idle:{
      imageSrc: "img/samurai/Idle.png",
      numberOfFrames: 8,
    },
    run:{
      imageSrc: "img/samurai/Run.png",
      numberOfFrames: 8,
    },
    runLeft:{
      imageSrc: "img/samurai/RunLeft.png",
      numberOfFrames: 8,
    },
    jump:{
      imageSrc: "img/samurai/Jump.png",
      numberOfFrames: 2,
    },
    fall:{
      imageSrc: "img/samurai/Fall.png",
      numberOfFrames: 2,
    },
    attack1:{
      imageSrc: "img/samurai/Attack1.png",
      numberOfFrames: 6,
    },
    idleLeft:{
      imageSrc: "img/samurai/IdleLeft.png",
      numberOfFrames: 8,
    },
    jumpLeft:{
      imageSrc: "img/samurai/JumpLeft.png",
      numberOfFrames: 2,
    },
    fallLeft:{
      imageSrc: "img/samurai/FallLeft.png",
      numberOfFrames: 2,
    },
    attack1Left:{
      imageSrc: "img/samurai/Attack1Left.png",
      numberOfFrames: 6,
    },
    takeHit:{
      imageSrc: "img/samurai/TakeHitWhite.png",
      numberOfFrames: 4,
    },
    takeHitLeft:{
      imageSrc: "img/samurai/TakeHitWhiteLeft.png",
      numberOfFrames: 4,
    },
    death:{
      imageSrc: "img/samurai/Death.png",
      numberOfFrames: 6,
    },
    deathLeft:{
      imageSrc: "img/samurai/DeathLeft.png",
      numberOfFrames: 6,
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 155,
    height: 50
  }
});

player.draw();

// Le sprite de l'ennemi
const ennemy = new Fighter({
  position: {
    x: 900,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  color: "blue",
  direction:'left', 
  offset: {
    x: 215,
    y: 170,
  },
  imageSrc: "img/kenji/Idle.png",
  scale:2.5,
  numberOfFrames: 4,
  frameSpeed: 10,
  sprites:{
    idle:{
      imageSrc: "img/kenji/Idle.png",
      numberOfFrames: 4,
    },
    idleLeft:{
      imageSrc: "img/kenji/IdleLeft.png",
      numberOfFrames: 4,
    },
    run:{
      imageSrc: "img/kenji/Run.png",
      numberOfFrames: 8,
    },
    runLeft:{
      imageSrc: "img/kenji/RunLeft.png",
      numberOfFrames: 8,
    },
    jump:{
      imageSrc: "img/kenji/Jump.png",
      numberOfFrames: 2,
    },
    fall:{
      imageSrc: "img/kenji/Fall.png",
      numberOfFrames: 2,
    },
    attack1:{
      imageSrc: "img/kenji/Attack1.png",
      numberOfFrames: 4,
    },
    jumpLeft:{
      imageSrc: "img/kenji/JumpLeft.png",
      numberOfFrames: 2,
    },
    fallLeft:{
      imageSrc: "img/kenji/FallLeft.png",
      numberOfFrames: 2,
    },
    attack1Left:{
      imageSrc: "img/kenji/Attack1Left.png",
      numberOfFrames: 4,
    },
    takeHit:{
      imageSrc: "img/kenji/TakeHitperso.png",
      numberOfFrames: 3,
    },
    takeHitLeft:{
      imageSrc: "img/kenji/TakeHitpersoLeft.png",
      numberOfFrames: 3,
    },
    death:{
      imageSrc: "img/kenji/Death.png",
      numberOfFrames: 7,
    },
    deathLeft:{
      imageSrc: "img/kenji/DeathLeft.png",
      numberOfFrames: 7,
    }
  },
  attackBox: {
    offset: {
      x: -195,
      y: 50
    },
    width: 170,
    height: 50
  }
});
ennemy.draw();

const keys = {
  q: {
    pressed: false,
    direction:'left'
  },
  d: {
    pressed: false,
    direction:'right'
  },
  ArrowRight: {
    pressed: false,
    direction:'right'
  },
  ArrowLeft: {
    pressed: false,
    direction:'left'
  },
};


decreaseTimer();


function animate() {
  window.requestAnimationFrame(animate);
  // Si on ne fais pas fillrect, les rectangles vont s'allonger car on est en mode draw.
  // Là ça donne un effet de chute verticale
  // c.fillStyle = "black";
  // c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  // White overlay on background for contrast
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  ennemy.update();

  player.velocity.x = 0;
  ennemy.velocity.x = 0;



  //   Player movement
  if (keys.q.pressed && player.lastKey === "q") {
    player.switchSprite('runLeft')
    if (player.position.x>0) {
      player.velocity.x = -5;
    }
  }
  else if (keys.d.pressed && player.lastKey === "d") {
    player.switchSprite('run')
    if (player.position.x + player.width < canvas.width - 20) {
      player.velocity.x = 5;
    }

  }else{
      // Default animation
      let directionImage = player.direction=='left' ? 'Left' : '';
      const nameImage= 'idle' 
      let fullnameImage= nameImage + directionImage
    player.switchSprite(fullnameImage)
  }

  // Si on saute
  if (player.velocity.y< 0) {
    let directionImage = player.direction=='left' ? 'Left' : '';
    const nameImage= 'jump' 
    let fullnameImage= nameImage + directionImage
    player.switchSprite(fullnameImage)
  }

  // La chute après le saut
  if (player.velocity.y> 0) {
    let directionImage = player.direction=='left' ? 'Left' : '';
    const nameImage= 'fall' 
    let fullnameImage= nameImage + directionImage
    player.switchSprite(fullnameImage)
  }




  //   Enemy movement
  if (keys.ArrowRight.pressed && ennemy.lastKey === "ArrowRight") {
    ennemy.switchSprite('run')
    if (ennemy.position.x + ennemy.width < canvas.width-20) {
      ennemy.velocity.x = 5;
    }
  }
  else if (keys.ArrowLeft.pressed && ennemy.lastKey === "ArrowLeft") {
    ennemy.switchSprite('runLeft')
    if (ennemy.position.x>0) {
      ennemy.velocity.x = -5;
    }

  }else{
    let directionImage = ennemy.direction=='left' ? 'Left' : '';
    const nameImage= 'idle' 
    let fullnameImage= nameImage + directionImage
    ennemy.switchSprite(fullnameImage)
  }

  if (ennemy.velocity.y < 0) {
    let directionImage = ennemy.direction=='left' ? 'Left' : '';
    const nameImage= 'jump' 
    let fullnameImage= nameImage + directionImage
    ennemy.switchSprite(fullnameImage)
  }

  if (ennemy.velocity.y > 0) {
    let directionImage = ennemy.direction=='left' ? 'Left' : '';
    const nameImage= 'fall' 
    let fullnameImage= nameImage + directionImage
    ennemy.switchSprite(fullnameImage)
  }



  //   Detect for collision player attacking and ennemy take hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: ennemy }) &&
    player.isAttacking && player.currentFrame === 4
  ) {
    // Pour que l'on attaque qu'une seule fois
    player.isAttacking = false;
    if (!gameOver && player.canAttack) {
      ennemy.takeHit()
      document.querySelector("#enemyCurrentHealth").style.width =
        ennemy.health + "%";

        // Pour ne pas attaquer en  boucle sur la meme frame

        player.canAttack=false
        setTimeout(() => {
        player.canAttack = true;
    }, 75);
    }
  }

// Detect if player misses

if(player.isAttacking && player.currentFrame === 4){
  player.isAttacking = false;
}

  
  //   Detect for collision ennemy attacking
  if (
    rectangularCollision({ rectangle1: ennemy, rectangle2: player }) &&
    ennemy.isAttacking && ennemy.currentFrame === 2
  ) {
    // Pour que l'on attaque qu'une seule fois
      ennemy.isAttacking = false;

    if (!gameOver && ennemy.canAttack) {
      player.takeHit()
      document.querySelector("#playerCurrentHealth").style.width =
        player.health + "%";

        // Pour ne pas attaquer en  boucle sur la meme frame
        ennemy.canAttack=false
        setTimeout(() => {
      ennemy.canAttack = true;
    }, 75);
    }
  }

  // Detect if ennemy misses

if(ennemy.isAttacking && ennemy.currentFrame === 2){
  ennemy.isAttacking = false;
}


  // Health zero
  if (player.health == 0 || ennemy.health == 0) {
    determineWinner();
  }
}

animate();

window.addEventListener("keydown", (event) => {


  //  Player controls
if(!player.dead){
  
  if (event.key == "d") {
    keys.d.pressed = true;
    if (!player.isAttacking) {
      player.direction= keys.d.direction;
      player.attackBox.offset.x= 100
    }

    player.lastKey = "d";
  }

  if (event.key == "q") {
    keys.q.pressed = true;
    if (!player.isAttacking) {
      player.direction = keys.q.direction;
      player.attackBox.offset.x= -130 - player.width;
    }

    player.lastKey = "q";
  }

  if (event.key == " ") {
    player.attack();
  }
  if (event.key == "z" && player.position.y + player.height >= canvas.height-96) {
    player.velocity.y = -20;
  }

}


  //  Ennemy controls
if(!ennemy.dead){
  if (event.key == "ArrowRight") {
    keys.ArrowRight.pressed = true;
    if (!ennemy.isAttacking) {
      ennemy.direction= keys.ArrowRight.direction;
      ennemy.attackBox.offset.x= 145 - ennemy.width
    }
    ennemy.lastKey = "ArrowRight";
  }

  if (event.key == "ArrowLeft") {
    keys.ArrowLeft.pressed = true;
    if (!ennemy.isAttacking) {
      ennemy.direction= keys.ArrowLeft.direction;
      ennemy.attackBox.offset.x= -195
    }
    ennemy.lastKey = "ArrowLeft";
  }
  if (event.key == "ArrowDown") {
    ennemy.attack();
  }
  if (event.key == "ArrowUp" && ennemy.position.y + ennemy.height >= canvas.height -96) {
    ennemy.velocity.y = -20;
  }
}

});

window.addEventListener("keyup", (event) => {
  //  Controles du joueur
  if (event.key == "d") {
    keys.d.pressed = false;
  }

  if (event.key == "q") {
    keys.q.pressed = false;
  }

  //  Controles de l'ennemi
  if (event.key == "ArrowRight") {
    keys.ArrowRight.pressed = false;
  }

  if (event.key == "ArrowLeft") {
    keys.ArrowLeft.pressed = false;
  }
});
