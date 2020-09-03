const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const { decodeBase64 } = require("bcryptjs")
const KnexSessionStore = require("connect-session-knex")(session)

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/auth-router.js');


const server = express()
const port = process.env.PORT || 4000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
    resave: false, // avoid recreating sessions that haven't changed.
    saveUninitialized: false, // to comply with GDPR laws. Prevents saving cookies without users consent.
    secret: "keep it secreat, keep it safe", // cryptographically sign the cookie.
    store: new KnexSessionStore({
        knex: db, // configured instance of knex.
        createtable: true, // if the sessions tables doesn't exists, create it automatically.
    }),
}))

server.use("/api/users", usersRouter)
server.use("/api/uth", authRouter)

server.use((err, req, res, next) => {
    console.log(err)

    res.status(500).json({
        message: "Something went wrong.",
    })
})

server.listen(port, () => {
    console.log(`Server listening at http://localhost${port}`)
})