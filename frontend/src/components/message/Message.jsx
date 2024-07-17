import React,{useState,useEffect} from "react";
import "./message.css"
 
export default function Message ({idMessage, Contact, ContactName}){ 

    console.log("Questo è contact: ", Contact, ContactName)

    console.log("Questo è l'idMessage", idMessage)

    const[message,setMessage]=useState({body: null}); 
    const [hour,setHour]=useState(); 
    const [day,setDay]=useState({year: 0, month: 0, day: 0}); 
 
 
    function insertHour(d){ 
        const dat=new Date(d); 
        setHour(dat.getHours()+":"+dat.getMinutes()); 
    } 
 
    function insertDay(d){ 
        const dat=new Date(d); 
        const giorno={year: dat.getFullYear(), month: dat.getMonth(), day: dat.getDate()}; 
        setDay(giorno); 
    } 
 
    /* Prelevo il messaggio usando l'id in maniera tale da poter sapere ora e contenuto */ 
    useEffect(()=>{ 
        fetch("http://localhost:8080/api/messages/getMessageById/" + idMessage) 
        .then(res=>{
            if(res.ok) return res.json(); 
            else throw new Error("Errore di comunicazione")
        }) 
        .then(res=>{
            insertDay(res.date); 
            insertHour(res.date); 
            setMessage(res)
        })
        .catch(e=>console.log(e)); 
    },[])  
 
    return ( 
        <div className="wrapper"> 
            {message.author !== Contact ?  
            <div className="me"> 
                <div className="myMessageContainer"> 
                    <p className="myMessageName"><strong>Tu</strong></p>
                    <div className="messageContainer">
                        <span className="myMessage"> {message.body} </span> 
                    </div>
                    <div className="messageHour">
                        <span className="myHour">{day.day}/{day.month}/{day.year} {hour}</span>
                    </div>
                    
                </div> 
            </div> 
            :  
            <div className="other"> 
                <div className="otherMessageContainer"> 
                    <p className="otherMessageName"><strong>{ContactName}</strong></p>
                    <div className="messageContainer">
                        <span className="otherMessage"> {message.body} </span>
                    </div>
                    <div className="messageHour">
                        <span className="otherHour"> {day.day}/{day.month}/{day.year} {hour}</span> 
                    </div>
                    
                </div> 
            </div> 
            }        
        </div>      
    ) 
}