const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage =  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'project-hub',
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf','zip'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        }
        
    }
})

const upload = multer({storage})

module.exports = {cloudinary, upload}
