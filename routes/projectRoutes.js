const router = require('express').Router()
const Project = require('../models/Project')

//Display the form to add
router.get('/newProject', (req,res) => {
    res.render('project/newProject.ejs')
})
router.post('/newProject', async (req,res)=>{
    try{
        await Project.create(req.body)
        res.redirect('/project/newProject')
    }catch(error){
        console.log(error)
    }
})
//READ
router.get('/', async(req,res)=>{
    try{
        const allProject = await Project.find()
        res.render('project/allProject.ejs',{allProject})
    }catch(error){
        console.log(error)
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
module.exports = router