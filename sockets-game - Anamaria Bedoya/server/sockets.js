const { io } = require("./server");
const game = require('./Game-logic/game.server');
const userDB = require('./Users');
let usersOnline = [];

const TIME_STEP = 50;

function userValidation(username){
  //return true;
  let user = userDB.getUser(username);
  let userOnline = usersOnline.find((user) => user.username == username);
  if(!userOnline) 
  {
    usersOnline.push(user);
    return true;
  }
  else {
    return false;
  }
}

//Middleware
io.use((client, next) => {
  let username = client.handshake.query.username;
  console.log("Middleware: validando conexión con", username);
  if(userValidation(username)){
    return next();
  }
  //client.disconnect();
  return next(new Error("authentication error"));
})

io.on("connection", (client) => {
  let username = client.handshake.query.username;
  console.log(`${username} se ha conectado`);  

  let userOnline = usersOnline.find((user) => user.username == username);
  {
    game.spawnPlayer(client.id, userOnline);
  }

  // let user = userDB.getUser(username);  
  // console.log(user);
  // game.spawnPlayer(client.id, user); 
  
  
  client.emit("welcomeMessage", {
    message: "Bienvenido al juego",
    id: client.id,
    state: game.STATE,
  });
  
  client.on("Moving",(axis) => {    
    game.setAxis(client.id, axis);
  });

  client.broadcast.emit("userConnection", {
    message: "Se ha conectado un nuevo usuario",
  });

  //Listeners
  client.on("broadcastEmit", (data, callback) => {
    console.log("Cliente:", data);
    client.broadcast.emit("broadcastEmit", data);
    callback({ message: "El mensaje fue recibido correctamente" });
  });  

  client.on("disconnect", () => {
    console.log(`${username} se ha desconectado`); 
    usersOnline = usersOnline.filter((user) => user.username != username);       
    game.removePlayer(client.id, username);

    client.broadcast.emit("userDisconnection", {
      message: "Se ha desconectado un usuario",
    });
  });
});

setInterval(()=> {
  io.emit("updateState", {state: game.STATE});
}, TIME_STEP);


