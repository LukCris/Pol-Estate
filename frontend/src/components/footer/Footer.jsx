import React from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import "./footer.css"

export default function Footer(){

    return(
        <div className="footer">
            <div className="wrapper">
                <div className="logoContainer">
                    <Image src="/logo1.png" className="logo"/>
                </div>
                <div className="contactContainer">
                    <h4>Creatori della pagina</h4>
                    <div className="contactCard">
                        <p>Luca Crispino</p>
                        <p>Giada Rosa del Rosso</p>
                        <p>Angelo Liuzzi</p>
                    </div>
                </div>
                <div>
                    <h4>Seguici su:</h4>
                    <div className="buttonContainer">
                        <Button><img src="/facebook.png" alt="Facebook logo" className="icon"/></Button>
                        <Button><img src="/instagram.png" alt="Instagram logo" className="icon"/></Button>
                    </div>
                    
                </div>
            </div>
            <p className="advice">Questo è un sito creato per scopi universitari. Quindi, le proprietà non sono da intendersi come realmente in vendita/affitto</p>
        </div>
    )
}