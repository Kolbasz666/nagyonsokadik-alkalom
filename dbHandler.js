const { Sequelize, DataTypes } = require('sequelize')
const dbHandler = new Sequelize('data', 'root', '', {
    host: '127.1.1.1',
    dialect: 'mysql'
})
const userTable = dbHandler.define('users',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        //defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

const artworkTable = dbHandler.define('artworks',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    value:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

exports.user = userTable
exports.artwork = artworkTable
