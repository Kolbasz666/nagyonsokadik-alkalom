const express = require('express')
const dbHandler = require('./dbHandler')
const JWT = require('jsonwebtoken')

require('dotenv').config()

const router = express.Router()
//const token = "ez lesz a token..."
const SECRET = process.env.SECRET
const TIMEOUT = process.env.TIMEOUT

router.post('/registration', async (req, res) => {
    if (!req.body?.username) {
        return res.status(400).json({ 'message': 'Hiányzó felhasználónév' }).end()
    }
    if (!req.body?.password) {
        return res.status(400).json({ 'message': 'Hiányzó jelszó' }).end()
    }

    const oneUser = await dbHandler.user.findOne({
        where: {
            username: req.body.username
        }
    })

    if (oneUser) {
        return res.status(409).json({ 'message': 'Már létezik ilyen felhasználó' }).end()
    }

    await dbHandler.user.create({
        username: req.body.username,
        password: req.body.password
    })

    res.status(201).json({ message: 'Sikeres létrehozás' }).end()
})

router.post('/login', async (req, res) => {
    if (!req.body?.username) {
        return res.status(400).json({ 'message': 'Hiányzó felhasználónév' }).end()
    }
    if (!req.body?.password) {
        return res.status(400).json({ 'message': 'Hiányzó jelszó' }).end()
    }

    const oneUser = await dbHandler.user.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    })

    if (!oneUser) {
        return res.status(409).json({ 'message': 'Nem létezik ilyen felhasználó' }).end()
    }

    //token generálás
    const token = JWT.sign({username: oneUser.username, id: oneUser.id},SECRET,{expiresIn: TIMEOUT})

    res.status(200).json({ message: 'Sikeres bejelentkezés', token }).end()
})

router.get('/users', Auth(), async (req, res) => {
    //const data = { username: req.username, id: req.id }
    const data = { "message":'ez itt csak akkor látható ha bejelentkeztél'}
    res.json(data).end()
})

function Auth() {
    return (req, res, next) => {
        const auth = req.headers.authorization
        try {
            const decodedToken = JWT.verify(auth,SECRET)
            //console.log(decodedToken.username)
            req.username = decodedToken.username
            req.id = decodedToken.id
            next()
        } catch (error) {
            return res.status(400).json({ 'message': 'hibás/nem létező token' }).end()
        }     
    }
}

module.exports = router