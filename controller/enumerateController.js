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
            const exists = await Enumerate.findOne({email:data["student email"]})
            if(exists) {
                fs.unlinkSync(localPath);
                return res.status(409).json({
                status:"fail",
                message:`User ${exists.email} already Exists`
            })
             }
            const student = new Enumerate({
                firstname: data["First name"],
                lastname: data["Second name"],
                email: data["student email"],
                discord: data["discord username"],
                github: data["Github username"],
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
    const {firstname,
        lastname,
        email,
        github,
        discord} = req.body
    try {
        const user = await Enumerate.findOne({email:req.body.email});
        if(user) return res.status(409).json({
            status:"Fail",
            message:"This User already exists"
        })
        const newUser = await Enumerate.create({
            firstname,
            lastname,
            email,
            github,
            discord
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
        const users = await Enumerate.find().sort({"_id":-1})
        return res.status(200).json({
            status:'Success',
            length:users.length,
            data:users.length > 0 ? users:"No users Found for today"
        })
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
            message:`User ${updatedUser.firstname} Updated Successfully`,
            new:updatedUser
    })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message || "Something went wrong" });  
    }
})
export { createTesting, addSingleUser, fetchUsers, editUser};
