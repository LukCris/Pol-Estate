import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom"
import "./login.css"

export default function Login({handleUser, handleUsername}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    const navigate=useNavigate();

    return (
        <div className="login">

            <div className="formContainer">
                <form id="login" onSubmit={e=> {
                        e.preventDefault();
                        fetch("http://localhost:8080/api/auth/login", {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }).then(res=> { if(res.ok) return res.json();
                            else
                                throw new Error("Si è verificato un errore nella comunicazione")}
                        ).then(res=> {if (res!=="Credenziali non valide")
                        {
                            handleUser(res.token);
                            handleUsername(res.username);
                            navigate("/homePage");
                            window.alert("Login avvenuto correttamente, benvenuto!");
                        }
                        else
                            window.alert("Credenziali non valide")})
                            .catch(e=> console.log(e));
                    }}>

                    <div className="inputContainer">

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
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="containerButton">

                        <Button block size="lg" type="submit" disabled={!validateForm()} className="loginButton">
                            Login
                        </Button>

                        <Link to="/registrazione"><Button block size="lg" className="regButton">Registrazione</Button></Link>

                    </div>
                </form>
            </div>
        </div>
    );
}