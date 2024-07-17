const Message=require("../models/messages") 

module.exports={

    getMessageById: async (req,res)=>{ 
    try 
    { 
        console.log("Ricerca messaggio "+ req.params.id) 
        if(req.params.id!="null") 
        { 
            const m=await Message.findOne({_id: req.params.id}); 
            if(m) 
            res.json(m); 
        } 
        else 
        { 
            res.json("Nessun messaggio"); 
        } 
        
    } 
    catch(e) { 
        console.log(e); 
    } 
    }
}