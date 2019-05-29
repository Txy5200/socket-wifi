const express = require('express')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || 8898
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const serialportController = require('./controller').router
const bodyParser = require('body-parser')
const cors = require('cors')
require('./socket_server')
// 定义全局变量，供页面使用
global.variables = require('./global_variables').variables

app.prepare().then(() => {
  const server = express()

  server.use('*', cors())
  server.use(bodyParser.urlencoded({ extended: true }))

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.use('/serialport', serialportController)

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
