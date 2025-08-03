const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// upload handler for both files
const uploadProjectFiles = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      if (file.fieldname === 'header_image') {
        return {
          folder: 'project-headers',
          allowed_formats: ['jpg', 'png', 'jpeg'],
          transformation: [{ width: 1200, crop: 'limit' }]
        }
      }
      return {
        folder: 'project-attachments',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'zip']
      }
    }
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    cb(null, true)
  }
}).fields([
  { name: 'header_image', maxCount: 1 },
  { name: 'attachments', maxCount: 10 }
])

module.exports = { uploadProjectFiles }