export default class Pong {
  constructor(width, height, player1_paddle = 100, player2_paddle = 100, ball_size = 10, ball_speed = 15) {
    // canvas width and height
    this.width = width;
    this.height = height;
    this.ball_speed = ball_speed;
    // Ball object
    this.ball = {
      x : width / 2,
      y : height / 2,
      radius : ball_size,
      velocityX : 3,
      velocityY : 5,
      speed : this.ball_speed,
    };
    // player1 Paddle
    this.player1 = {
        x : 0, // left side of canvas
        y : (height - 100)/2, // -100 the height of paddle
        width : 10,
        height : player1_paddle,
        score : 0,
    };
    // player2 Paddle
    this.player2 = {
        x : width - 10, // - width of paddle
        y : (height - 100)/2, // -100 the height of paddle
        width : 10,
        height : player2_paddle,
        score : 0,
    };

  }

  resetBall(ball, x, y) {
    // when player2 or player1 scores, we reset the ball
    ball.x = x;
    ball.y = y;
    ball.velocityX = -ball.velocityX;
    ball.speed = this.ball_speed;
  }
  
  ballMove(ball) {
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
  
  }

  ballCollisionCheck(ball, width, height, player1, player2) {
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > height){
        ball.velocityY = -ball.velocityY;
        // TODO: 벽 충돌 에러 확인 필요
    }
    
    // we check if the paddle hit the player1 or the player2 paddle
    let player = (ball.x + ball.radius < width / 2) ? player1 : player2;
    
    // if the ball hits a paddle
    if(this.collisionDetectByPaddle(ball, player)) {
      this.ballCollisionByPaddle(ball, player, this.width);
    }
  }

  collisionDetectByPaddle(ball, paddle) {
    // collision detection
    let p_top = paddle.y;
    let p_bottom = paddle.y + paddle.height;
    let p_left = paddle.x;
    let p_right = paddle.x + paddle.width;
    
    let b_top = ball.y - ball.radius;
    let b_bottom = ball.y + ball.radius;
    let b_left = ball.x - ball.radius;
    let b_right = ball.x + ball.radius;
    
    return p_left < b_right && p_top < b_bottom && p_right > b_left && p_bottom > b_top;
  }
  
  ballCollisionByPaddle(ball, player, width) {
    // we check where the ball hits the paddle
    let collidePoint = (ball.y - (player.y + player.height/2));
    // normalize the value of collidePoint, we need to get numbers between -1 and 1.
    // -player.height/2 < collide Point < player.height/2
    collidePoint = collidePoint / (player.height/2);
    
    // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
    // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
    // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
    // Math.PI/4 = 45degrees
    let angleRad = (Math.PI/4) * collidePoint;
    
    // change the X and Y velocity direction
    let direction = (ball.x + ball.radius < width/2) ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    
    // speed up the ball everytime a paddle hits it.
    ball.speed += 0.1;
  }

  // update function, the function that does all calculations
  update() {
      // change the score of players, if the ball goes to the left "ball.x<0" player2puter win, else if "ball.x > canvas.width" the player1 win
      if ( this.ball.x - this.ball.radius < 0 ){
        this.player2.score++;
        this.resetBall(this.ball, this.width/2, this.height/2);
      } else if ( this.ball.x + this.ball.radius > this.width){
        this.player1.score++;
        this.resetBall(this.ball, this.width/2, this.height/2);
      }
  
      this.ballMove(this.ball);
      
      // player2puter plays for itself, and we must be able to beat it
      this.ballCollisionCheck(this.ball, this.width, this.height, this.player1, this.player2);

  }

  set setPlayer1Pos(y) {
    if (0 <= y && y <= this.height) {
      this.player1.y = y;
    }
  }

  set setPlayer2Pos(y) {
    if (0 <= y && y <= this.height) {
      this.player2.y = y;
    }
  }

  get AI() {
    return [
      this.player1.y + ((this.ball.y - (this.player1.y + this.player1.height/2)))*0.1,
      this.player2.y + ((this.ball.y - (this.player2.y + this.player2.height/2)))*0.1,
    ];
  }
  
  get getScore() {
    let rtn = [this.player1.score, this.player2.score];
    rtn = rtn.map((val) => parseInt(val));
    return rtn;
  }

  get getPaddlesPos() {
    let rtn = [ this.player1.x, this.player1.y, this.player2.x, this.player2.y];
    rtn = rtn.map((val) => parseInt(val));
    return rtn;
  }

  get getBallPos() {
    let rtn = [this.ball.x, this.ball.y];
    rtn = rtn.map((val) => parseInt(val));
    return rtn;
  }
}