const express = require("express")
const router = express.Router()
const actions = require('../data/helpers/actionModel')

router.get('/actions/:id', checkActionId(), (req,res) => {
    actions.get(req.params.id)
        .then(action => {
            res.json(action)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error getting the action"
            })
        })
})

router.post('/actions', checkRequestBody(), (req,res) => {
    actions.insert(req.body)
        .then(action => {
            res.json(action)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error posting the action"
            })
        })
})

router.put('/actions/:id', checkActionId(), checkRequestBody(), (req,res) => {
    if (req.body.completed !== true && req.body.completed !== "false") {
        res.status(400).json({
            message: "Please send a proper completed status"
        })
    }
    if (req.body.completed === "false") {
        req.body.completed = false
    }
    actions.update(req.params.id, req.body)
        .then(action => {
            res.json(action)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error updating the action"
            })
        })
})

router.delete('/actions/:id', checkActionId(), (req,res) => {
    actions.remove(req.params.id)
        .then(success => {
            if (success) {
                res.json({
                    message: "The action was successfully deleted"
                }) 
            } else {
                res.json({
                    message: "The action could not be deleted"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "There was an error deleting the action"
            })
        })
})

function checkActionId() {
    return (req,res,next) => {
        actions.get(req.params.id)
            .then(action => {
                if (!action) {
                    return res.status(404).json({
                        message: "The action does not exist"
                    })
                }
                next()
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "There was an error getting the action"
                })
            })
    }
}

function checkRequestBody() {
    return (req,res,next) => {
        if (req.method === "POST" && (
            !req.body.project_id || 
            !req.body.description || 
            !req.body.notes
            )) {
            return res.status(400).json({
                message: "Please provide a project id, description and notes"
            })
        } else if (req.method === "POST" && req.body.description.length > 128) {
            return res.status(400).json({
                message: "Descriptions can be no longer than 128 characters"
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