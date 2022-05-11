const socket = io();

/*
const nick = document.querySelector("#nick");
const userlist = document.querySelector("#userlist");


function handleRoomSubmit(event) {
  event.preventDefault();
  const input = nick.querySelector("input");
  socket.emit("nick", input.value);
  input.value = "";
}

function new_user(id, nick) {
  const li = document.createElement("li");
  const users = document.createElement("span");
  li.id = id;
  users.innerHTML = nick;
  li.appendChild(users);
  return li;
}

socket.addEventListener("alive", (data) => {
  if (data.hasOwnProperty("kill")) {
    console.log(userlist)
    userlist.removeChild(document.getElementById(data.kill));
  } else if (data.hasOwnProperty("add")) {
    userlist.append(new_user(data.add.id, data.add.nick));
  } else if (data.hasOwnProperty("change")) {
    document.getElementById(data.change.id).childNodes[0].innerHTML = data.change.nick;
  }
});

nick.addEventListener("submit", handleRoomSubmit);
*/
/*
const ball_plus = document.getElementById("ball_plus");
const ball_minus = document.getElementById("ball_minus");

ball_plus.addEventListener("click", () => {
  socket.emit("ball_plus");
});
ball_minus.addEventListener("click", () => {
  socket.emit("ball_minus");
});
*/

// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');



// NET
const net = {
  x : (canvas.width - 2)/2,
  y : 0,
  height : 10,
  width : 2,
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2,true);
  ctx.closePath();
  ctx.fill();
}

// draw the net
function drawNet(){
  for(let i = 0; i <= canvas.height; i+=15){
      drawRect(net.x, net.y + i, net.width, net.height, "YELLOW");
  }
}

// draw text
function drawText(text,x,y){
  ctx.fillStyle = "#000";
  ctx.font = "85px";
  ctx.fillText(text, x, y);
}

let score_mem = [0, 0];
let pos_mem = [0, 0, 0, 0];
let ball_mem = [0, 0];

socket.addEventListener("gameData", (data) => {
  if (data.hasOwnProperty("s")) {
    score_mem = data.s;
  }
  if (data.hasOwnProperty("u")) {
    pos_mem = data.u;
  }
  if (data.hasOwnProperty("b")) {
    ball_mem = data.b;
  }
  let score = data.s ? data.s : score_mem;
  let pos = data.u ? data.u : pos_mem;
  let ball = data.b ? data.b : ball_mem;
  // clear the canvas
  drawRect(0, 0, canvas.width, canvas.height, "#fff");
  
  // draw the user score to the left
  drawText(score[0],canvas.width/4,canvas.height/5);
  
  // draw the COM score to the right
  drawText(score[1],3*canvas.width/4,canvas.height/5);
  
  // draw the net
  drawNet();
  
  // draw the user's paddle
  drawRect(pos[0], pos[1], 10, 100, "BLUE");
  
  // draw the COM's paddle
  drawRect(pos[2], pos[3], 10, 100, "RED");
  
  // draw the ball
  drawArc(ball[0], ball[1], 10, "GREEN");
});



socket.addEventListener("p1", (data) => {
  console.log("p1");
  // listening to the mouse

  function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    let pos = evt.clientY - rect.top;
    socket.emit("p1", {
      p: pos
    });
  }
  canvas.addEventListener("mousemove", getMousePos);
});
socket.addEventListener("p2", (data) => {
  console.log("p2");
  // listening to the mouse
  function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    let pos = evt.clientY - rect.top;
    socket.emit("p2", {
      p: pos
    });
  }
  canvas.addEventListener("mousemove", getMousePos);
});


window.onload = () => {
  /*
  socket.emit("alive");
  fetch('alive')
  .then((response) => response.json())
  .then((data) => {
    data.forEach(element => {
      userlist.append(new_user(element.id, element.nick));
      console.log(element);
    });
  });
  */

  socket.emit("gameStart", {
    width: canvas.width,
    height: canvas.height
  });
}