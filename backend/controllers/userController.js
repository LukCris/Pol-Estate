const User = require('../models/user.js');
const Post = require('../models/post.js');
const { secret } = require('./config');
const jwt = require('jsonwebtoken');

module.exports = {
  getProfile: async (req, res) => { 

    try {
      console.log("Inizio il controllo del token")
      const token = req.headers["authorization"];
      console.log("Questo è il token: ", token);
      console.log("Controllo che il token non sia nullo")
      if (token===null) return res.sendStatus(401)
      console.log("Verifico il token")
      console.log("Questo è il secret: ", secret)
      const userToken = jwt.verify(token, secret);
      console.log("Cerco l'utente nel DB")
      const userFound = await User.findOne({username: userToken.username});
      console.log("userFound di getUser: ", userFound)
      if(userFound)
        res.json(userFound)
      else res.sendStatus(403);
      } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Non è stato possibile trovare l'utente" });
    }
  },

  findUserByPost: async (req,res) => { 
    try{ 

      console.log("Inizio il controllo del token")
      const token = req.headers["authorization"];
      console.log("Questo è il token: ", token);

      console.log("Controllo che il token non sia nullo")
      if (token===null) return res.sendStatus(401)

      console.log("Verifico il token")
      console.log("Questo è il secret: ", secret)
      const userToken = jwt.verify(token, secret);

      console.log("Cerco l'utente nel DB tramite il token")
      const userFound = await User.findOne({username: userToken.username});
      console.log("Questo è l'utente associato al token: ", userFound);

      // Controllo che l'utente sia stato trovato
      if(userFound){

        console.log("Cerco il post nel DB"); 
        const post=  await Post.findOne({_id: req.body.id}); 

        // Controllo che il post sia stato trovato
        if(post){

          console.log("Cerco l'utente che ha pubblicato il post")
          const user = await User.findOne({_id: post.user})
          console.log("Questo è l'utente trovato: ", user);

          // Controllo che l'utente sia stato trovato e che non corrisponda all'utente loggato
          if(user && user._id.toString() !== userFound._id.toString()){

            // Se non corrispondono allora restituisco l'username dell'utente
            res.status(200).json(user.username); 

          } else if (user._id.toString() === userFound._id.toString()) {

            // Se corrisponde all'utente loggato allora restituisco un messaggio
            res.json("Stai aprendo una chat con te stesso")

          } else res.status(404).json({ message: "Utente non trovato" });

        } else res.status(404).json({ message: "Post non trovato" });

      } else res.sendStatus(403);

    }catch(e){
      console.log(e);
      res.status(500).json({ message: "Non è stato possibile trovare l'utente" });
    }
  },

  profilePosts: async (req, res) => {
   
    try {

      console.log("Inizio il controllo del token")
      const token = req.headers["authorization"];

      console.log("Controllo che il token non sia nullo")
      if (token===null) return res.sendStatus(401)

      console.log("Verifico il token")
      const userToken = jwt.verify(token, secret);

      console.log("Cerco l'utente nel DB")
      const userFound = await User.findOne({
        username: userToken.username,
      });
      console.log("Questo è l'utente associato al token: " , userFound)

      // Controllo che l'utente sia stato trovato
      if(userFound){

        // Cerco il post sul db
        const userPosts = await Post.find({
          user: userFound._id
        }); 

        // Non verifico la presenza del post perchè gestita su Profilo.jsx tramite un render condizionale
        
        res.status(200).json(userPosts);
      }
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Non è stato possibile recuperare i post" });
    }
  },

}

