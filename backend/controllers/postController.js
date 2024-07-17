const Post = require('../models/post.js');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const {secret} = require("./config.js");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      // Recupero sul db tutti i post e li restituisco
      const posts = await Post.find({});
      res.status(200).json(posts)
    } catch (err) {
      res.status(500).json({msg: "Errore di caricamento", err: err});
    }
  },

  addPost: async (req, res) => {
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
      console.log(userFound)

      // Controllo che l'utente sia stato trovato
      if(userFound){

        console.log("Creo il post nel DB")
        const newPost = await Post.create({
        title: req.body.title,
        price: req.body.price,
        address: req.body.address,
        description: req.body.description,
        city: req.body.city,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        type: req.body.type,
        property: req.body.property,
        size: req.body.size,
        images: req.body.images,
        user: userFound._id
        });

        console.log("Ho creato il post nel DB e lo inserisco nell'utente");
        userFound.posts.push(newPost._id)
        
        // Salvo le modifiche fatte
        await userFound.save()

        res.json({msg: "Post creato con successo", posts: newPost});

      } else res.sendStatus(403)

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Non è stato possibile aggiungere il post" });
    }
  },

  getPostById: async (req, res) => {
    try {

      console.log("Cerco il post nel DB")
      const post = await Post.findOne({
        _id: req.params.id
      });

      console.log("Questo è il post trovato", post)

      // Controllo che il post sia stato trovato
      if (post) res.json(post);
      else res.status(404).json({ message: "Post non trovato" });

    } catch (err) {
      res.status(500).json({ msg: "Errore nel recupero del post", err: err });
    }
  },

  deletePost: async (req, res) => {
    try {

      id = req.body.id;

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
      console.log("Questo è l'utente associato al token: ", userFound)

      // Controllo che l'utente sia stato trovato
      if(userFound){

        console.log("Rimuovo il post nel DB");
        await Post.findByIdAndDelete({_id: id});

        console.log("Rimuovo il post dall'utente")
        userFound.posts = userFound.posts.filter(e => e._id.toString() !== id);
        console.log("Ho rimosso il post dall'utente")

        //Salvo le modifiche
        await userFound.save();

        res.status(200).json("Post cancellato con successo");

      } else res.sendStatus(403)

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Non è stato possibile rimuovere il post" });
    }
  },

  findPost: async (req, res) => {
    try {
      
      console.log("Cerco i post nel db")
      const post = await Post.find({
        city: req.body.city,
        type: req.body.type,
        property: req.body.property
      });
      
      // Controllo che il post sia stato trovato
      if (post) {
        console.log("Restituisco i post")
        res.status(200).json(post)
      } else res.json("Post non trovato");
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Post non trovato"});
    }
  }
}

