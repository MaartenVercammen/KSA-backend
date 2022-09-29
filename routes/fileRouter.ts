import express from "express";
import multer from 'multer';
import fs from 'fs';
import authcheck from "../middleware/authcheck";
import dotenv from 'dotenv'
import path from 'path'
import roleCheck from "../middleware/roleCheck";

dotenv.config({ path: path.join(__dirname,  `../.env.${process.env.NODE_ENV}`) });

const fileRouter = express.Router();

const publicPath = process.env.PUBLIC_PATH

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const addonpath = req.query.path
        switch(file.mimetype){
            case 'application/pdf': callBack(null, publicPath + "/pdf/" + addonpath); break;
            case 'image/jpeg': 
            case 'image/png':
            case 'image/webp':
                callBack(null, publicPath + "/images"); break;
            default:
                callBack(null, publicPath)
        }
        
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
  })

  let upload = multer({ storage: storage })

fileRouter.post('/', authcheck, roleCheck("ADMIN", "MODERATOR"), upload.single('file'), (req, res) => {
    res.status(200).json({type: "ok", message: "File Uploaded"})
})

fileRouter.get('/braggels', (req, res) =>{
    const files = fs.readdirSync(publicPath + '/pdf/' + req.query.path)
    res.status(200).json(files)
})

fileRouter.delete('/braggels',authcheck, roleCheck("ADMIN", "MODERATOR"), (req, res) => {
    const filename = req.query.filename
    const path = req.query.path
    fs.unlink(publicPath + "/pdf/" + path + "/" + filename, (err) => {
        if(err) res.status(500).json({type: "error", message: err.message})
        else res.status(200).json({type: "ok", message: "braggel deleted"})
    })
    
})


export default fileRouter;