import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {useNavigate} from "react-router-dom"
import "./register.css"


export default function Register({handleUser, handleUsername}) {

    const [username,setUsername]=useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Variabili di stato per la creazione di una password sicura
    const [passLenghtControl, setPassLenghtControl] = useState(false);
    const [passUpperControl, setPassUpperControl] = useState(false);
    const [passNumberControl, setPassNumberControl] = useState(false);
    // Variabile di stato per controllare che la password sia sicura
    const [passSecured, setPassSecured] = useState(false);

    const handlerPassword = function (e){
        setPassword(e)
        // Lunghezza minima della password
        const minLength = 7;
        // Controllo che ci sia almeno una maiuscola
        const hasUpperCase = /[A-Z]/.test(e);
        // Controllo che ci sia almeno un numero
        const hasNumber = /[0-9]/.test(e);
        
        const isLengthSufficient = e.length > minLength;

        // Aggiorno gli stati specifici per ogni controllo
        setPassLenghtControl(isLengthSufficient);
        setPassUpperControl(hasUpperCase);
        setPassNumberControl(hasNumber);
        
        // Aggiorno lo stato della variabile di controllo globale
        setPassSecured(isLengthSufficient && hasUpperCase && hasNumber);
    }

    const navigate=useNavigate();

    function validateForm() {
        return email.length > 0 && passSecured && username.length>0;
    }

    return (
        <div className="register">
            <div className="formContainer">
                <form id="reg" onSubmit={e=>{
                    console.log("inizio prev");
                    e.preventDefault();
                    console.log("fine prev");
                    console.log("inizio fetch");
                    fetch("http://localhost:8080/api/auth/register", {   
                        /*la fetch permette la comunicazione del payload contenente le credenziali della registrazione. 
                        Per inviarle al backend passo per api che prende la Route authRouter denominata auth. 
                        Dopo aver raggiunto la Route authRouter.js andrà a prendere la post presente in authController.*/
                        
                        method: 'post',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password
                        })
                    }).then(res=> {
                        if (res.ok) return res.json();
                        else throw new Error('Si è verificato un errore nella comunicazione con il server');
                    }).then(res=> {

                        if(res!=="Utente gia esistente")  {
                            window.alert("Registrazione avvenuta con successo");
                            handleUser(res.token);
                            handleUsername(res.username);
                            navigate("/HomePage");}
                        else
                            window.alert("Utente esistente, non è stato possibile effettuare la registrazione")}).catch(e=> console.log(e))
                }}>

                    <div className="inputContainer">

                        <div className="usernameDiv">
                            <label>Username</label>
                            <input
                                autoFocus
                                name="username"
                                type="text"
                                onChange={(e)=> setUsername(e.target.value)}
                            />
                        </div>

                        <div className="emailDiv">

                            <label>Email</label>
                            <input
                                autoFocus
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            

                        </div>

                        <div className="passwordDiv">
                            <label>Password</label>
                            <input
                                type="password"
                                name="pass"
                                value={password}
                                onChange={(e) => handlerPassword(e.target.value)}
                            />
                            {(!passSecured) && (
                                <div>
                                    <p>La password deve soddisfare i seguenti criteri: </p>
                                    <ul>
                                        {(!passLenghtControl) && 
                                            (<li><p>Deve essere lunga almeno 8 caratteri</p></li>)
                                        }
                                        {(!passNumberControl) && 
                                            (<li><p>Deve contenere almeno un numero</p></li>)
                                        }
                                        {(!passUpperControl) && 
                                            (<li><p>Deve contenere almeno una maiuscola</p></li>)
                                        }
                                    </ul>
                                </div>
                            )}

                            
                            

                        </div>

                    </div>
                    <Button type="submit" block size="lg" disabled={!validateForm()} className="regButton">Registrazione</Button>
                </form>
            </div>            
        </div>
    );
}