const bcrypt = require("bcryptjs")

const router = require("express").Router()

const Users = require("../users/users-model")

// async allows app to continue working while hashing specified number of rounds
router.post("/register", async (req, res, next) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash

    try {
        const saved = await Users.add(user)
        res.status(201).json(saved)
    } catch(err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    let { username, password } = req.body
  
    try {
      const user = await Users.findBy({ username }).first()
      if (user && bcrypt.compareSync(password, user.password)) {
        // associates a specific session with this user & this users modifications
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${username}!` })
      } else {
        res.status(401).json({ message: 'invalid creds' })
      }
    } catch (err) {
      next(err)
    }
  })

router.get("/logout", async (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.send("There was a problem logging you out",)
            } else {
                res.end()
            }
        })
    }
}) 

module.exports = router