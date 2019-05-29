const { adminDB, patientDB, recordDB, pressDB, wifiDB } = require('./nedb')
const moment = require('moment')

exports.insertRecord = ({ shoe_size }, callback) => {
  let record_time = moment().format('YYYY-MM-DD HH:mm:ss')
  let start_time = Date.now()
  recordDB.insert({ record_time, shoe_size, start_time }, callback)
}

exports.removeRecords = (ids, callback) => {
  recordDB.remove({ _id: { $in: ids } }, { multi: true }, callback)
  pressDB.remove({ recordID: { $in: ids } }, { multi: true })
}

exports.insertSerialprotData = ({ press }) => {
  if (press.length) {
    let objs = []
    for (let p of press) {
      let forces = []

      for (let i = 1; i < 43; i++) {
        forces.push(p[`$force${i}`])
      }
      let obj = {
        recordID: p['$record_id'],
        LorR: p['$lr'],
        numOrder: p['$num_order'],
        currentTime: p['$current_time'],
        forces
      }
      objs.push(obj)
    }
    pressDB.insert(objs)
  }
  // if (pressAD.length) insertData(`insert into press_ad VALUES(NULL, $record_id, $lr, $num_order, $current_time, ${forceValu.join(',')})`, pressAD)
  // if (posture.length) insertData('insert into posture VALUES(NULL, $record_id, $lr, $num_order, $current_time, $acc_x, $acc_y, $acc_z, $angle_x, $angle_y, $angle_z, $mag_x, $mag_y, $mag_z)', posture)
}

exports.saveGait = ({ recordId, gaitInfo, copInfo }) => {
  recordDB.update({ _id: recordId }, { $set: { gaitInfo, copInfo } }, () => {
    // recordDB.findOne({ _id: recordId }, (_, doc) => {
    //   sendSynStatisticsData(doc)
    // })
  })
}

exports.insertWifiData = (data) => {
  wifiDB.insert(data, function(err, newdoc){
    if(err) console.log('insertWifiData======', err)
  })
}
