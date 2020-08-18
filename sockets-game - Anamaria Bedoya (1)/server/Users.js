const fs = require("fs");

let users = [];
let initScore = 0;

const loadUserDB = () => {
  try {
    users = require("./Data_Base/Users.json");
  } catch (error) {
    users = [];
  }
};

loadUserDB();

const getUser = (username) => {
  let user = users.find((user) => user.username == username);
  if (!user) {
    console.log("Añadiendo nuevo usuario: " + username);
    user = addUser(username);
    return user;
  } else {
    console.log("El usuario ya existe.");
    return user;
  }
};

const saveUsersBD = () => {    
  let data = JSON.stringify(users);
  fs.writeFileSync("server/Data_Base/users.json", data, (err) => {
    if (err) return console.log(err);
    console.log('Usuario guardado exitosamente');
  });  
}

const addUser = (username) => {  
  let newUser = {   
    username,
    score: initScore,
  }; 
  
  users.push(newUser);  
  saveUsersBD();
  return newUser;
}

const saveScore = (userName, score) => {
  const user = users.find((user) => user.username == userName);
  if(user){
    //console.log("Usuario para actualizar puntaje: " + user.username);
    user.score = score;
    saveUsersBD();
  }
  else 
  {
    console.log("No se pudo actualizar puntaje. Este usuario no existe");
  }
  
};



module.exports = {
  users,
  getUser,
  saveScore,
}

