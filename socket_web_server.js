const server = require('http').createServer()
const io = require('socket.io')(server)
const webClients = []
io.on('connection', client => {
  webClients.push(client)
  // console.log('connect sokect web server')
  client.on('event', data => { /* … */
    // console.log('web socket event============', data)
  })
  // client.emit('send', { msg: 'hi, server' })
  client.on('disconnect', () => { /* … */ })
})
server.listen(8897)

exports.webClients = webClients
