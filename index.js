const fs = require('fs')
const http = require('http')
const url = require('url')
const { v4: uuidv4 } = require('uuid')
const getData = require('./getdata')

const port = 3000

http
  .createServer(async (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'))
    let gasto = gastosJSON.gastos
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
      fs.writeFileSync('roommates.json', JSON.stringify(roomMatesJson))
    }
    if (req.url.startsWith('/gastos') && req.method == 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(fs.readFileSync('gastos.json', 'utf8'))
    }
    if (req.url.startsWith('/gasto') && req.method == 'POST') {
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
        gasto.push(nuevoGasto)
        fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
        res.end()
      })
    }
    if (req.url.startsWith('/gasto') && req.method == 'PUT') {
      const { id } = url.parse(req.url, true).query
      let body
      req.on('data', (payload) => {
        body = JSON.parse(payload)
        body.id = id
      })
      req.on('end', () => {
        gastosJSON.gastos = gasto.map((b) => {
          if (b.id == body.id) {
            return body
          }
          return b
        })
        fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
        res.end()
      })
    }
    if (req.url.startsWith('/gasto') && req.method == 'DELETE') {
      const { id } = url.parse(req.url, true).query
      gastosJSON.gastos = gasto.filter((g) => g.id !== id)
      fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON))
      res.end()
    }
  })
  .listen(port, () => {
    console.log(`servidor corriendo en: http://localhost:${port}`)
  })
  data.results[0].name



  