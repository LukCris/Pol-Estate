import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./postDetailPage.css";
import Button from "react-bootstrap/Button";
import { faBarChart } from "@fortawesome/free-solid-svg-icons";

const PostDetailPage = ({ loggedUser }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState();
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8080/api/posts/getPostById/" + id, { //richiesta GET
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if(res.ok) return res.json(); // Se la risposta è OK, converte i dati in JSON
            else throw new Error("Connessione non riuscita");
        })
        .then((res) => {
            setPost(res); // Aggiorna lo stato con i dati del post
            setLoading(false);
        }).catch(error => console.error("Error fetching: ", error)); // Gestisce eventuali errori nella richiesta
    }, [id]); // Effetto dipende da id, quindi viene rieseguito quando id cambia

    const nextImage = () => { // Funzione per passare all'immagine successiva
        setCurrentImageIndex((prevIndex) =>
            prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => { // Funzione per tornare all'immagine precedente
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Nessun post trovato</div>;
    }

    return (
        <div className="postDetailPage">
            <div className="imageContainer">

                {post.images && post.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="prevButton">Indietro</button>
                        <div className="image">
                            <img src={post.images[currentImageIndex]} alt={`${post.title}`} />
                        </div>
                        <button onClick={nextImage} className="nextButton">Avanti</button>
                    </>
                )}
                {post.images && post.images.length === 1 && (
                    <div className="image">
                        <img src={post.images[currentImageIndex]} alt={`${post.title}`} />
                    </div>
                )}
                
            </div>
            <div className="infoImmobileContainer">
                <h1>{post.title}</h1>
                <p><strong>Città:</strong> {post.city}</p>
                <p><strong>Tipo di annuncio: </strong>{post.type}</p>
                <p><strong>Tipo di proprietà:</strong> {post.property}</p>
                <p><strong>Bagni:</strong> {post.bathroom}</p>
                <p><strong>Camere da letto:</strong> {post.bedroom}</p>
                <h2>Prezzo: €{post.price}</h2>
                <h3>Descrizione:</h3>
                <p>{post.description}</p>
                <Button icon={faBarChart} className="chatButton" disabled={loggedUser === ""} onClick={e => { 
                        
                        const token = document.cookie.split("; ")
                        .find((row) => row.startsWith("token"))
                        .split("=")[1];

                        fetch("http://localhost:8080/api/users/findUser", {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": token
                            },
                            body: JSON.stringify({ id: id })
                        }).then(res => {
                            if(res.ok) return res.json();
                            else throw new Error("Problema di comunicazione");
                        }).then(res => {
                            if(res !== "Stai aprendo una chat con te stesso" && res !== "Utente non trovato" && res !== "Post non trovato"){
                                fetch("http://localhost:8080/api/chats/addContact", {
                                    method: "post",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": token
                                    },
                                    body: JSON.stringify({ 
                                        id: id,
                                        u1: loggedUser,
                                        u2: res
                                    })
                                }).then(res => {
                                    if(res.ok) return res.json();
                                    else throw new Error("Problema di comunicazione");
                                }).then(res => {
                                    window.alert(res)
                                    navigate("/profilo");
                                }).catch(e => { console.log(e); });
                            } else window.alert(res)
                            
                        }).catch(e => { console.log(e); });
                    }}>Avvia chat</Button>
            </div>
        </div>
    );
};

export default PostDetailPage;


