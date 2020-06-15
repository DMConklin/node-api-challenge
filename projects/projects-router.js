const express = require("express")
const router = express.Router()
const projects = require('../data/helpers/projectModel')
const mappers = require('../data/helpers/mappers')

router.get('/projects/:id', (req,res) => {
    projects.get(req.params.id)
        .then(project => {
            if (!project) {
                return res.status(404).json({
                    message: "The project does not exis"
                })
            }
            res.json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error retrieving the project"
            })
        })
})

router.get('/projects/:id/actions', checkProjectId(), (req,res) => {
    projects.getProjectActions(req.params.id)
        .then(actions => {
            res.json(actions)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error retrieving the actions"
            })
        })
})

router.post('/projects', checkRequestBody(), (req,res) => {
    projects.insert(req.body)
        .then(post => {
            res.json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error adding your project"
            })
        })
})

router.put('/projects/:id', checkProjectId(), checkRequestBody(), (req,res) => {
    if (req.body.completed !== true || req.body.completed !== "false") {
        res.status(400).json({
            message: "Please send a proper completed status"
        })
    }
    if (req.body.completed === "false") {
        req.body.completed = false
    }
    projects.update(req.params.id, req.body)
        .then(project => {
            res.json(project)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error updating your project"
            })
        })
})

router.delete('/projects/:id', checkProjectId(), (req,res) => {
    projects.remove(req.params.id)
        .then(success => {
            if (success) {
                res.json({
                    message: "The project was deleted successfully"
                })
            } else {
                res.json({
                    message: "Your project could not be deleted"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error while attempting to delete your project"
            })
        })
})

function checkProjectId() {
    return (req,res,next) => {
        projects.get(req.params.id)
            .then(project => {
                if (project) {
                    next()
                } else {
                    res.status(404).json({
                        message: "The project does not exist"
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "There was an error retrieving the post"
                })
            })
    }
}

function checkRequestBody() {
    return (req,res,next) => {
        console.log(req.method)
        if (req.method === "POST" && (!req.body.name || !req.body.description)) {
            return res.status(400).json({
                message: "Please provide a name and description"
            })
        }
        if (req.method === 'PUT' && !req.body.completed) {
            return res.status(500).json({
                message: "Please provide a completed status"
            })
        }
        next()
    }
}

module.exports = router