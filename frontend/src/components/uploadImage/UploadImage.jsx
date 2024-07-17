import { createContext, useEffect, useState } from "react";


// Crea un contesto React per gestire lo stato di caricamento dello script Cloudinary
const CloudinaryScriptContext = createContext();

function UploadImage({ uwConfig, setState }) {

    // Per tracciare se lo script Cloudinary è stato caricato
    const [loaded, setLoaded] = useState(false);

    // Per gestire il caricamento dello script Cloudinary
    useEffect(() => {
        
        // Controlla se lo script non è stato ancora caricato
        if (!loaded) {
            const uwScript = document.getElementById("uw");
            if (!uwScript) {
                // Se lo script non è presente nel DOM, lo creo e lo aggiungo
                const script = document.createElement("script");
                script.setAttribute("async", "");
                script.setAttribute("id", "uw");
                script.src = "https://upload-widget.cloudinary.com/global/all.js";
                // Aggiorno lo stato quando lo script è caricato
                script.addEventListener("load", () => setLoaded(true));
                document.body.appendChild(script);
            } else {
                // Altrimenti aggiorno lo stato
                setLoaded(true);
            }
        }
    }, [loaded]);

    // Funzione per inizializzare il widget Cloudinary quando lo script è caricato
    const initializeCloudinaryWidget = () => {
        if (loaded) {
            var myWidget = window.cloudinary.createUploadWidget(
                uwConfig,
                (error, result) => {
                    // Callback per gestire il risultato dell'upload
                    if (!error && result && result.event === "success") {
                        console.log("Immagine caricata! Ecco le sue info: ", result.info);
                        // Aggiorna lo stato con l'URL dell'immagine caricata
                        setState((prev) => [...prev, result.info.secure_url]);
                    }
                }
            );

            // Aggiunge un listener al bottone per aprire il widget di upload
            document.getElementById("upload_widget").addEventListener(
                "click",
                function () {
                    myWidget.open();
                },
                false
            );
        }
    };

    return (

        <CloudinaryScriptContext.Provider value={{ loaded }}>
            <button
                id="upload_widget"
                className="cloudinary-button"
                onClick={initializeCloudinaryWidget}
            >
                <img src="/upload_2.png" alt="" className="upload"/>
                Carica immagini
            </button>
        </CloudinaryScriptContext.Provider>
    );
}

export default UploadImage;
export { CloudinaryScriptContext };