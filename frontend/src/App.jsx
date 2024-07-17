import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import "./layout.css";
import HomePage from "./pages/homePage/HomePage";
import Profilo from "./pages/profile/Profilo";
import NewPostPage from "./pages/newPostPage/NewPostPage";
import PostDetailPage from "./pages/postDetailPage/PostDetailPage";
import {Routes,Route} from "react-router-dom";
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import io from "socket.io-client"
import {useState,useEffect} from "react"
import Cookies from "universal-cookie"
import ListPostPage from "./pages/listPostPage/ListPostPage";


const socket = io.connect("http://localhost:8080")
const cookies= new Cookies();

export default function App() {

  const [username,setUsername]=useState("");
  const [logged, setLogged] = useState(false);

  function setLoggedUser(token){
    if(token==null)
    {
      console.log("Cancellazione cookie");
      //Comando utilizzato per rimuovere il cookie
      cookies.remove('token', {
        path: '/',
      });
      console.log(document.cookie);
      setUsername("");

      setLogged(false);
    }

    else
    {
      //Comando utilizzato per impostare il parametro del cookie relativo al token
      cookies.set("token", token, {
        path: '/',
       maxAge: 1000000
      });

      console.log("Cookie creato: ", cookies)

      setLogged(true);
    }
    
  }



  useEffect(()=>{
    
    //ad ogni rendering dell'app si verificherà se il token è null per scegliere se far visualizzare le pagine di login e register oppure il resto del sito
    if(!cookies.get("token"))
    {
      console.log("nessun utente settato");
    }  
    else
    {
      console.log("Utente settato: "+ cookies.get("token"));
      fetch("http://localhost:8080/api/auth/findUsernameByToken", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": cookies.get("token")
        }
      }).then(res=> {if(res.ok) return res.json(); else throw new Error("Errore di comunicazione")})
      .then(res=> setUsername(res));

    }

  }, [username])
  return (
        
    <div className="container">

      <div className="navbar">
        <Navbar logged={logged}/>
      </div>
    
      <div className="content"> {

        (username==="") ?
          (<>
          <Routes>
            <Route path="/homePage" element={<HomePage></HomePage>}></Route>
            <Route path="/login" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/>} ></Route>
            <Route path="/registrazione" element={<Register handleUser={setLoggedUser} handleUsername={setUsername}/>}/>
            <Route path="nuovoPost/:username" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/> } />
            <Route path="/" element={<HomePage handleUser={setLoggedUser} handleUsername={setUsername}/>}></Route>
            <Route path="/nuovoPost" element={<Login handleUser={setLoggedUser} handleUsername={setUsername}/>}/>
            <Route path="/listaPost" element={<ListPostPage/>}/>
            <Route path="/postDetail/:id" element={<PostDetailPage loggedUser={username}/>} />
            <Route path="/profilo" element={<Login handleUser={setLoggedUser} handleUsername={username}/>}/>
            </Routes>
            </>) :
          (<Routes>
            <Route path=":username" element={<HomePage/>} />
            <Route path="/listaPost" element={<ListPostPage/>}/>
            <Route path="/postDetail/:id" element={<PostDetailPage loggedUser={username}/>} />
            <Route path="/homePage" element={<HomePage/>}></Route>
            <Route path="nuovoPost" element={<NewPostPage/> } />
            <Route path="profilo" element={<Profilo handleUser={setLoggedUser} loggedUser={username} socket={socket}/> } />
            
          </Routes>)
          }
        
        </div>

        <div className="footer">
            <Footer/>
        </div>
    </div>
    
  )
}

