const router = require('express').Router()
const Project = require('../models/Project')
const isSignedIn = require('../middleware/isSignedIn')
const cloudinary  = require("../config/cloudinary")
const upload = require('../middleware/upload')
const mongoose = require('mongoose')

router.use(isSignedIn)

router.get('/all', async (req,res)=>{
    try{
        const projects = await Project.find({creator: req.session.user._id})
        res.render('project/allProjects',{projects, user: req.session.user})
    }catch(error){
        console.error(error)
        res.send('server error')
    }
})

//Display the form to add
router.get('/new', (req,res) => {
    res.render('project/newProject')
})

router.post('/new', upload.array("attachments"), async (req,res)=>{
    try{
        const {title, description, date, category, tags} = req.body
        
        let attachments = []
        if (req.files && req.files.length > 0) {
            attachments = req.files.map(file => ({
                url: file.path || '',
                public_id: file.filename
            }))
        }

        const newProject = new Project({title, description, date, category, tags, creator: req.session.user._id, attachments})
        await newProject.save()

        res.redirect('/project/all')
    }catch(error){
        console.error(error)
        res.send('Failed to create project')
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

router.put('/:id', upload.array("attachments"), async(req,res)=>{
    try{
        const{id} = req.params
        const {title, description, date, category, tags} = req.body
        const updatedProject = {title, description, date, category, tags}

        if(req.files && req.files.length > 0){
            updatedProject.attachments = [
                ...(await Project.findById(id)).attachments || [], 
                ...req.files.map(file => ({  
                    url: file.path,
                    public_id: file.filename
                }))
            ]
        }
        await Project.findByIdAndUpdate(id, updatedProject)
        res.redirect('/project/all')
    }catch(error){
        console.error(error)
        res.send('Failed to update project')
    }
})

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.send('Invalid ID')
        }
        await Project.findByIdAndDelete(req.params.id)
        res.redirect('/project/all')
    } catch (error) {
        console.log(error)
        res.send('Failed to delete project')
    }
})

module.exports = router