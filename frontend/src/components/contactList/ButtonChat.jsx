import React from "react"; 
import { Link } from "react-router-dom" 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
 
export default function ButtonChat({ icon,name,handler }) { 
  return (
    <li>  
      <Link onClick={e=>{e.preventDefault(); handler(name);}}>  
        <h2 name="user"> <FontAwesomeIcon icon={icon}/> <span> </span>{name}</h2>  
      </Link>
    </li>
  )
  
  
}