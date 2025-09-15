const express = require('express')
const dbHandler = require('./dbHandler')
const JWT = require('jsonwebtoken')

const router = express.Router()

router.post('/registration', async (req,res) => {
    if(!req.body?.username){
        return res.status(400).json({'message':'Hiányzó felhasználónév'}).end()
    }
    if(!req.body?.password){
        return res.status(400).json({'message':'Hiányzó jelszó'}).end()
    }

    const oneUser = await dbHandler.user.findOne({
        where:{
            username: req.body.username
        }
    })

    if(oneUser){
        return res.status(409).json({'message':'Már létezik ilyen felhasználó'}).end()
    }

    await dbHandler.user.create({
        username: req.body.username,
        password: req.body.password
    })

    res.status(201).json({message: 'Sikeres létrehozás'}).end()
})

router.post('/login', async (req,res) => {
    if(!req.body?.username){
        return res.status(400).json({'message':'Hiányzó felhasználónév'}).end()
    }
    if(!req.body?.password){
        return res.status(400).json({'message':'Hiányzó jelszó'}).end()
    }

    const oneUser = await dbHandler.user.findOne({
        where:{
            username: req.body.username
        }
    })

    if(!oneUser){
        return res.status(409).json({'message':'Nem létezik ilyen felhasználó'}).end()
    }

    //token generálás
    const token = "ez lesz a token..."

    res.status(200).json({message: 'Sikeres bejelentkezés', token}).end()
})





module.exports = router