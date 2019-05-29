/* eslint-disable no-path-concat */
const serialport = require('serialport')
const fork = require('child_process').fork
const conputeData = require('../compute').conputeData
const moment = require('moment')
const { variables } = require('../global_variables')
const { insertSerialprotData } = require('../database')
const except = ['SOC', 'MALS', 'Bluetooth-Incoming-Port', 'usbmodem14411']

let press_temp = []
let temp = 10000 // 计数器 用于批量插入数据

const sendDataToSave = () => {
  insertSerialprotData({ press: press_temp })
  press_temp = []
  temp = 10000
}

// 记录已连接的串口
let connectPorts = {}
// 记录链接失败的串口
let errorPorts = {}
// 手动配置的串口信息
let configPorts = []

// // 判断是否为系统自带串口
const checkPort = comName => {
  // 已连接过的
  if (connectPorts[comName] || errorPorts[comName]) return true
  // 系统接口
  for (let item of except) {
    if (comName.indexOf(item) > -1) return true
  }
  if (configPorts.length > 0 && configPorts.indexOf(comName) < 0) return true
  return false
}

// 查询所有可用的串口链接, 并自动链接
const availablePorts = () => {
  serialport.list((_, list) => {
    list.forEach(doc => {
      const { comName } = doc
      // 去除自带串口
      if (checkPort(comName)) return

      // 启动子线程去链接串口
      let child = fork(__dirname + '/child.js', [comName])
      child.on('message', msg => {
        if (msg.type === 'success') connectPorts[comName] = { isOpen: false, child }
        if (msg.type === 'error') {
          // 关闭进程
          child.kill()
          // 异常关闭的串口，如果是有效的串口 delete 后，自动重新连接
          if (connectPorts[comName]) delete connectPorts[comName]
          else errorPorts[comName] = { msg: msg.msg, time: Date.now() }
        }
        // 接收到校验通过后的串口数据
        if (msg.type === 'saveData') {
          const { sensorData_AD, sensorData, posturedata } = msg

          // 给每条数据添加上传时间
          const currentTime = Date.now()
          sensorData_AD.push(currentTime)
          sensorData.push(currentTime)
          posturedata.push(currentTime)
          // 计算步态和显示信息
          conputeData(sensorData)
          // 储存原始数据
          saveData(msg)
        }
      })
    })
  })
}

// 保存串口数据到数据库
const saveData = ({ sensorData_AD, sensorData, posturedata }) => {
  let pressObj = {}
  pressObj['$record_id'] = variables.recordInfo.record_time
  pressObj['$lr'] = sensorData[0]
  pressObj['$num_order'] = sensorData[1]
  pressObj['$current_time'] = sensorData_AD[44]
  for (let i = 2; i < 44; i++) {
    pressObj[`$force${i - 1}`] = sensorData[i]
  }
  press_temp.push(pressObj)

  temp--
  if (temp <= 0) sendDataToSave()
}

//  // 打开系统即查询一下串口信息 并 设置定时任务
const findPort = () => {
  const connectSize = Object.keys(connectPorts).length
  if (connectSize >= 2) return
  // 一分钟内的错误错口不予连接
  for (let key in errorPorts) {
    if (Date.now() - errorPorts[key].time > 1000 * 10) delete errorPorts[key]
  }
  availablePorts()
}
findPort()
setInterval(findPort, 5000)

// 打开串口
exports.openSerialport = cb => {
  const connectSize = Object.keys(connectPorts).length
  if (connectSize < 2) return cb('串口未链接，请检查')
  for (let key in connectPorts) {
    const { child, isOpen } = connectPorts[key]
    if (isOpen) return cb('串口已打开, 请勿重复操作')
    connectPorts[key].isOpen = true
    child.send({ type: 'open' })
  }
  cb()
}

// 关闭串口
exports.closeSerialport = cb => {
  for (let key in connectPorts) {
    const { child, isOpen } = connectPorts[key]
    if (!isOpen) return cb('串口已关闭, 请勿重复操作')
    connectPorts[key].isOpen = false
    child.send({ type: 'close' })
  }
  cb()
}

exports.setSerialport = config => {
  configPorts = config
  let keys = Object.keys(connectPorts)
  // 关闭所有串口
  for (let i = 0; i < keys.length; i++) {
    connectPorts[keys[i]].child.kill()
  }
  connectPorts = {}
  findPort()
}

exports.querySerialportList = cb => {
  serialport.list((_, list) => {
    let result = []
    for (let index = 0; index < list.length; index++) {
      const { comName } = list[index]
      let flag = false
      for (let item of except) {
        if (comName.indexOf(item) > -1) flag = true
      }
      if (!flag) result.push(comName)
    }
    cb(result)
  })
}

exports.sendDataToSave = sendDataToSave
