const express = require("express")
const router = express.Router()
const actions = require('../data/helpers/actionModel')

router.get('/actions/:id', checkActionId(), async (req,res) => {
    try {
        const action = await actions.get(req.params.id)
        res.json(action)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error getting the action"
        })
    }
})

router.post('/actions', checkRequestBody(), async (req,res) => {
    try {
        const newAction = await actions.insert(req.body)
        res.json(newAction)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error posting the action"
        })
    }
})

router.put('/actions/:id', checkActionId(), checkRequestBody(), async (req,res) => {
    try {
        if (req.body.completed !== true && req.body.completed !== "false") {
            return res.status(400).json({
                message: "Please send a proper completed status"
            })
        }
        if (req.body.completed === "false") {
            req.body.completed = false
        }
        const updatedAction = await actions.update(req.params.id, req.body)
        res.json(updatedAction)
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error updating the action"
        })
    }
})

router.delete('/actions/:id', checkActionId(), async (req,res) => {
    try {
        const success = await actions.remove(req.params.id)
        if (!success) {
            return res.json({
                message: "The action could not be deleted"
            })
        }
        res.json({
            message: "The action was successfully deleted"
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            message: "There was an error deleting the action"
        })
    }
})

function checkActionId() {
    return async (req,res,next) => {
        try {
            const action = await actions.get(req.params.id)
            if (!action) {
                return res.status(404).json({
                    message: "The action does not exist"
                })
            }
            next()
        } catch(err) {
            console.log(err)
            res.status(500).json({
                message: "There was an error getting the action"
            })
        }
    }
}

function checkRequestBody() {
    return async (req,res,next) => {
        try {
            if (req.method === "POST" && (
                !req.body.project_id || 
                !req.body.description || 
                !req.body.notes
                )) {
                return res.status(400).json({
                    message: "Please provide a project id, description and notes"
                })
            }
            if (req.method === "POST" && req.body.description.length > 128) {
                return res.status(400).json({
                    message: "Descriptions can be no longer than 128 characters"
                })
            }
            if (req.method === 'PUT' && !req.body.completed) {
                return res.status(400).json({
                    message: "Please provide a completed status"
                })
            }
            next()
        } catch(err) {
            res.status(500).json({
                message: "There was an error with your requrest"
            })
        }

        
    }
}

module.exports = router