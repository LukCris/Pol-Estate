import "./listPostPage.css";
import Card from "../../components/card/Card";
import React from "react";
import { useEffect, useState } from "react";

export default function ListPostPage() {

    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [property, setProperty] = useState("");
    const [postList, setPostList] = useState([]);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);

    // Variabile usata in Card per mostrare o meno il bottone per cancellare i post
    const profile = false;

    function validateForm() {
        return city.length > 0 && property.length > 0 && type.length > 0;
    }

    function handleCityChange(e) {
        let input = e.target.value;
        // Controlla se l'input non è vuoto
        if (input.length > 0) {
            // Converte la prima lettera in maiuscolo e il resto in minuscolo
            input = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        }
        setCity(input);
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/posts/findAllPost", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res)
             if (res.ok) return res.json(); 
             else throw new Error("Connessione non riuscita")
            })
            .then(res => {
                console.log("Questa è la risposta" + res)
                setPostList(res);
                setLoading(false);
                console.log(res);
            })
            .catch(error => console.log(error));
    }, []);

    return (

        <div className="listPage">

            <div className="filter">

                <h1 className="title">Cerca la casa dei tuoi sogni</h1>

                <div className="wrapper">

                    <div className="formContainer">

                        <form onSubmit={e => {
                            console.log(city)
                            setLoading(true);
                            console.log("inizio prevent default")
                            e.preventDefault()
                            console.log("inizio fetch")

                            fetch("http://localhost:8080/api/posts/findPost", {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    city: city,
                                    type: type,
                                    property: property
                                })
                            }).then(res => {
                                console.log(res)
                                if (res.ok) return res.json();
                                else throw new Error("Connessione non riuscita")
                            })
                                .then(res => {
                                    setPostList(res);
                                    setLoading(false);
                                    setSearch(true);                  
                                    console.log(res);
                                }).catch(error => console.log(error))
                        }}>

                            <div className="item">

                                <label htmlFor="city">Città</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    placeholder="Inserisci la città"
                                    value={city}
                                    onChange={handleCityChange}
                                />

                            </div>
                            
                            <div className="item">

                                <label htmlFor="type">Tipo di annuncio</label>
                                <select
                                    name="type"
                                    id="type"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value="">Seleziona</option>
                                    <option value="Vendita">In Vendita</option>
                                    <option value="Affitto">In Affitto</option>
                                </select>

                            </div>

                            <div className="item">

                                <label htmlFor="property">Tipo proprietà</label>
                                <select
                                    name="property"
                                    id="property"
                                    value={property}
                                    onChange={e => setProperty(e.target.value)}
                                >
                                    <option value="">Seleziona</option>
                                    <option value="Appartamento">Appartamento</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Condominio">Condominio</option>
                                    <option value="Campagna">Campagna</option>
                                </select>

                            </div>
                                                      
                            <button type="submit" disabled={!validateForm()}>
                                <img src="/search.png" alt=""/>
                            </button>
                            
                        </form>
                    </div>

                    <div className="allPostButtonContainer">

                        {/*Il bottone viene visualizzato solo dopo aver eseguito la ricerca specifica, e
                        sparisce una volta cliccato. Permette di visualizzare tutti i post nuovamente*/}
                        {search &&
                            (<button disabled={search===false}
                            className="allPostButton"
                            onClick={() =>{
                                if(search){
                                    fetch("http://localhost:3000/api/posts/findAllPost", {
                                        method: "get",
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    }).then(res => {
                                        console.log(res)
                                        if (res.ok) return res.json(); 
                                        else throw new Error("Connessione non riuscita")
                                        })
                                        .then(res => {
                                            setPostList(res);
                                            setSearch(false);
                                            console.log(res);
                                        })
                                        .catch(error => console.log(error));
                                    
                                }
                        }}>
                            Mostra tutti i post
                        </button>)}

                    </div> 
                    
                </div>           
            </div>    

            
            {(postList.length === 0) ? (
                (loading) ? (<p>Sto cercando i post...</p>) :
                (<div id="unfoundcity"><p>Nessun post trovato</p></div>)
            ) : (

                
                (postList.length > 0) &&
                <div className="postTrovati">
                    {postList &&
                        postList.map(
                            p => <Card key={p._id} item={p} profile={profile}/>
                        )}
                </div>
            )}

        </div>
    );
}
