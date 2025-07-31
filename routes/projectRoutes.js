const router = require('express').Router()
const Project = require('../models/Project')
const isSignedIn = require('../middleware/isSignedIn')
const {cloudinary, upload} = require("../config/cloudinary")

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
router.get('/newProject', (req,res) => {
    res.render('project/newProject')
})

router.post('/newProject', upload.single("attachments"),async (req,res)=>{
    try{

        const {title, description, date, attachments, category, tags} = req.body

        const newProject = new Project({
            title,
            description,
            date,
            category,
            tags,
            creator: req.session.user._id,
            attachments: req.file?.path || null
        })

        await newProject.save()

        res.redirect('/project/all')
    }catch(error){
        console.error(error)
        res.send('Failed to create')
    }
})
router.get('/:id', async(req,res)=>{
    try{
        foundProject = await Project.findById(req.params.id).populate('creator')
        res.render('project/project-details.ejs')
    }catch(error){
        console.log(error)
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

router.put('/:id', async(req,res)=>{
    try{
        await Project.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/project/all')
    }catch(error){
        console.error(error)
        res.send('failed to update')
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id)
        res.redirect('/project/all')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router