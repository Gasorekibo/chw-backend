import mongoose from "mongoose";

const enumerateSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    github: { type: String},
    discord: { type: String},
    completed:{type:Boolean, default:false}
});

const Enumerate = mongoose.model('Enumerate', enumerateSchema);

export default Enumerate
