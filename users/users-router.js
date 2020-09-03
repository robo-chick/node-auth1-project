const router = require("express").Router()
// import restricted middelware
const restricted = require("../auth/restricted-middleware")

const Users = require("./users-model")

// ad restricted middelware to check for valid session before granting request. If restricted doesn't see the session on the req object it will end the chain, if it does see it next will be called and the request will continue on to find the users and return them.
router.get("/", restricted, (req, res) => {
    Users.find()
        .then((users) => {
            res.json(users)
        })
        .catch((err) => res.send(err))
})

module.exports = router