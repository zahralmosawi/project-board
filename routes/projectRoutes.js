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


router.post("/new", uploadProjectFiles, async (req, res) => {
    try {
        const { title, description, date, category, tags } = req.body;

        const newProject = {title, description, date, category, tags, 
            creator: req.session.user._id,
            headerImage: null,
            attachments: []
        }

        if (req.files && req.files.header_image && req.files.header_image[0]) {
            newProject.headerImage = {
                url: req.files.header_image[0].path,
                public_id: req.files.header_image[0].filename
            }
        }

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

router.get('/:id', async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.send('Invalid project ID')
        }
        const foundProject = await Project.findById(req.params.id).populate('creator')
        res.render('project/project-details.ejs', {project: foundProject})
    }catch(error){
        console.log(error)
        res.send('Project not found')
    }
})

router.get('/:id/edit', async(req,res)=>{
    try{
        const project = await Project.findById(req.params.id)
        if(project.creator.toString() !== req.session.user._id){
            return res.send('not authorized')
        }
        res.render('project/project-edit.ejs', {project, user: req.session.user})
    }catch(error){
        console.error(error)
        res.send('server error')
    }
})



router.put('/:id', uploadProjectFiles, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, category, tags } = req.body
        
        const currentProject = await Project.findById(id);
        
        const updateData = {title, description, date, category, tags,
            attachments: currentProject.attachments || []
        }

        if (req.files && req.files.attachments) {
            updateData.attachments = [
                ...updateData.attachments,
                ...req.files.attachments.map(file => ({
                    url: file.path,
                    public_id: file.filename
                }))
            ]
        }

        await Project.findByIdAndUpdate(id, updateData)
        res.redirect(`/project/${id}`)
        
    } catch (error) {
        console.error('Update error:', error);

    }
})

router.delete('/:id', async(req, res) => {
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

router.delete('/:projectId/attachment/:attachmentIndex', async(req,res)=>{
    try{
        const {projectId, attachmentIndex} = req.params
        const project = await Project.findById(projectId)

        //validition
        if(!project){
            return res.send("Project not found")
        }

        project.attachments.splice(attachmentIndex, 1)
        await project.save()

        res.redirect(`/project/${projectId}/edit`)
    }catch(error){
        console.error(error)
        res.send('Failed to delete attachment')
    }
})



module.exports = router