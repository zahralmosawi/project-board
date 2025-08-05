const router = require('express').Router()
const Project = require('../models/Project')
const isSignedIn = require('../middleware/isSignedIn')
const cloudinary  = require("../config/cloudinary")
const { uploadProjectFiles } = require('../middleware/upload')
const mongoose = require('mongoose')

router.use(isSignedIn)

//Display the form to add
router.get('/new', (req,res) => {
    res.render('project/newProject')
})

// Create a new project
router.post("/new", uploadProjectFiles, async (req, res) => {
    try {
        const { title, description, date, category, tags } = req.body;

        const newProject = {title, description, date, category, tags, 
            creator: req.session.user._id,
            headerImage: null,
            attachments: []
        }

        // If header image is uploaded, save its url and public_id
        if (req.files && req.files.header_image && req.files.header_image[0]) {
            newProject.headerImage = {
                url: req.files.header_image[0].path,
                public_id: req.files.header_image[0].filename
            }
        }

        // If attachments are uploaded, save their urls and public_ids
        if (req.files && req.files.attachments) {
            newProject.attachments = req.files.attachments.map(file => ({
                url: file.path,
                public_id: file.filename
            }))
        }

        const createdProject = await Project.create(newProject)
        res.redirect('/home/dashboard')

    } catch(error) {
        console.error('Error creating project:', error)
    }
})

// Display all projects
router.get('/:id', async(req,res)=>{
    try{
        // Validate project ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.send('Invalid project ID')
        }
        const foundProject = await Project.findById(req.params.id).populate('creator')
        res.render('project/project-details.ejs', {project: foundProject})
    }catch(error){
        console.error('roject not found', error)
    }
})

// Display the edit form for a project
router.get('/:id/edit', async(req,res)=>{
    try{
        const project = await Project.findById(req.params.id)
        if(project.creator.toString() !== req.session.user._id){
            return res.send('not authorized')
        }
        res.render('project/project-edit.ejs', {project, user: req.session.user})
    }catch(error){
        console.error('server error:', error)
    }
})


// Update a project
router.put('/:id', uploadProjectFiles, async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, date, category, tags } = req.body
        
        const currentProject = await Project.findById(id)
        
        const updateData = {title, description, date, category, tags,
            attachments: currentProject.attachments || []
        }

        // If header image is uploaded, update its url and public_id
        if (req.files && req.files.attachments) {
            updateData.attachments = [
                ...updateData.attachments, // Combine existing attachments with new ones
                ...req.files.attachments.map(file => ({
                    url: file.path,
                    public_id: file.filename
                }))
            ]
        }

        await Project.findByIdAndUpdate(id, updateData)
        res.redirect(`/project/${id}`)
        
    } catch (error) {
        console.error('Update error:', error)
    }
})

// Delete a project
router.delete('/:id', async(req, res) => {
    // Validate project ID
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.send('Invalid ID')
        }
        await Project.findByIdAndDelete(req.params.id)
        res.redirect('/home/dashboard')
    } catch (error) {
        console.log(error)
        res.send('Failed to delete project')
    }
})

// Delete an attachment from a project
router.delete('/:projectId/attachment/:attachmentIndex', async(req,res)=>{
    try{
        const {projectId, attachmentIndex} = req.params
        const project = await Project.findById(projectId)

        // Validate project ID
        if(!project){
            return res.send("Project not found")
        }

        // Remove the attachment at the specified index
        project.attachments.splice(attachmentIndex, 1) 
        await project.save()

        res.redirect(`/project/${projectId}/edit`)
    }catch(error){
        console.error('Failed to delete attachment', error)
    }
})

module.exports = router