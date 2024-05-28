// Cargar el módulo de express
import express from 'express'
import mysql from 'mysql'
import path from 'path'

const configConnection = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}

const connection = mysql.createConnection(configConnection)

const router = express.Router()

router.get('/', (req, res) => {
    const select = "SELECT * FROM agenda"
    connection.query(select, (err, result, fields) => {
        if (err) throw err
        res.render('index', {title: 'Mis contactos', contactos: result})
    })
    // res.send('Welcome')
})

router.get('/formulario', (req, res) => {
    res.render('formulario', {title: 'Añadir contacto', id: 0})
    // res.send('Seré dinámico algún día')
})

router.post('/insert', (req, res) => {
    const {nombre, apellido, tel, tipo} = req.body
    const insert = `INSERT INTO agenda (nombre, apellido, telefono, tipo) VALUES ('${nombre}', '${apellido}', '${tel}', '${tipo}')`
    connection.query(insert, (err, result, fields) => {
        if (err) throw err
        res.redirect('/')
    })
    // console.log(req.body)
    // res.send('Seré dinámico algún día') esto generaba el error
})

router.get('/borrar/:id', (req, res) => {
    const { id } = req.params
    const borrarLinea  = `DELETE FROM agenda WHERE id = ${id}`
    connection.query(borrarLinea, (err, result, fields) => {
        if (err) throw err
        res.redirect('/')
    })
})

router.get('/editar/:id/:nombre/:apellido/:telefono/:tipo', (req, res) => {
    // console.log(req.params) devuelve los valores
    const contacto = {
        ...req.params
    }
    // console.log(contacto)
    res.render('formulario', { title: "Editar Contacto", id: 1, contacto: contacto})
})


router.post('/update', (req, res) => {
    const {id, nombre, apellido, tel, tipo} = req.body
    const update = `UPDATE agenda SET nombre = '${nombre}', apellido = '${apellido}', telefono = '${tel}', tipo = '${tipo}' WHERE id = '${id}'`;
    connection.query(update, (err, result, fields) => {
        if (err) throw err
        res.redirect('/')
    })
})

export default router 
