import mongoose from "mongoose";

const enumerateSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    house_hold_number: { type: String, required: true, unique: true },
    size: { type: String},
    house_hold_id: { type: String, required:true, unique:true},
    address:{type:String, required:true, unique:true},
    camp:{type:String, required:true, enum:["mugombwa","ngarama", "kigeme", "kiziba", "mahama", "kibuye"]},
    completed:{type:Boolean, default:false}
});

const Enumerate = mongoose.model('Enumerate', enumerateSchema);

export default Enumerate
