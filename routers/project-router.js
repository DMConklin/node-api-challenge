const express = require("express")
const router = express.Router()
const projects = require('../data/helpers/projectModel')

router.get('/projects/:id', checkProjectId(), async (req,res) => {
    try {
        const project = await projects.get(req.params.id)
        res.json(project)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error retrieving the project"
        })
    }
})

router.get('/projects/:id/actions', checkProjectId(), async (req,res) => {
    try {
        const actions = await projects.getProjectActions(req.params.id)
        res.json(actions)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error retrieving the actions"
        })
    }
})

router.post('/projects', checkRequestBody(), async (req,res) => {
    try {
        const newProject = await projects.insert(req.body)
        res.json(newProject)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error adding your project"
        })
    }
})

router.put('/projects/:id', checkProjectId(), checkRequestBody(), async (req,res) => {
    try {
        if (req.body.completed !== true && req.body.completed !== "false") {
            return res.status(400).json({
                message: "Please send a proper completed status"
            })
        }
        if (req.body.completed === "false") {
            req.body.completed = false
        }
        const updatedProject = await projects.update(req.params.id, req.body)
        res.json(updatedProject)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error updating your project"
        })
    }
})

router.delete('/projects/:id', checkProjectId(), async (req,res) => {
    try {
        const success = await projects.remove(req.params.id)
        if (!success) {
            return res.json({
                message: "The project could not be deleted"
            })
        }
        res.json({
            message: "The project was deleted successfully"
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error while attempting to delete your project"
        })
    }
})

function checkProjectId() {
    return async (req,res,next) => {
        try {
            const project = await projects.get(req.params.id)
            if (!project) {
                return res.status(404).json({
                    message: "The project does not exist"
                })
            }
            next()
        } catch(err) {
            console.log(err)
            res.status(500).json({
                message: "There was an error retrieving the post"
            })
        }
    }
}

function checkRequestBody() {
    return async (req,res,next) => {
        try {
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
        } catch(err) {
            console.log(err)
            res.status(500).json({
                message: "There was an error with your request"
            })
        }
    }
}

module.exports = router