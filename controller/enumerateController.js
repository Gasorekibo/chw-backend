import expressAsyncHandler from "express-async-handler";
import csv from "csvtojson";
import Enumerate from "../model/Enumerate.js";
import fs from "fs";
import validateMongodbId from "../utils/validateMongodbId.js";

// ======= Create Testing =====

const createTesting = expressAsyncHandler(async (req, res) => {
    try {
        // Get the local path to img
        const localPath = `public/images/csv/${req.file.filename}`;
        const jsonArray = await csv().fromFile(localPath);

        if (jsonArray.length < 1) {
            throw new Error("The CSV file should have at least one record");
        }

        const insertedRecords = [];

        for (const data of jsonArray) {
            const exists = await Enumerate.findOne({house_hold_number:data["House hold number"]})
            if(exists) {
                fs.unlinkSync(localPath);
                return res.status(409).json({
                status:"fail",
                message:`User ${exists.fullname} already Exists`
            })
             }
            const student = new Enumerate({
                fullname: data["Full name"],
                house_hold_number: data["House hold number"],
                size: data["size"],
                camp: data["camp"],
                address: data["Address"],
                house_hold_id:data["House hold ID"]
            });
            // Save each student individually
            const savedUser = await student.save();
            insertedRecords.push(savedUser);
        }
        // Clean up: Remove the file
        fs.unlinkSync(localPath);

        res.status(200).json({
            success: true,
            count: insertedRecords.length,
            data: insertedRecords,
        });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });
    }
});

// ======= Add Single user ======
const addSingleUser = expressAsyncHandler(async (req, res) => {
    const {fullname,
        size,
        house_hold_id,
        house_hold_number,
        camp,
        address
    } = req.body
    try {
        const user = await Enumerate.findOne({house_hold_id:house_hold_id});
        if(user) return res.status(409).json({
            status:"Fail",
            message:"This User already exists"
        })
        const newUser = await Enumerate.create({
            fullname,
            size,
            house_hold_id,
            house_hold_number,
            camp,
            address
        })
        return res.status(200).json({
            status : 'success',
            data : newUser
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });   
    }
})

//=== Get All users =======
const fetchUsers = expressAsyncHandler(async(req, res)=> {
    try {
        const {camp} = req.query
        switch (camp) {
            case "mugombwa":
                const mugombwa = await Enumerate.find({camp:"mugombwa"}).sort({"_id":-1})
                return res.status(200).json({
                status:'Success',
                length:mugombwa.length,
                data:mugombwa.length > 0 ? mugombwa:"No users Found for today"
        })
            case "kigeme":
                const kigeme = await Enumerate.find({camp:"kigeme"}).sort({"_id":-1})
                return res.status(200).json({
                status:'Success',
                length:kigeme.length,
                data:kigeme.length > 0 ? kigeme:"No users Found for today"
        })
        
        case "ngarama":
            const ngarama = await Enumerate.find({camp:"ngarama"}).sort({"_id":-1})
            return res.status(200).json({
            status:'Success',
            length:ngarama.length,
            data:ngarama.length > 0 ? ngarama:"No users Found for today"
    })
        case "mahama":
            const mahama = await Enumerate.find({camp:"mahama"}).sort({"_id":-1})
            return res.status(200).json({
            status:'Success',
            length:mahama.length,
            data:mahama.length > 0 ? mahama:"No users Found for today"
    })
        case "kiziba":
        case "kibuye":
            const kiziba = await Enumerate.find({$or:[
                {camp:"kiziba"},
                {camp:"kibuye"}
            ]}).sort({"_id":-1})
            return res.status(200).json({
            status:'Success',
            length:kiziba.length,
            data:kiziba.length > 0 ? kiziba:"No users Found for today"
    })
            default:
                return res.json("Invalid query")
        }
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });    
    }
})

// ===== Edit Single user ====

const editUser = expressAsyncHandler(async(req, res)=> {
    try {
        const updatedUser = await Enumerate.findByIdAndUpdate(req.params.id,{...req.body}, {new:true})
        if(!updatedUser) return res.status(500).json({error:"User not found"})
        return res.status(200).json({
            message:`User ${updatedUser.fullname} Updated Successfully`,
            new:updatedUser
    })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });  
    }
})

// ==== Delete Single User ===
const deleteUser = expressAsyncHandler(async(req,res)=>{
    try {
        const user = await Enumerate.findByIdAndDelete({_id:req.params.id});
        if(!user) return res.status(500).json("Error while deleting User");
        return res.status(201).json("Deleted Successfully")
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });     
    }
})

// ==== Get Single user
const getUser = expressAsyncHandler(async(req, res)=> {
    try {
      const user = await Enumerate.findById({_id:req.body.id});
      if(!user) return res.status(404).json("No user of the given Id found");
      return res.status(200).json({data:user})  
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });  
    }
})
export { createTesting, addSingleUser, fetchUsers, editUser, deleteUser, getUser};
