import React, {useEffect,useState} from "react"; 
import Message from "../message/Message" 
import Button from "react-bootstrap/Button" 
import "./messageList.css"
 
export default function MessagesList ({messageList, ContactName, ContactId, socket, username, handleChat, setReload}){ 
 
   const [body,setBody]=useState(""); 
    
   function checkBody(){ 
      return body.length>0; 
   } 

   
   
 
   useEffect(()=>{ 
      document.getElementById("messagesContainer").scrollTop=99999999; 
   })
 
    return( 

      

      <> 
         <div className="chatName"> 
                  <h3> {ContactName} </h3> 
                  <Button className="deleteChatButton" onClick={e =>{
                     const token=document.cookie.split(";") 
                     .find((row) => row.startsWith("token")) 
                     .split("=")[1]; 
                     console.log("Inizio prevent default")
                     e.preventDefault()
                     fetch("http://localhost:8080/api/chats/deleteChat", {
                        method: "post",
                        headers: {
                           "Content-Type": "application/json",
                           'Authorization': token
                     },
                     body: JSON.stringify({
                           username: ContactName
                     })
                     })
                     .then(res=> {
                        if (res.ok) return res.json(); 
                        else throw new Error("Errore di comunicazione")})
                     .then(res=>{
                        window.alert(res); 
                        handleChat()
                        setReload(true)
                        
                                                      
                     })
                     .catch(e=>console.log(e)); 
                  }}>Elimina chat</Button>
         </div> 

         <div className="chatContainer">
            <div id="messagesContainer"> 
               {/* Per la visualizzazione dei messaggi devo passare l'id di tutti gli elementi della lista e l'id del contatto per capire il mittente o il destinatario*/} 
               {messageList.messages && messageList.messages.map(e=> <Message idMessage= {e} Contact={ContactId} ContactName={ContactName} key={e}/>)} 
            </div> 
            
            
            <div className="chatBar"> 
               {/*Form per l'invio del messaggio */} 
               <form className="chatForm" onSubmit={e=> { 
                  e.preventDefault(); 
                  setBody("");                //i valori del emit sarebbero il data
                  socket.emit("SendMessage", {name: username, receiver: ContactId, receiverName: ContactName, body: body, id: messageList._id}); 
                  e.target.insertMessage.value=""; 
               }}> 
                  <textarea type="text" name="insertMessage" classname="bar" onChange={e=> 
                     setBody(e.target.value) 
                  }></textarea> 
                  <Button type="submit" disabled={!checkBody()} className="button">Invia</Button> 
               </form> 
            </div> 
         </div>
         

      </> 
   )       
}