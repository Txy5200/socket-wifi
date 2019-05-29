import moment from 'moment'
import { ERROR_MESSAGE } from '../config'
import { provinces } from '../config/provinces'
import { roles } from '../config/roles'
import crypto from 'crypto'

export const readJsonKey = (key, json, fkey, tKey) => {
  return foreachJsonKey(key, json, fkey, tKey)
}

export const formatArrayToJson = array => {
  return foreachArrayKey(array)
}

export const isEmptyObject = json => {
  for (let key in json) {
    return false
  }
  return true
}

const foreachArrayKey = (array = []) => {
  let obj = {}
  for (let json of array) {
    let { key, childs } = json
    delete json.key
    delete json.childs
    obj[key] = {}
    for (let attr in json) {
      obj[key][`${key}#${attr}`] = json[attr]
    }
    obj[key] = Object.assign({}, obj[key], foreachArrayKey(childs))
  }
  return obj
}

const foreachJsonKey = (oldkey, json, fkey, tKey) => {
  if (oldkey.indexOf(`${oldkey}#`) === 0) return null
  let obj = { key: oldkey }
  for (let key in json) {
    let one = json[key]
    if (key.indexOf(`${oldkey}#`) === 0) {
      obj[key.replace(`${oldkey}#`, '')] = one
    } else {
      if (obj.childs) {
        obj.childs.push(foreachJsonKey(key, one, fkey, tKey))
        continue
      }
      obj.childs = [foreachJsonKey(key, one, fkey, tKey)]
    }
  }
  let middleObj = obj[fkey]
  obj[fkey] = obj[tKey]
  if (!obj[tKey]) {
    delete obj[fkey]
  }
  obj[tKey] = middleObj
  if (!middleObj) {
    delete obj[tKey]
  }
  return obj
}

export const getAgeByBirthday = birthday => {
  if (!birthday) return ''
  let days = moment().diff(moment(birthday), 'day')
  if (days < 1) {
    let hours = moment().diff(moment(birthday), 'h')
    return `${hours}小时`
  }
  let months = moment().diff(moment(birthday), 'month')
  if (months < 1) return `${days}天`
  if (months < 12) {
    let d = moment()
      .add(months * -1, 'month')
      .diff(moment(birthday), 'day')
    if (d === 0) return `${months}月`
    return `${months}月${d}天`
  }
  let years = moment().diff(moment(birthday), 'year')
  if (years < 7) {
    let y = moment()
      .add(years * -1, 'year')
      .diff(moment(birthday), 'month')
    if (y === 0) return `${years}岁`
    return `${years}岁${months % 12}月`
  }
  return `${years}岁`
}

// 格式化钱 分->元
export const formatMoney = money => {
  if (money === undefined) return ''
  return (money / 100).toFixed(2)
}

// 格式化钱 分->元
export const formatMoneyF2Y = money => {
  if (money === undefined) return 0
  return Math.round(money * 100)
}

// 限制只能输入金额
export const limitMoney = money => {
  let value = ''
  value = money.replace(/[^\d.]/g, '')
  value = value.replace(/^\./g, '')
  value = value
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  let valus = value.split('.')
  if (valus[1] && valus[1].length > 2) value = valus[0] + '.' + valus[1].substr(0, 2)
  return value
}

export const createTradeNo = () => {
  let sec = moment().format('YYYYMMDDHHmmsss')
  let r2 = (Math.random() + '').substr(4, 3)
  return sec + r2
}

// 截取字符串长度
export const cutdownStr = (str = '', len = 0) => {
  if (str.length > len) {
    str = str.substr(0, len) + '...'
  }
  return str
}

// 检查是否是字母和数字
export const checkLetterAndNumber = str => {
  let reg = /^[0-9a-zA-Z]+$/g
  return reg.test(str)
}

// 验证手机号
export const checkPhoneNumber = phone => {
  const r = /(1([3-9]))\d{9}/
  return r.test(phone) && phone.length === 11
}

// 判断身份证号码格式
export const checkIdCard = code => {
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  var tip = ''
  var pass = true

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = '身份证号格式错误'
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length === 18) {
      code = code.split('')
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      var last = parity[sum % 11]
      // console.log('last====', last, code[17])
      if (last + '' !== code[17] + '') {
        tip = '校验位错误'
        pass = false
      }
    }
  }
  return { pass, tip }
}

export const formatMenuList = (parentId, array, oldIds = []) => {
  let fns = []
  for (let obj of array) {
    if (obj.parent_function_menu_id === parentId) {
      if (oldIds.indexOf(parentId) === -1) {
        obj.children = formatMenuList(obj.function_menu_id, array, [...oldIds, parentId])
      }
      fns.push(obj)
    }
  }
  return fns.sort((a, b) => {
    if (a.function_menu_id > b.function_menu_id) return 1
    return -1
  })
}

export const getUnHasMenuList = (list = [], allMenus = []) => {
  let array = []
  for (let obj of allMenus) {
    let has = false
    for (let item of list) {
      if (obj.function_menu_id === item.function_menu_id) {
        has = true
        break
      }
    }
    if (!has) {
      array.push(obj)
    }
  }
  let ids = {}
  let fns = []
  for (let obj of array) {
    if (ids[obj.function_menu_id]) continue
    ids[obj.function_menu_id] = obj.function_menu_id
    fns.push(obj)
    let parents = getMenuParents(obj, allMenus)
    for (let item of parents) {
      if (ids[item.function_menu_id]) continue
      ids[item.function_menu_id] = item.function_menu_id
      fns.push(item)
    }
  }
  return fns
}

