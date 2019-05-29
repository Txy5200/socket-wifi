const { adminDB, patientDB, recordDB, pressDB } = require('./nedb')
const moment = require('moment')

exports.initDataBase = () => {
  // 创建默认管理员
  adminDB.findOne({ username: 'admin' }, (_, doc) => {
    if (!doc) adminDB.insert({ username: 'admin', password: '123456' })
  })
}

exports.resetAdmin = ({ oldPwd, newPwd }, callback) => {
  adminDB.findOne({ username: 'admin' }, (_, admin) => {
    if (admin.password != oldPwd) return callback('密码不对')
    adminDB.update({ username: 'admin' }, { $set: { password: newPwd } })
    callback()
  })
}

exports.findUser = ({ username, password }, callback) => {
  adminDB.findOne({ username, password }, callback)
}

exports.upsertUser = ({ name, certificate_no, height, weigth, shoe_size }, callback) => {
  patientDB.update({ certificate_no }, { name, certificate_no, height, weigth, shoe_size }, { upsert: true }, callback)
}

exports.insertRecord = ({ certificate_no, shoe_size }, callback) => {
  let start_time = Date.now()
  recordDB.insert({ certificate_no, start_time, shoe_size }, callback)
}

exports.removeRecords = (ids, callback) => {
  recordDB.remove({ _id: { $in: ids } }, { multi: true }, callback)
  pressDB.remove({ recordID: { $in: ids } }, { multi: true })
}

exports.insertSerialprotData = ({ press }) => {
  if (press.length) {
    let objs = {
      recordID: moment().format('YYYY-MM-DD HH:mm:ss'),
      pressData: []
    }
    for (let p of press) {
      let forces = []

      for (let i = 1; i < 43; i++) {
        forces.push(p[`$force${i}`])
      }
      let obj = {
        LorR: p['$lr'],
        numOrder: p['$num_order'],
        currentTime: p['$current_time'],
        forces
      }
      objs.pressData.push(obj)
    }
    pressDB.insert(objs)
  }
  // if (pressAD.length) insertData(`insert into press_ad VALUES(NULL, $record_id, $lr, $num_order, $current_time, ${forceValu.join(',')})`, pressAD)
  // if (posture.length) insertData('insert into posture VALUES(NULL, $record_id, $lr, $num_order, $current_time, $acc_x, $acc_y, $acc_z, $angle_x, $angle_y, $angle_z, $mag_x, $mag_y, $mag_z)', posture)
}

exports.findRecords = ({ page = 1, limit = 10, keyword }, callback) => {
  page = page * 1
  limit = limit * 1
  let skip = (page - 1) * limit

  const cb = query => {
    recordDB.count(query, function(_, count) {
      recordDB
        .find(query)
        .sort({ start_time: -1 })
        .skip(skip)
        .limit(limit)
        .exec(async function(_, items) {
          let pageInfo = {
            page,
            limit,
            count
          }

          for (let item of items) {
            let pa = await new Promise(function(resolve) {
              patientDB.findOne({ certificate_no: item.certificate_no }, (_, p) => {
                resolve(p)
              })
            })
            item.name = pa && pa.name
          }

          callback(null, { pageInfo, items })
        })
    })
  }

  if (keyword) {
    findPatients({ keyword, limit: 100 }, (_, { items }) => {
      let cers = []
      for (let p of items) cers.push(p.certificate_no)
      let reg = new RegExp(keyword)
      let query = { $or: [{ certificate_no: reg }, { certificate_no: { $in: cers } }] }
      cb(query)
    })
  } else {
    cb({})
  }
}

exports.deleteAllRecord = callback => {
  recordDB.remove({}, { multi: true }, callback)
  pressDB.remove({}, { multi: true })
}

exports.findPatients = ({ page = 1, limit = 10, keyword }, callback) => {
  page = page * 1
  limit = limit * 1
  let skip = (page - 1) * limit
  let query = {}
  if (keyword) {
    let reg = new RegExp(keyword)
    query = { $or: [{ name: reg }, { certificate_no: reg }] }
  }

  patientDB.count(query, (_, count) => {
    patientDB
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec((_, items) => {
        let pageInfo = {
          page,
          limit,
          count
        }
        callback(null, { pageInfo, items })
      })
  })
}

exports.saveGait = ({ recordId, gaitInfo, copInfo }) => {
  recordDB.update({ _id: recordId }, { $set: { gaitInfo, copInfo } }, () => {
    // recordDB.findOne({ _id: recordId }, (_, doc) => {
    //   sendSynStatisticsData(doc)
    // })
  })
}
