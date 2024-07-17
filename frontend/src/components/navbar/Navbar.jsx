import "./navbar.css"
import React from "react";
import Button from './Button';
import Image from "react-bootstrap/Image";
import { faHouse, faUpload,faUser,faNewspaper, faSearch} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({logged}){

    /*
        Tramite i render condizionali, renderizziamo la navbar in base 
        al fatto che l'utente sia loggato o meno
    */

    return(
        <div className="navbar">
            <ul>
                <Image src="/logo1.png" className="logo"/>
                <Button description= " Home" url={"/HomePage"} icon ={faHouse} className="Button"/>

                {logged &&
                    (<Button description= " Carica post" url={"/nuovoPost"} icon={faUpload} className="Button"/>)
                }

                <Button description=" Cerca la tua casa" url={"/listaPost"} icon={faSearch} className="Button"/>

                {!logged && (
                    <Button description= " Accedi" url={"/login"} icon={faUser} className="Button"/>)
                }

                {!logged && (
                    <Button description= " Registrati" url={"/registrazione"} icon={faNewspaper} className="Button"/>)
                }

                {logged &&
                    (<Button description= " Profilo" url={"/profilo"} className="Button"/>)
                }
            </ul>
        </div>
    )

}