export const formatUnHasMemuList = (hasSet, allMenus) => {
  let fns = getUnHasMenuList(hasSet, allMenus)
  return formatMenuList(null, fns, [], 'formatUnHasMemuList')
}

export const addMenu = (menu, hasSet, allMenus) => {
  let childs = getMenuChilds(menu, allMenus)
  let parents = getMenuParents(menu, allMenus)
  let ids = {}
  let array = [...hasSet, ...childs, ...parents]
  let result = []
  for (let obj of array) {
    if (!ids[obj.function_menu_id]) {
      ids[obj.function_menu_id] = obj.function_menu_id
      result.push(obj)
    }
  }
  return result
}

export const getMenuParents = (menu, allMenus) => {
  let patrents = []
  getParents()
  function getParents() {
    for (let obj of allMenus) {
      if (menu.parent_function_menu_id === obj.function_menu_id) {
        menu = obj
        patrents.push(obj)
        break
      }
    }
    if (menu.parent_function_menu_id) {
      getParents()
    }
  }
  return patrents
}

export const getMenuChilds = (menu, allMenus) => {
  let childs = [menu]
  let ids = { [menu.function_menu_id]: menu.function_menu_id }
  getChilds()
  function getChilds() {
    let count = 0
    let newArray = []
    for (let obj of allMenus) {
      if (ids[obj.parent_function_menu_id]) {
        ids[obj.function_menu_id] = obj.function_menu_id
        childs.push(obj)
        count++
      } else {
        newArray.push(obj)
      }
    }
    allMenus = newArray
    if (count > 0) {
      getChilds()
    }
  }
  return childs
}

export const deleteMenu = (menu, hasSet) => {
  let newHasSet = []
  for (let obj of hasSet) {
    if (obj.function_menu_id !== menu.function_menu_id) {
      newHasSet.push(obj)
    }
  }
  let array = delPatrent(menu, newHasSet)
  array = delChild(menu, array)
  return array
}

export const delChild = (menu, array) => {
  let ids = { [menu.function_menu_id]: menu.function_menu_id }
  delChilds()
  function delChilds() {
    let count = 0
    let newArray = []
    for (let obj of array) {
      if (ids[obj.parent_function_menu_id]) {
        ids[obj.function_menu_id] = obj.function_menu_id
        count++
      } else {
        newArray.push(obj)
      }
    }
    array = newArray
    if (count > 0) {
      delChilds()
    }
  }
  return array
}

export const delPatrent = (menu, array) => {
  if (!menu.parent_function_menu_id) return array
  let count = 0
  let patrent = {}
  let newArray = []
  for (let obj of array) {
    if (obj.parent_function_menu_id === menu.parent_function_menu_id) {
      count++
    }
    if (obj.function_menu_id === menu.parent_function_menu_id) {
      patrent = obj
    } else {
      newArray.push(obj)
    }
  }
  if (count === 0) {
    if (newArray.length > 0) {
      return delPatrent(patrent, newArray)
    }
    return newArray
  } else {
    return array
  }
}

export const getLastMenu = (menu) => {
  if (menu.children && menu.children.length) {
    return getLastMenu(menu.children[0])
  }
  return menu
}

export const resetErrorMsg = (e) => {
  let data = {}
  if (e.response) {
    data = e.response.data
  } else if (e.data) {
    data = e.data
  }
  for (let key of ERROR_MESSAGE) {
    if (data.code === key.code) {
      if (data.message === key.eMsg) {
        data.message = key.cMsg
        return data
      }
    }
  }
  return data
}

export const addCookie = (name, value, time) => {
  var exp = new Date()
  if (time && time !== 0 && !isNaN(parseInt(time))) {
    exp.setTime(exp.getTime() + expires * time)
  } else {
    exp.setTime(exp.getTime() + expires)
  }
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

export const getProvincesOptions = () => {
  let options = []
  for (let province of provinces) {
    options.push({
      value: province.name,
      label: province.name,
      cities: province.city
    })
  }
  return options
}

export const getRoleName = (roleData) => {
  var roleArray = []
  if (!(roleData instanceof Array) || !roleData.length) {
    roleArray.push(roleData)
  } else {
    return roles[roleData]
  }

  let rolesValue = []
  for (let value of roleArray) {
    rolesValue.push(roles[value])
  }

  return rolesValue.join(',')
}

export const getRoleOptions = (unshift_data) => {
  let options = []
  if (unshift_data) {
    options.push(unshift_data)
  }
  for (let key in roles) {
    options.push({
      value: key,
      label: roles[key]
    })
  }

  return options
}

export const getSelectValue = (value, array) => {
  for (let key of array) {
    if (value === key.value) {
      return key
    }
  }
  return null
}

export const getContactInfo = (array, key) => {
  let value = ''
  if (array) {
    array.map((item, index) => {
      if (index < array.length - 1) {
        value += item[key] + '，'
      } else {
        value += item[key]
      }
    })
    return value
  }
}

// MD5签名
export const md5 = str => {
  var md5sum = crypto.createHash('md5')
  md5sum.update(str)
  str = md5sum.digest('hex')
  return str
}
