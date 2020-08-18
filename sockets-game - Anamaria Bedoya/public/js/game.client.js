var divPlayers = document.getElementById('divPlayers');
var lblScore = document.getElementById("score");
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var coins = [];
var players = [];
var powerUPs = [];
var pacman = false;

let playerId;


function drawPlayer(player){
    
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  if(pacman && player.pacman)
  {
    ctx.fillStyle = "#FDF91F ";
  }
  else if (pacman && !player.pacman)
  {
    if(!player.eaten)
    ctx.fillStyle = "#2340FF"
    else
    ctx.fillStyle = "#CEDAEC";
  }  
  else
  {
    ctx.fillStyle = player.color;
  }
  ctx.fill();
  ctx.closePath();    
}
function drawCoin(coin) {
  ctx.beginPath();
  ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
  if(coin.booster){
    ctx.fillStyle = "#E12424 ";
  }
  else
  {ctx.fillStyle = "#f5d142";}
  ctx.fill();
  ctx.closePath();  
}

function drawPowerUP(powerUP) {
  ctx.beginPath();
  ctx.arc(powerUP.x, powerUP.y, powerUP.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#6CFF33";
  ctx.fill();
  ctx.closePath();  
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  //player.draw(ctx);
  players.forEach((player) => {    
    drawPlayer(player);       
    if(player.id == playerId){ lblScore.innerHTML = player.score; }      
  });
  coins.forEach((coin)=>{
    drawCoin(coin);
  })
  powerUPs.forEach((powerUP)=>{    
    drawPowerUP(powerUP);
  })  
}

function showScores(){
  divPlayers.innerHTML="";
  let leaderBoards = [...players].sort((a,b) => b.score-a.score);
  leaderBoards.forEach((player)=>{
    divPlayers.innerHTML += '<div>' + player.username + ' | ' + player.score+ '</div>';
  })
}

export function startGame(data){
  console.log(data.message);
  playerId = data.id;
  updateState(data.state);
}

export function updateState(state){
  players = state.players;
  coins = state.coins;
  powerUPs = state.powerUPs; 
  pacman = state.pacman; 
  showScores();
}

setInterval(draw, 10);
//spawnCoin();
