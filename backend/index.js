const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");
const http = require("http");
const router = require("./routes/api.js");
const app = express();
const {Server} = require("socket.io");
const User = require("./models/user")
const Message = require ("./models/messages")
const MessagesList = require("./models/messagesList")
const server = http.createServer(app);

mongoose.connect("mongodb+srv://lcrispino:Poliba@cluster0.ffsveld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const db = mongoose.connection;
db.once("open", () => {
    console.log("Connesso al DB")
});

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());

const io = new Server(server, { 
    cors: { 
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"] 
    } 
}) 

// Chiede a Node di servire i file per la nostra applicazione React
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
 
//Definizione del socket e di tutti gli eventi da catturare, gestire e inviare 
io.on("connection", (socket) => { 
    console.log("Ciao dal socket") 
 
    socket.once("ingresso", (info)=>{ 
        socket.join(info.username); 
        console.log("Utente collegato alla stanza: " + info.username); 
        socket.on("SendMessage", (data)=>{ 
            console.log("Questo è data in SendMessage: " , data)
            console.log("Socket elabora messaggio "); 
            let user; 
            let mex;
            User.findOne({ 
                username: data.name
            }).then(u=>{ 
                console.log(u); 
                user=u; 
                Message.create({ 
                    author: u._id, 
                    receiver: data.receiver, 
                    body: data.body 
                }).then(mes=> { 
                    console.log(mes); 
                    mex=mes; 
                    MessagesList.findOne({_id: data.id}).then(mL=> { 
                        mL.messages.push(mex._id); 
                        mL.save(); 
                        console.log("Prima di inviare risposta"); 
                        console.log("Invio risposta a stanza " + info.username + " e " + data.receiverName) 
                        io.sockets.in(info.username).in(data.receiverName).emit("receiveMessage", {sender: info.username, receiver: data.receiverName, list: mL}); 
                    }).catch(e=>console.log(e)); 
                }); 
            }).catch(e=>console.log(e)); 
        }) 
    }); 
})

//Assegnazione del router all'url /api
app.use("/api", router);
server.listen(8080, ()=>{
    console.log("Server in ascolto")
})

module.exports=io;

