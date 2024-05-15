function rectangularCollision({ rectangle1, rectangle2 }) {
    //   return (
    //     player.attackBox.position.x + player.attackBox.width >= ennemy.position.x &&
    //     player.attackBox.position.x <= ennemy.position.x + ennemy.width &&
    //     player.attackBox.position.y + player.attackBox.height >= ennemy.position.y &&
    //     player.attackBox.position.y <= ennemy.position.y + ennemy.height
    //   );
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
  }
  
  function determineWinner() {
    let timeOutMessage = document.querySelector(".text");
    clearTimeout(timerId);
     gameOver = true;
    if (player.health === ennemy.health) {
      timeOutMessage.textContent = "Tie";
    }
    if (player.health < ennemy.health) {
      timeOutMessage.textContent = "Player 2 Win"; 
      let playerDirection =  player.direction === 'left' ? 'Left' : '' ;
      player.health==0 ? player.switchSprite('death' + playerDirection) : '';
    }
    if (player.health > ennemy.health) {
      timeOutMessage.textContent = "Player 1 Win";
      let ennemyDirection =  ennemy.direction === 'left' ? 'Left' : '' ;
      ennemy.health==0 ? ennemy.switchSprite('death' + ennemyDirection) : '';
    }
    timeOutMessage.style.display = "flex";
  }
  
  let timer = 60;
  let timerId;
  let gameOver = false;
  
  function decreaseTimer() {
    if (timer < 0) {
      determineWinner();
    }
  
    if (timer >= 0) {
      timerId = setTimeout(() => {
        decreaseTimer();
      }, 1000);
      document.querySelector(".timer").textContent = timer;
      timer--;
    }
  }