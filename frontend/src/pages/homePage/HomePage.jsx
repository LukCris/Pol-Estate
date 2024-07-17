import './homePage.css'
import React,{Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function HomePage(){

    return( 
  
        <div className= 'homePage'>
                        
            <div className="textContainer">
                    <div className="wrapper">
                        <h1 className="title">
                            Cerca la casa dei tuoi sogni con noi di Pol-Estate
                        </h1>
                        <p>
                            Con anni di esperienza nel settore e una profonda conoscenza del mercato,
                            siamo pronti ad offrirvi un servizio su misura, pensato per soddisfare ogni vostra esigenza. 
                            Esplorate le nostre offerte esclusive di immobili residenziali e commerciali, 
                            dalle accoglienti abitazioni in centro città alle eleganti ville in campagna.
                        </p>
                    </div> 
            </div>
            
            
            <div className='infoContainer'>
                <div className='infoCard'>
                    <div className='infoImage'>
                        <img src="/security.png" alt={""} className='infoIcon'/>
                    </div>
                    <div className='infoDesc'>
                        <p className='infoTitle'><strong>Registrati</strong></p>
                        <p>
                            Sfrutta al massimo i servizi del nostro sito effettuando il login o 
                            registrandoti, se ancora non l'hai fatto.
                        </p>
                    </div>                    
                </div>
                <div className='infoCard'>
                    <div className='infoImage'>
                        <img src="/sell.png" alt={""} className='infoIcon'/>
                    </div>
                    <div className='infoDesc'>
                        <p className='infoTitle'><strong>Carica la tua casa</strong></p>
                        <p>
                            Crea gratuitamente un post e vendi la tua casa affidandoti alla nostra agenzia immobiliare. 
                            Per te abbiamo anche implementato una chat con cui poter comunicare con i tuoi
                            potenziali compratori.
                        </p>
                    </div> 
                    
                    <Link to={"/listaPost"} ><Button block size="lg" className='homeButton'>
                        Trova subito la tua casa
                    </Button></Link>
                </div>
                <div className='infoCard'>
                    <div className='infoImage'>
                        <img src="/home.png" alt={""} className='infoIcon'/>
                    </div>
                    <div className='infoDesc'>
                        <p className='infoTitle'><strong>Compra la casa dei tuoi sogni</strong></p>
                        <p>
                            Scegli tra i tantissimi post caricati dai nostri utenti nella tua città, selezionando
                            la tipologia di annuncio e il tipo di proprietà che desideri. Oppure lasciati ispirare
                            dalla tantissime proprietà presenti sul territorio nazionale ed estero.                    
                        </p>
                    </div> 
                </div>
            </div>

        </div>
    )
}

