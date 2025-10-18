const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: false},
    note: {type: String, require: true, unique: false},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {timestamps: true});

module.exports = mongoose.model('Notas', NoteSchema);