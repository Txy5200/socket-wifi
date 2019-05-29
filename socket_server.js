const net = require('net')
const webClients = require('./socket_web_server').webClients
// Keep track of the chat clients
let clients = []
let clientDataMap = {}
let dataArray = {}

// Start a TCP Server
net.createServer(function (socket) {
  // Identify this client
  socket.name = socket.remoteAddress + ':' + socket.remotePort

  // Put this new client in the list
  clients.push(socket)
  clientDataMap[`${socket.name}`] = []
  // Send a nice welcome message and announce
  socket.write('Welcome ' + socket.name + '\n')
  console.log(socket.name + ' 客户端已经连接')
  //   broadcast(socket.name + " joined the chat\n", socket);

  // Handle incoming messages from clients.
  // 收到数据
  socket.on('data', function (data) {
    // console.log('========================data')
    clientDataMap[socket.name].push(...data)
    formatData(socket.name)
    // broadcast(socket.name + "> " + data, socket);
  })

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    console.log(socket.name + ' 客户端断开连接----')
    clients.splice(clients.indexOf(socket), 1)
    // broadcast(socket.name + " left the chat.\n");
  })

  socket.on('close', function () {
    console.log(socket.name + ' 客户端已关闭----')
    clients.splice(clients.indexOf(socket), 1)
  })
  socket.on('error', function () {
    console.log(socket.name + ' 客户端错误❌----')
    clients.splice(clients.indexOf(socket), 1)
  })
  socket.on('timeout', function () {
    console.log(socket.name + ' 客户端连接超时----')
    clients.splice(clients.indexOf(socket), 1)
  })

  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return
      client.write(message)
    })
    // Log it to the server output too
    process.stdout.write(message)
  }
}).listen(8899)

function formatData(name) {
  if (clientDataMap[name] && clientDataMap[name].length > 8) {
    const data = clientDataMap[name].splice(0, 8)
    // console.log(`${name}:${getAD(data[2], data[3])}`)
    // TODO
    if (!dataArray[name]) {
      dataArray[name] = []
    }

    // dataArray[name].push({ client_name: name, data: getAD(data[2], data[3]) })
    // if (dataArray[name].length >= 500) {
    //   webClients.forEach((client) => {
    //     let data = [...dataArray[name]]
    //     let client_name = name.split(':')[3]
    //     client.emit('send', { client_name: client_name, data: data })
    //   })
    //   dataArray[name] = []
    // }
    // wifippm[name].push(getAD(data[2], data[3]))
    dataArray[name].push(getAD(data[2], data[3]))
    if (dataArray[name].length >= 500) {
      webClients.forEach((client) => {
        let data = [...dataArray[name]]
        let client_name = name.split(':')[3]
        client.emit('send', { client_name: client_name, data: data })
      })
      dataArray[name] = []
    }

    // 调用业务方法
    formatData(name)
  }
}

function getAD(data1, data2) {
  return ((((data2 & 0x1F) * 32 + data1) * 3.3) / 1024).toFixed(3)
}

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 8899\n')
