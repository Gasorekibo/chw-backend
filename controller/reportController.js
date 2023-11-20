import expressAsyncHandler from "express-async-handler";
import Report from "../model/Report.js";
import fs from "fs";
import cloudinaryUploadPhoto from "../utils/cloudinary.js"
import { fail } from "assert";

// ======= Create Report =====

const createReport = expressAsyncHandler(async(req, res)=> {
    console.log("hitted")
    try {
        const {_id} = req.user
        //1. Get the local path to img
  const localPath = `public/images/reports/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadPhoto(localPath);
        const report = await Report.create({
            title: req.body.title,
            reporter:_id,
            description: req.body.description,
            chw: req.body.userId,
            image:imgUploaded?.url
        });
        fs.unlinkSync(localPath);
        if(!report) {
            res.json({
                status: fail,
                message:"Failed to add new report",

            })
        } else {
            return res.status(200).json({
                success: true,
                data: report
            })
    
        }
        
    } catch (error) {
        throw new Error(error.message || "Something went wrong")
    }
})


// ===== Get All reports reported to this CHW ===
const getAllReport = expressAsyncHandler(async(req, res)=> {
    try {
        const reports = await Report.find({chw:req.body.id}).populate("chw").populate("reporter");
        if(!reports) return res.status(404).json({
            success: false,
            message: "No Reports found for this CHW"
        })
        return res.status(200).json({
                status:true,
                data:reports
        })
    } catch (error) {
        throw new Error(error.message || "Something went wrong") 
    }
})
// ===== Get All reports Reported by Specific reporter ==
const getSingleReporter = expressAsyncHandler(async(req, res)=> {
    try {
        const reports = await Report.find({reporter:req.query.i}).sort({_id:-1});
        return res.status(200).json({
                status:true,
                data:reports && reports.length > 0 ? reports: "No Report Found"
        })
    } catch (error) {
        throw new Error(error.message || "Something went wrong")
    }
})
// ===== Get single reports Reported by Specific reporter ==
const getSingleReport = expressAsyncHandler(async(req, res)=> {
    try {
        const reports = await Report.findById(req.query.i);
        return res.status(200).json({
                status:true,
                data:reports ? {...reports,}: "No Report Found"
        })

    //     const imageUrl = reports.image;

    // return res.status(200).json({
    //   success: true,
    //   data: {
    //     reporter: reports.reporter,
    //     title: reports.title,
    //     description: reports.description,
    //     image: imageUrl,
    //     chw: reports.chw,
    //     _id: reports._id,
    //     __v: reports.__v,
    //     downloadLink: `${imageUrl}?dl=true`,
    //   },
    // });
    } catch (error) {
        throw new Error(error.message || "Something went wrong")
    }
})

const deleteReport = expressAsyncHandler(async(req, res)=> {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        return res.json({
            message:"Deleted Successfully",
            data:report?"Report Deleted":"Report Already Deleted"
        })
    } catch (error) {
        throw new Error(error.message || "Something went wrong")
  
    }
})
export {
    createReport,
    getAllReport,
    getSingleReporter,
    getSingleReport,
    deleteReport
}