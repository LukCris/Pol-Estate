const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    price: Number,
    address: String,
    images: [{
        type: String,
        default: null
    }],
    city: String,
    bedroom: Number,
    bathroom: Number,
    description: String,
    size: Number,
    type: {
        type: String,
        enum: ["Vendita", "Affitto"],
        message: 'Valore non supportato'
    },
    // Property può assumere solo determinati valori
    property: {
        type: String,
        enum:{
            values: ["Appartamento", "Villa", "Condominio", "Campagna"],
            message: 'Valore non supportato'
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
  })

module.exports = mongoose.model('Post', postSchema);