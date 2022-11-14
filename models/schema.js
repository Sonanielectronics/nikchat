'use strict';
    const mongoose = require("mongoose");
    var validator = require("validator")

    const Schema = mongoose.Schema;

    const TodoSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: [true]
        },
        socketid: {
            type: String
        }
        
    });

module.exports = mongoose.model("Nikxgramcollection", TodoSchema);
