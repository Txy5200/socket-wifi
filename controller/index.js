var express = require('express')
var router = express.Router()
// var serialport = require('../serialport')
const { upsertUser, insertRecord, removeRecords, insertSerialprotData, saveGait } = require('../database')
const { openSerialport, closeSerialport } = require('../serialport')
const { variables } = require('../global_variables')
const { initializeCompute } = require('../compute')

let press_temp = []
let temp = 10000 // 计数器 用于批量插入数据

const sendDataToSave = () => {
  insertSerialprotData({ press: press_temp })
  press_temp = []
  temp = 10000
}

router.post('/openPort', function(req, res) {
  openSerialport(err => {
    if (err) {
      // 串口打开失败时
      return res.json({ code: -1, msg: err })
    } else {
      // 设置全局变量
      variables.userInfo = { shoe_size }
      // 初始化计算模块
      initializeCompute()
      return res.json({ code: '200' })
    }
  })

  // 创建或者更新患者信息
  // 插入训练记录
  // insertRecord({ name, certificate_no, shoe_size }, (_, row) => {
  //   if (!row) return cb(null, '创建记录失败', -1)
  //   // 打开串口
  //   openSerialport(err => {
  //     if (err) {
  //       // 串口打开失败时
  //       removeRecords([row._id])
  //       return res.json({ code: -1, msg: err })
  //     } else {
  //       // 设置全局变量
  //       variables.userInfo = { name, certificate_no, height, weigth, shoe_size }
  //       variables.recordInfo = row
  //       // 初始化计算模块
  //       initializeCompute()
  //       return res.json({ code: '200' })
  //     }
  //   })
  // })
})

router.post('/closePort', function(req, res) {
  closeSerialport(err => {
    if (err) res.json({ code: -1, msg: err })
    res.json({ code: '200' })

    // 结束时，保存缓存里的数据
    sendDataToSave()
    // 在记录中存储步态指标
    // saveGait({ recordId: variables.recordInfo._id, gaitInfo: variables.gaitInfo, copInfo: variables.copInfo })
  })
})

// 保存串口数据到数据库
const saveData = ({ sensorData_AD, sensorData, posturedata }) => {
  let pressObj = {}
  // pressObj['$record_id'] = variables.recordInfo._id
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

module.exports = { saveData, router }
