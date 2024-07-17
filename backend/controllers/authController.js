const bcrypt = require('bcrypt');
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { secret } = require('./config');

module.exports = {

  register: async (req,res) => { 
    try{ 
      console.log("Inizio registrazione") 
      const u=await User.findOne({username: req.body.username}); 
      const u1=await User.findOne({email: req.body.email}); 
      //Verifico che non ci siano altri utenti con le stesse credenziali
      if(u===null && u1===null) 
      { 
          console.log("Inserimento possibile"); 
          const user= { username: req.body.username, email: req.body.email, password: req.body.password} 
          const pass=await bcrypt.genSalt(10); //genera un salt che verrà aggiunto alla pw prima di fare l'hash
          const passc=await bcrypt.hash(user.password,pass); 
          const createUser=await User.create({username: user.username, email:user.email, password: passc}); 
          console.log("Registrazione completata"); 
          const token=jwt.sign({username: createUser.username, email: createUser.email, password: createUser.password}, secret, {expiresIn: "6000s"}); 
          
          res.json({token: token, username: createUser.username}); 
      } 
      else{   
        console.log ("Utente gia esistente"),
        res.json("Utente gia esistente"); 
      }    
    }catch(e){ 
      console.log(e); 
    } 
  },

  login: async (req,res)=>{ 
    try{ 
      console.log("Inizio accesso"); 
      const user=await User.findOne({email: req.body.email}); 
      //Controllo che le credenziali siano corrette
      if(user){ 

        const a=await bcrypt.compare(req.body.password, user.password); 
        console.log(a); 

        if(a){ 

          console.log("Utente trovato"); 
          console.log(user); 
          const token=jwt.sign({
            username: user.username, 
            email: user.email, 
            password: user.password}, secret, {expiresIn: "6000s"});
          res.json({token: token, username: user.username}); 
      
        } else res.json("Credenziali non valide"); 

      }else{
        res.json("Credenziali non valide"); 
        console.log("fine accesso"); 
      }

    }catch(e){console.log(e);} 
  },

  findUsernameByToken: async (req,res)=> { 
    try{ 
      const token = req.headers["authorization"]; 
      console.log(req.headers["authorization"])
      console.log(token)
      if(token==null) return res.sendStatus(401); 
      const userToken=jwt.verify(token,secret); 
      return res.json(userToken.username); 
    }catch(e){ 
      console.log(e); 
    } 
  }
}