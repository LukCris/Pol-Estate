import { Link } from "react-router-dom";
import "./card.css";
import Button from "react-bootstrap/Button";

export default function Card({item, profile, setReload}) {

    const itemId = item._id; //ID del post immobiliare

    // Funzione per gestire il singolare/plurale in base al numero
    const numCamere = function () {

        if(item.bedroom > 1){
            return "camere da letto"
        } else return "camera da letto"
    }

    const numBagni = function () {
        if(item.bathroom > 1){
            return "bagni"
        } else return "bagno"
    }

    return (
        <div className="card">
            <div className="imageContainer">
                <Link to={`/postDetail/${item._id}`}>
                    <img src={item.images[0]}/>
                </Link>
            </div>
            <div className="textContainer">
                <Link to={`/postDetail/${item._id}`}>
                    <h3 className="title">{item.title}</h3>
                </Link>
                <div className="infoContainer">
                    <p className="address">
                        <img src="/pin.png" alt=""/>
                        <span>{item.address}, {item.city}</span>
                    </p>
                    <div className="info">
                        <p className="price">€ {item.price}</p>
                        <p className="price">{item.type}</p>
                        <p className="price">{item.property}</p>
                    </div>

                    <div className="bottom">
                        <div className="features">
                            <div className="feature">
                                <img src="/bed.png" alt=""/>
                                <span>{item.bedroom} {numCamere()}</span>
                            </div>
                            <div className="feature">
                                <img src="/bath.png" alt=""/>
                                <span>{item.bathroom} {numBagni()}</span>
                            </div>
                            {profile && (<div className="icons">
                                <Button className="icon" onClick={
                                    e => {
                                        // Gestione dell'eliminazione del post
                                        const token=document.cookie.split(";") 
                                        .find((row) => row.startsWith("token")) 
                                        .split("=")[1]; // Ottiene il token dall'autenticazione
                                        console.log("Inizio prevent default")
                                        e.preventDefault();

                                        // Richiesta HTTP per eliminare il post
                                        fetch("http://localhost:8080/api/posts/deletePost", {
                                            method: "post",
                                            headers: {
                                                "Content-Type": "application/json",
                                                'Authorization': token
                                            },
                                            body: JSON.stringify({
                                                id: itemId
                                            })
                                        })
                                        .then(res=> {
                                            if (res.ok) return res.json(); 
                                            else throw new Error("Errore di comunicazione")})
                                        .then(res=>{
                                            window.alert(res); 
                                            setReload(true);                               
                                        })
                                        .catch(e=>console.log(e));                            
                                    }                                
                                }>
                                    <img src="/garbage.png" alt=""/>
                                </Button>

                            </div>)}
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}