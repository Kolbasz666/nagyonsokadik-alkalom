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
        return res.status(409).json({ 'message': "A felhasználónév már foglalt" }).end()
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
    const token = JWT.sign({ username: oneUser.username, id: oneUser.id }, SECRET, { expiresIn: TIMEOUT })

    res.status(200).json({ message: 'Sikeres bejelentkezés', token }).end()
})

/*router.get('/users', Auth(), async (req, res) => {
    //const data = { username: req.username, id: req.id }
    const data = { "message": 'ez itt csak akkor látható ha bejelentkeztél' }
    res.json(data).end()
})*/

router.get('/artworks', async (req, res) => {
    res.json(await dbHandler.artwork.findAll()).end()
})

router.post('/artworks', Auth(), async (req, res) => {
    if (!req.body?.title) {
        return res.status(400).json({ 'message': 'Hiányzó cím' }).end()
    }
    if (!req.body?.value) {
        return res.status(400).json({ 'message': 'Hiányzó érték' }).end()
    }

    const oneArt = await dbHandler.artwork.findOne({
        where: {
            title: req.body.title,
            value: req.body.value
        }
    })

    if (oneArt) {
        return res.status(409).json({ 'message': 'Már létezik ilyen műalkotás' }).end()
    }

    await dbHandler.artwork.create({
        title: req.body.title,
        value: req.body.value
    })

    res.status(201).json({ message: 'Sikeres létrehozás' }).end()
})

router.delete('/artworks/:id', Auth(), async (req, res) => {
    const oneArt = await dbHandler.artwork.findOne({
        where: {
            id: req.params.id
        }
    })

    if (!oneArt) {
        return res.status(404).json({ 'message': 'Nem létezik ilyen műalkotás' }).end()
    }

    await dbHandler.artwork.destroy({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: "Műalkotás sikeresen törölve" }).end()
})

function Auth() {
    return (req, res, next) => {
        const auth = req.headers.authorization
        try {
            const decodedToken = JWT.verify(auth, SECRET)
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