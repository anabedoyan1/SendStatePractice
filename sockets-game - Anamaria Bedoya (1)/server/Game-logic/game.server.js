//const { axis } = require("../../public/js/modules/controls");
const usersDB = require("../Users");

const playerSpeedBase = 1;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LOOP_PERIOD = 10;
const pacmanPowerUPtime = 20000;
const PACMAN_TIME = 8000;
const USERS_IN_GAME = [];
const STATE = {
    players: [],
    coins: [],
    powerUPs: [],
    pacman: false,
}

let axes = [];

const spawnPlayer = (id, user) => {       
    
    STATE.players.push(
        new Player(
            id,
            user.username,
            user.score,
        Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10,
        Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10
        )
    );

    axes[id] = {
        horizontal: 0,
        vertical:0,
    }             
         
}

class Player 
{
    constructor(id, username, score, x, y) {      
    this.id = id;
    this.username = username;
    this.x = x;
    this.y = y;      
    this.radius = 10;
    this.speed = playerSpeedBase;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);      
    this.score = score;
    this.pacman = false;
    this.eaten = false;
    }

    eat(player) {
        if (!this.eaten) {
            let dx = player.x - this.x;
            let dy = player.y - this.y;
            let rSum = this.radius + player.radius;
    
            return dx * dx + dy * dy <= rSum * rSum;
        }
    }
    isEaten() {
    return this.eaten;
    }


}

class Coin 
{
    constructor(x, y) {
    this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10;
    this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10;
    this.points = 1;
    this.radius = Math.floor(Math.random() * 15) + 5;
    this.taken = false;
    this.booster = false;
    }
    
    take(player) {
    if (!this.taken) {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let rSum = this.radius + player.radius;

        return dx * dx + dy * dy <= rSum * rSum;
    }
    }
    isTaken() {
    return this.taken;
    }    

}

class PowerUP 
{
    constructor()
    {
        this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10;
        this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10;
        this.points = 1;
        this.radius = 5;
        this.taken = false
    }

    take(player) {
        if (!this.taken) {
            let dx = player.x - this.x;
            let dy = player.y - this.y;
            let rSum = this.radius + player.radius;
    
            return dx * dx + dy * dy <= rSum * rSum;
        }
    }
    isTaken() {
    return this.taken;
    }
}

function setAxis(id, axis){
    axes[id] = axis;
}
function spawnCoin() {   
    let limit;
    if(STATE.pacman){
        limit = 1;
    }
    else 
    {
        limit = 3;
    }
    let amount = Math.floor(Math.random() * limit + 1);    
    if(STATE.coins.length <=50){
        for (let i = 0; i < amount; i++) {
            let newCoin = new Coin;
            STATE.coins.push(newCoin);        
        }
    }
    // if(STATE.coins.length <=50){
    //     let newCoin = new Coin;
    //     STATE.coins.push(newCoin);
    // }   
}
function spawnPowerUP() {   
    const pacman = STATE.players.find((player) => player.pacman == true);
    if(STATE.powerUPs.length < 4 && !pacman)
    {
        for (let i = 0; i < 4; i++) {
        let newPowerUP = new PowerUP
        STATE.powerUPs.push(newPowerUP);
        }
    }
    // const pacman = STATE.players.find((player) => player.pacman == true);
    // if(STATE.powerUPs.length < 1 && !pacman){
    //     let newPowerUP = new PowerUP;
    //     STATE.powerUPs.push(newPowerUP);
    // }   
}
const ValidatingPacman = () => 
{
    let pacman = STATE.players.find((player) => player.pacman == true);
    if(!pacman)
    {
        STATE.pacman = false;        
        return null;
    }
    else 
    {
        STATE.pacman = true;
        return pacman;                
    }
}

const PacmanTime = (player) => 
{           
    const normalsize = player.radius;
    if(player.pacman){
        player.radius += 10;
        player.speed += 0.3;        
        setTimeout(function()
        {
            player.pacman = false;
            player.radius = normalsize; 
            player.speed = playerSpeedBase;            
        }, PACMAN_TIME);
    }     
}

const becomeBooster = (pacman) =>
    {
        STATE.coins.forEach((coin) => 
        {
            const originalsize = coin.radius;
            if(pacman)
            {
                coin.booster = true;
                coin.radius = 5;
            }
            else
            {
                coin.radius = originalsize;
                coin.booster = false;
            }
        });
    }

const update = () => {
    if(STATE.players){
        pacman = ValidatingPacman();
        becomeBooster(pacman);
        STATE.players.forEach((player) => {
            let axis = axes[player.id];
            
            if (axis.horizontal > 0 && player.x < CANVAS_WIDTH - player.radius) {
                player.x += player.speed;
            } else if (axis.horizontal < 0 && player.x > 0 + player.radius) {
                player.x -= player.speed;
            }
            if (axis.vertical > 0 && player.y < CANVAS_HEIGHT - player.radius) {
                player.y += player.speed;
            } else if (axis.vertical && player.y > 0 + player.radius) {
                player.y -= player.speed;
            }
        
            STATE.coins = STATE.coins.filter((coin) => {
                if(!coin.take(player)){
                    return coin;
                } 
                else
                {                
                    if(pacman && player.speed == playerSpeedBase && !player.pacman)
                    {
                        player.speed += 0.5;
                        setTimeout(function()
                        {
                            player.speed = playerSpeedBase;
                        }, 500);
                    }
                     
                    else 
                    {
                        player.score += coin.radius;
                    }                                               
                }
            });

            STATE.powerUPs = STATE.powerUPs.filter((powerUP) => {                              
                if(powerUP.take(player) && !pacman){
                    player.pacman = true;  
                    PacmanTime(player);
                }
                else {
                    if(!pacman)
                    return powerUP;
                }  
            }); 
            
            if(pacman)
            {     
                STATE.coins.forEach((coin)=>{ coin.booster = true});
                if(pacman.eat(player) && !player.pacman && !player.eaten)
                {
                    player.eaten = true;
                    pacman.score += Math.floor(player.score/2);
                    player.score -= Math.floor(player.score/2);                    
                }
            }
            else
            {                
                STATE.coins.forEach((coin)=>{ coin.booster = false});
                player.eaten = false;
            }

        });

    }
}

const removePlayer = (id, username) => {
    let user = STATE.players.find((player) => player.username == username);
    if(user)
    {
        usersDB.saveScore(username, user.score);
    }
    STATE.players = STATE.players.filter((player) => player.id != id);         
}

setInterval(update, LOOP_PERIOD);
setInterval(spawnCoin, Math.floor(Math.random() * 2000) + 1000);
setInterval(spawnPowerUP, pacmanPowerUPtime);

module.exports= 
{
    spawnPlayer,
    STATE,
    setAxis,
    removePlayer,
}

