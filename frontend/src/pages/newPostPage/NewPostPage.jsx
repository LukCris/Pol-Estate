import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
import UploadImage from "../../components/uploadImage/UploadImage";
import "./newPostPage.css"
import Button from "react-bootstrap/Button";


export default function NewPostPage() {

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [bedroom, setBedroom] = useState("");
    const [bathroom, setBathroom] = useState("");
    const [type, setType] = useState("");
    const [property, setProper] = useState("");
    const [size, setSize] = useState("");
    const [images, setImages] = useState([])

    function handleCityChange(e) {
        let input = e.target.value;
        // Controlla se l'input non è vuoto
        if (input.length > 0) {
            // Converte la prima lettera in maiuscolo e il resto in minuscolo
            input = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        }
        setCity(input);
    }

    function validateForm() {
        return title.length > 0 && price.length > 0 && address.length > 0
            && description.length > 0 && city.length > 0 && bedroom.length > 0 &&
            bathroom.length > 0 && type.length > 0 && property.length > 0 &&
            size.length > 0 && images.length > 0;
    }

    const navigate=useNavigate();

    const user = document.cookie.split("; ")
    .find((row) => row.startsWith("token"))
    .split("=")[1];
    console.log("Questo è il token denominato con user: ", user)

    return (
        <div className="newPostPage">
            <div className="formContainer">
                <h1>Aggiungi un nuovo Post</h1>
                <div className="wrapper">

                    <form onSubmit={e => {
                        console.log("inizio prevent default")
                        e.preventDefault();
                        console.log("fine prevent default");
                        console.log("Questo è il document.cookie: " + document.cookie)
                        console.log("inizio fetch")
                        fetch("http://localhost:8080/api/posts/addPost", {
                            method: "post",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": user
                            },
                            body: JSON.stringify({
                                title: title,
                                price: price,
                                address: address,
                                city: city,
                                description: description,
                                bedroom: bedroom,
                                bathroom: bathroom,
                                type: type,
                                property: property,
                                size: size,
                                images: images,
                                user: user
                            })
                        }).then(res => {
                                if (res.ok) return res.json();
                                else throw new Error("Si è verificato un errore nella comunicazione")
                            }
                        ).then(res => {
                            
                            navigate("/homePage");
                            window.alert("Post caricato con successo");

                        })
                    }}>

                        <div className="itemContainer">

                            <div className="item">
                                <label>Titolo</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    placeholder="Scegli un titolo per il post"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/fee.png" alt=""/>
                                    <label>Prezzo o Canone di locazione</label>
                                </div>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="Indica il prezzo"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/pin.png" alt=""/>
                                    <label>Indirizzo</label>
                                </div>

                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={address}
                                    placeholder="Indica l'indirizzo della proprietà"
                                    onChange={(e) => setAddress(e.target.value)}/>
                            </div>
                            <div className="item description">

                                <div className="labelDes">
                                    <img src="/description.png" alt=""/>
                                    <label>Descrizione</label>
                                </div>
                                <textarea
                                    id="desc"
                                    name="description"
                                    value={description}
                                    placeholder="Fornisci una breve descrizione della tua proprietà"
                                    onChange={(e) => setDescription(e.target.value)}/>
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/city.png"/>
                                    <label>Città</label>
                                </div>

                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={city}
                                    placeholder="Indica la città della proprietà"
                                    onChange={handleCityChange}
                                />
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/bed.png" alt=""/>
                                    <label>Camere da letto</label>
                                </div>

                                <input
                                    min={1}
                                    id="bedroom"
                                    name="bedroom"
                                    type="number"
                                    placeholder="Indica il numero di camere da letto"
                                    value={bedroom}
                                    onChange={(e) => setBedroom(e.target.value)}
                                />
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/bath.png" alt=""/>
                                    <label>Bagni</label>
                                </div>

                                <input
                                    min={1}
                                    id="bathroom"
                                    name="bathroom"
                                    type="number"
                                    value={bathroom}
                                    placeholder="Indica il numero di bagni"
                                    onChange={(e) => setBathroom(e.target.value)}
                                />
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/chiavi.png" alt=""/>
                                    <label>Tipo di annuncio</label>
                                </div>
                                <select name="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}>
                                    <option value="">Scegli un'opzione</option>
                                    <option value="Affitto">Affitto</option>
                                    <option value="Vendita">Vendita</option>
                                </select>
                            </div>
                            <div className="item">
                                <div className="labelDes">
                                    <img src="/property.png" alt=""/>
                                    <label>Tipo di proprietà</label>
                                </div>
                                <select name="property"
                                        value={property}
                                        onChange={(e) => setProper(e.target.value)}>
                                    <option value="">Scegli un'opzione</option>
                                    <option value="Appartamento">Appartamento</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Condominio">Condominio</option>
                                    <option value="Campagna">Campagna</option>
                                </select>
                            </div>

                            <div className="item">
                                <div className="labelDes">
                                    <img src="/size.png" alt=""/>
                                    <label>Grandezza</label>
                                </div>

                                <input
                                    min={0}
                                    id="size"
                                    name="size"
                                    type="number"
                                    placeholder="Grandezza totale in mq²"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}/>
                            </div>
                        </div>
                        <div className="buttonContainer">
                            <Button
                                type="submit"
                                disabled={!validateForm()}
                                className="sendButton">
                                Pubblica post
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
            <div className="sideContainer">
                <div className="imageContainer">
                    {images.map((image, index) => (
                        <img src={image} key={index} alt=""/>
                    ))}
                </div>
                
                <UploadImage
                    uwConfig={{
                        multiple: true,
                        cloudName: "do3sztn27",
                        uploadPreset: "Progetto_estate",
                        folder: "posts",
                    }}
                    setState={setImages}
                />
            </div>
        </div>
    )
}
