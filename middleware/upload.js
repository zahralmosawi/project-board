const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'project-attachments',
    resource_type: 'auto', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'zip']
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } 
})

module.exports = upload