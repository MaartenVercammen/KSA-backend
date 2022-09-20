import express from "express";
import multer from 'multer';
import fs from 'fs';

const fileRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        switch(file.mimetype){
            case 'application/pdf': callBack(null, "./public/pdf"); break;
            case 'image/jpeg': 
            case 'image/png':
            case 'image/webp':
                callBack(null, "./public/images"); break;
            default:
                callBack(null, './public/')
        }
        
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
  })

  let upload = multer({ storage: storage })

fileRouter.post('/', upload.single('file'), (req, res) => {
    res.status(200).json({type: "ok", message: "File Uploaded"})
})

fileRouter.get('/braggels', (req, res) =>{
    const files = fs.readdirSync('./public/pdf')
    res.status(200).json(files)
})

fileRouter.delete('/braggels', (req, res) => {
    const filename = req.query.filename
    fs.unlink('./public/pdf/' + filename, (err) => {
        if(err) res.status(500).json({type: "error", message: err.message})
        res.status(200).json({type: "ok", message: "braggel deleted"})
    })
    
})


export default fileRouter;