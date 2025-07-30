const router = require('express').Router()
const Project = require('../models/Project')

router.get('/newProject', (req,res) => {
    res.render('project/newProject.ejs')
})
module.exports = router