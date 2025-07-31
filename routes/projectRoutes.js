const router = require('express').Router()
const Project = require('../models/Project')
const isSignedIn = require('../middleware/isSignedIn')

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
    res.render('project/newProject', { user: req.session.user })
})

router.post('/newProject', async (req,res)=>{
    try{
        await Project.create({...req.body, creator: req.session.user._id} )
        res.redirect('/project/all')
    }catch(error){
        console.error(error)
        res.send('Failed to create')
    }
})
router.get('/:id', async(req,res)=>{
    try{
        foundProject = await Project.findById(req.params.id)
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

// //READ
// router.get('/', async(req,res)=>{
//     try{
//         const allProject = await Project.find()
//         res.render('project/allProject.ejs',{allProject})
//     }catch(error){
//         console.log(error)
//     }
// })

// router.get('/:id', async(req,res)=>{
//     try{
//         foundProject = await Project.findById(req.params.id)
//         res.render('project/project-details.ejs')
//     }catch(error){
//         console.log(error)
//     }
// })

module.exports = router