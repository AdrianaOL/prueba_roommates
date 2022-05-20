const fs = require('fs')
const http = require('http')
const url = require('url')
const { v4: uuidv4 } = require('uuid')
const { getData, deuda } = require('./getdata')
const port = 3000

http
  .createServer(async (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
    let gastos = gastosJSON.gastos
    if (req.url == '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      fs.readFile('index.html', 'utf8', (err, html) => {
        if (err) res.end('archivo html no encontrado')
        else res.end(html)
      })
    }
    if (req.url.startsWith('/roommate') && req.method == 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(fs.readFileSync('roommates.json', 'utf8'))
    }
    if (req.url.startsWith('/roommate') && req.method == 'POST') {
      const roomMatesJson = JSON.parse(
        fs.readFileSync('roommates.json', 'utf8')
      )
      const roomMate = roomMatesJson.roommates
      const user = await getData()
      roomMate.push(user)
      deuda(gastos, roomMate)
      fs.writeFileSync('roommates.json', JSON.stringify(roomMatesJson))
      res.end(JSON.stringify(roomMatesJson))
    }
    if (req.url.startsWith('/gastos') && req.method == 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(fs.readFileSync('gastos.json', 'utf8'))
    }
    if (req.url.startsWith('/gasto') && req.method == 'POST') {
      const roomMatesJson = JSON.parse(
        fs.readFileSync('roommates.json', 'utf8')
      )
      const roomMate = roomMatesJson.roommates
      let body
      req.on('data', (payload) => {
        body = JSON.parse(payload)
      })
      req.on('end', () => {
        nuevoGasto = {
          id: uuidv4().slice(30),
          roommate: body.roommate,
          descripcion: body.descripcion,
          monto: body.monto,
        }
        gastos.push(nuevoGasto)
        deuda(gastos, roomMate)
        fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
        fs.writeFileSync('roommates.json', JSON.stringify(roomMatesJson))
        res.end()
      })
    }
    if (req.url.startsWith('/gasto') && req.method == 'PUT') {
      const { id } = url.parse(req.url, true).query
      const roomMatesJson = JSON.parse(
        fs.readFileSync('roommates.json', 'utf8')
      )
      const roomMate = roomMatesJson.roommates
      let body
      req.on('data', (payload) => {
        body = JSON.parse(payload)
        body.id = id
        
      })
      
      req.on('end', () => {
        gastosJSON.gastos = gastos.map((b) => {
          if (b.id == body.id) {
            return body
          }
          return b
          
        })
        deuda(gastos, roomMate)
        fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
        fs.writeFileSync('roommates.json', JSON.stringify(roomMatesJson))
        res.end()
      })
    }
    if (req.url.startsWith('/gasto') && req.method == 'DELETE') {
      const { id } = url.parse(req.url, true).query
      gastosJSON.gastos = gastos.filter((g) => g.id !== id)
      fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
      res.end()
    }
  })
  .listen(port, () => {
    console.log(`servidor corriendo en: http://localhost:${port}`)
  })
