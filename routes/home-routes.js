const express = require('express')
const router = express.Router()
const Project = require('../models/Project')

router.get('/dashboard', async(req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login')
    }
    const projects = await Project.find({ creator: req.session.user._id })
    res.render('home/dashboard', {
        user: req.session.user,
        projects
    })
})

module.exports = router