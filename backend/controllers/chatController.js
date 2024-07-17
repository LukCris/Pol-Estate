const User = require('../models/user.js');
const MessagesList=require("../models/messagesList.js");
const Message = require("../models/messages.js")
const jwt=require("jsonwebtoken");
const {secret} = require("./config.js");

module.exports = {

    getMessagesLists: async (req,res) => { 
        try{ 
            console.log("Inizio ricerca di tutte le chat"); 
            const token=req.headers["authorization"]; 
            
            if(token==null) return res.sendStatus(401); 
        
            const userToken=jwt.verify(token,secret); 
        
            const u=await User.findOne({username: req.params.username}); 
            //verifica che l'username dell'utente loggato sia uguale a quello presente nel db se è così  
            //prende le liste messaggi tra l'utente loggato e gli altri utenti 
            if(userToken.username==u.username){ 
                const list= await MessagesList.find({$or: [{a1: u._id } , {a2: u._id}]}); 
                res.json(list); 
                console.log("Questa è la lista: ", list)
            } else res.sendStatus(403); 
        } catch(e){console.log(e);} 
    },

    getIdByUsername: async (req,res) => { 
    
        try{ 
            console.log("Username in ricerca"); 
            u=await User.findOne({username: req.params.username}) 
            if(u) res.json(u._id); 
        } catch(e){console.log(e);} 
    
    },

    getUsernameContact: async (req,res)=>{ 
        try{ 
            const names=[]; 

            const token=req.headers["authorization"]; 
            console.log("Ricerca username dei contatti") 
        
            if(token==null) return res.sendStatus(401); 
        
            const userToken=jwt.verify(token,secret); 
        
            
            const u=await User.findOne({username: req.params.username}); 
            console.log("Questo è l'utente di getUsernameContact: ", u);

            if(u.username === userToken.username){    
                for(const id of u.contactList){ 
                    // Utenti con cui si è aperto la chat
                    const a = await User.findOne({_id: id}); 
                    if(a) names.push(a.username); //per inserire tale nome nella lista degli utenti con cui hai aperto una chat
                } 
            } else res.sendStatus(403); 
        
            res.json(names); 
        }catch(e){console.log(e);} 
    
    },

    addContact: async (req,res) =>{ 
            
        try{ 
            const token=req.headers["authorization"]; 
            if(token==null) return res.sendStatus(401); 
            const userToken=jwt.verify(token,secret); 
        
            if(userToken.username===req.body.u1){ 
                console.log("Inizio chat"); 
                console.log("Questo è u1: ", req.body.u1)
                console.log("Questo è u2: ", req.body.u2)
                // Utente autenticato
                const u= await User.findOne({username: req.body.u1}) 
                console.log("Questo è u: ", u);
                // Possessore della casa
                const u1= await User.findOne({username: req.body.u2}) 
                
                // Controllo che non ci sia già l'utente nella lista,rendendo id una stringa
                if (!u.contactList.map(id => id.toString()).includes(u1._id.toString())) {
                    // Se non c'è aggiungo i rispettivi id alla lista dei contatti
                    u.contactList.push(u1._id);
                    u1.contactList.push(u._id);

                    // Salvo le modifiche
                    await u.save();
                    await u1.save();
                    
                    //Creo la lista dei messaggi
                    MessagesList.create({a1: u._id, a2: u1._id})
                    .then(r => console.log("Lista messaggi creata: " + r))
                    .catch(e => console.log(e));
    
                    console.log("Utente: " + u + " e : " + u1 + " sono in contatto");
                    res.json("Chat creata con successo");
                } else {
                    // Se esiste già una chat con quell'utente non la creo
                    res.json("Hai già aperto una chat con questo utente!");
                }

            } else res.sendStatus(403); 
        } catch(e){console.log(e);} 
    },

    deleteChat: async (req,res) =>{

        try{ 
            // Controllo il token
            const token=req.headers["authorization"]; 
            if(token==null) return res.sendStatus(401); 
            const userToken=jwt.verify(token,secret); 
            console.log("Cerco l'utente nel DB")
            // Questo è l'utente autenticato
            const userFound = await User.findOne({
                username: userToken.username,
            });
            // Questo è l'altro utente
            const userContact = await User.findOne({username: req.body.username})

            // Elimino la lista dei messaggi
            const messageList = await MessagesList.findOneAndDelete({
                $or: [
                    { a1: userFound._id, a2: userContact._id },
                    { a1: userContact._id, a2: userFound._id }
                ]
            });

            // Elimino il contatto dall'utente loggato
            userFound.contactList = userFound.contactList.filter(e => e._id.toString() !== userContact._id.toString());
            // Elimino il contatto dall'altro utente
            userContact.contactList = userContact.contactList.filter(e => e._id.toString() !== userFound._id.toString());
            // Salvataggio delle modifiche agli utenti
            await userFound.save();
            await userContact.save();
            console.log("Cancelllo i messaggi scambiati")
            // Controllo che sia stata trovata la lista dei messaggi e che ce ne sia almeno uno
            if (messageList && messageList.messages && messageList.messages.length > 0) {
                /*L'operatore $in permette di specificare un array di ID da cancellare, 
                    permettendo a MongoDB di cancellare tutti i documenti corrispondenti.*/
                await Message.deleteMany({
                    _id: { $in: messageList.messages }
                });
                console.log("Tutti i messaggi sono stati cancellati.");
            }
            
            res.status(200).json("Chat eliminata con successo")

        } catch(e){console.log(e);} 
        
    }
   
}


