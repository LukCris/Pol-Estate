import React, {useState, useEffect} from "react";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom"
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MessagesList from "../../components/messageList/MessagesList";
import ContactList from "../../components/contactList/ContactList";
import Card from "../../components/card/Card";
import "./profilo.css"

export default function Profilo ({loggedUser, socket, handleUser})
{
    
    socket.emit("ingresso", {username: loggedUser}); 
 
    /*Comando per prelevare dal cookie il token */ 
    const token=document.cookie.split("; ") 
    .find((row) => row.startsWith("token")) 
    .split("=")[1]; 

    const navigate = useNavigate();

    /*Variabile di stato utilizzata per permettere il rendering di UsersList ogni qual volta viene ricevuto un messaggio*/ 
    const [update, setUpdate]=useState(false); 

    const [messagesLists,setMessagesLists]=useState([{_id: "", messages: []}]); 
    const [selectedUserId,setSelectedUserId]=useState(null); 
    const [selectedUserName, setSelectedUserName]=useState(null); 
    const [currentList,setCurrentList]=useState(null); 

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    // Per la gestione del rendering dei contatti
    const [reloadChat, setReloadChat] = useState(false)

    // Variabile usata in Card per mostrare o meno il bottone per cancellare i post
    const prof = true;
 
    function changeUpdate(){ 
        if(update) setUpdate(false); 
        else setUpdate(true); 
    } 

    // handler per la chiusura della chat in caso di cancellazione
    function handleChatClosure() {
        // Imposta currentList su null per nascondere MessagesList
        setCurrentList(null);  
    }

    /* Usata per ottenere tutte le liste dei messaggi che comprendono loggedUser(username) */ 
    useEffect(()=>{ 
        let v=[];        
 
        fetch("http://localhost:8080/api/chats/getMessagesList/" + loggedUser, { 
            method: "get", 
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": token 
            } 
        }).then(res=> {if (res.ok) return res.json(); else throw new Error ("Errore di comunicazione")}) 
        .then(res=>{  
            v=res;  
            setMessagesLists(res);  
        }).catch(e=> console.log(e)); 
        
        socket.on("receiveMessage", (data)=>{ 
            console.log("Socket ha ricevuto il messaggio: " + data); 
            changeUpdate(); 
            if(selectedUserName===data.sender || selectedUserName===data.receiver) 
            setCurrentList(data.list); 
            else{ // trova la lista dei messaggi esistente
                v.find(e=> e._id===data.list._id).messages=data.list.messages; 
                setMessagesLists(v); 
            }
        });
             
        return()=>socket.off("receiveMessage");
 
    }, [currentList, update, selectedUserName, selectedUserId]);

    /* Usata per prelevare i dati e i post dell'utente autenticato */
    useEffect(() => {

        Promise.all([
            fetch("http://localhost:8080/api/users/profile", {
                method: "get",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": token 
                } 
            }).then(res=> {
                if (res.ok) return res.json(); 
                else throw new Error ("Errore di comunicazione")
            }),

            fetch("http://localhost:8080/api/users/profilePosts", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(res=> {
                if (res.ok) return res.json(); 
                else throw new Error ("Errore di comunicazione")
            }),

        ]).then(([info, post]) => {
            setUser(info)
            setPosts(post)
            setLoading(false)
        })

    }, [currentList, update, selectedUserName, selectedUserId, reload])

    //risalgo all'ID del ContactUsername        
    function changeSelectedUser(ContactUsername){ 
        setSelectedUserName(ContactUsername); 
        fetch("http://localhost:8080/api/chats/getIdByUsername/"+ ContactUsername)
        .then(res=> {
            if (res.ok) return res.json(); 
            else throw new Error("Errore di comunicazione")
        })
        .then(res=>{  
            //con l'ID risalgo alla lista dei messaggi
            setSelectedUserId(res); 
            const list= messagesLists.find(e=>  e.a1.toUpperCase()===res.toUpperCase() || e.a2.toUpperCase()===res.toUpperCase()); 
            setCurrentList(list); 
            console.log("Questo è list: ", list)
            console.log("Questo è currentList: ", currentList)
 
        }).catch(e=>console.log(e)); 
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
    <>
        <div className='profile-container'>
            {/* Se viene trovato l'utente allora mostra i vari dettagli*/}
            {user ? (
                <div>
                    <h1>Benvenuto, {user.username}!</h1>
                </div>
            ) : (<p>Utente non trovato</p>)
            }
            <div className="profileInfo">
                {user && (
                    <div>
                        <p>{user.email}</p>
                    </div>
                )}

                <div id="logout"> 

                    <Link to="/" onClick={e=> { 
                        e.preventDefault(); 
                        handleUser(null); 
                        navigate("/"); 
                    }}>
                    
                    <Button block size="lg" className="button">Log-out <FontAwesomeIcon icon={faRightFromBracket} /></Button></Link> 
                    
                </div>
            </div>

            <div className='posts-container'>

                <h2>I tuoi post</h2>

                {/* Se la dimensione dell'array è maggiore di 0 allora vengono mostrati tutti i post */}                
                {posts.length > 0 ? (posts &&
                    <div className="posts">
                        {posts.map(post => (
                            <Card item={post} key={post.id} profile={prof} setReload={setReload}/>
                        ))}
                    </div>
                ) : (<p>Nessun post disponibile</p>)
                }
        
            </div>
        </div>

        

        <div id="chat">

            <ContactList loggedUser={loggedUser} handler={changeSelectedUser} up={update} reload={reloadChat}/>

        </div>      

        <div id="chat-messages">
            {/* Si passa a messagesList la lista dei messaggi filtrata, si otterrà solo la lista tra utente loggato e selezionato */} 
            {(currentList !== null) && (<MessagesList 
                messageList={currentList} 
                ContactName={selectedUserName} 
                ContactId={selectedUserId} 
                socket={socket} 
                username={loggedUser} 
                handleChat={handleChatClosure}
                setReload={setReloadChat}
                />)
            }  
        </div>
      
    </>
);
}