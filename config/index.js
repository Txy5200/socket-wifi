import withData from './withData'

const TITLE = 'socket server'

const API_SERVER = 'http://127.0.0.1:8898'
const PORT = 9000 // 端口
const grant_type = 'client_credentials'
const client_id = 'AI-ROBOT-MANAGEMENT'
const client_secret = '$2b$10$2zon9/DUo1am5vKlxMZDl.cUYRjNy/kG1g.jKVz2VQ6W2czVxJ.v6'
const scope = 'AI-ROBOT-MANAGEMENT'
const qiniuConfig = {
  bucket: 'airobot',
  accessKey: 'TOHE4HwCM6g8MjKI9Mq0O-w0fwtOxQnjirDHt-zK',
  secretKey: 'yFcd_e5TPwx_KeI9pNWJkNM71GOoHfWw-8ts0BuU',
  origin: 'http://cdn.ai-robotics.cn/'
}
const MENUS = [
  {
    name: '客户机构',
    id: 1,
    parentID: 0,
    icon: 'consumer-icon.png',
    icon_click: 'consumer_click_icon.png',
    url: 'customer'
  },
  {
    name: '账号管理',
    id: 2,
    parentID: 0,
    icon: 'id_icon.png',
    icon_click: 'id_click_icon.png',
    url: 'account'
  },
  {
    name: '产品设备',
    id: 3,
    parentID: 0,
    icon: 'product_icon.png',
    icon_click: 'product_click_icon.png',
    url: 'equipment'
  },
  {
    name: '工单系统',
    id: 4,
    parentID: 0,
    icon: 'wiporder_icon.png',
    icon_click: 'wiporder_click_icon.png',
    url: 'workOrder'
  },
  {
    name: '消息推送',
    id: 5,
    parentID: 0,
    icon: 'message_icon.png',
    icon_click: 'message_click_icon.png',
    url: 'message'
  },
  // {
  //   name: '统计报表',
  //   id: 6,
  //   parentID: 0,
  //   icon: 'count_icon.png',
  //   icon_click: 'count_click_icon.png',
  //   url: 'statistics'
  // },
  {
    name: '康复模板',
    id: 7,
    parentID: 0,
    icon: 'recure_icon.png',
    icon_click: 'recure_click_icon.png',
    url: 'rehabilitationTemplate'
  },
  // {
  //   name: '表单系统',
  //   id: 8,
  //   parentID: 0,
  //   icon: 'form_icon.png',
  //   icon_click: 'form_click_icon.png',
  //   url: 'formSystem'
  // },
  {
    name: '内容管理',
    id: 9,
    parentID: 0,
    icon: 'content_icon.png',
    icon_click: 'content_click_icon.png',
    url: 'content'
  },
  {
    name: '测试接口',
    id: 14,
    parentID: 0,
    icon: 'content_icon.png',
    icon_click: 'content_click_icon.png',
    url: '/testApi'
  },
  {
    name: '测试接口',
    id: 15,
    parentID: 14,
    icon: 'content_icon.png',
    icon_click: 'content_click_icon.png',
    url: '/testApi'
  },
  {
    name: '机构管理',
    id: 10,
    parentID: 1,
    icon: '',
    icon_click: '',
    url: '/customer/management'
  },
  {
    name: '工单管理',
    id: 11,
    parentID: 4,
    icon: '',
    icon_click: '',
    url: '/workOrder/management'
  },
  {
    name: '模板管理',
    id: 12,
    parentID: 7,
    icon: '',
    icon_click: '',
    url: '/rehabilitationTemplate/template'
  },
  {
    name: '量表管理',
    id: 13,
    parentID: 7,
    icon: '',
    icon_click: '',
    url: '/rehabilitationTemplate/gauge'
  },
  {
    name: '账号管理',
    id: 16,
    parentID: 2,
    icon: '',
    icon_click: '',
    url: '/account/management'
  },
  {
    name: '设备清单',
    id: 17,
    parentID: 3,
    icon: '',
    icon_click: '',
    url: '/equipment/management'
  },
  {
    name: '训练数据',
    id: 18,
    parentID: 0,
    icon: 'content_icon.png',
    icon_click: 'content_click_icon.png',
    url: '/trainData'
  },
  {
    name: '患者数据',
    id: 19,
    parentID: 18,
    icon: 'content_icon.png',
    icon_click: 'content_click_icon.png',
    url: '/trainData/patient'
  },
  {
    name: '资讯类型管理',
    id: 20,
    parentID: 9,
    icon: '',
    icon_click: '',
    url: '/content/group/management'
  },
  {
    name: '零件维护',
    id: 21,
    parentID: 3,
    icon: '',
    icon_click: '',
    url: '/equipment/partMaintenance'
  },
  {
    name: '消息列表',
    id: 22,
    parentID: 5,
    icon: '',
    icon_click: '',
    url: '/message/management'
  },
  {
    name: '资讯管理',
    id: 23,
    parentID: 9,
    icon: '',
    icon_click: '',
    url: '/content/management'
  },
  {
    name: '申请管理',
    id: 24,
    parentID: 0,
    icon: 'id_icon.png',
    icon_click: 'id_click_icon.png',
    url: '/application'
  },
  {
    name: '申请管理',
    id: 25,
    parentID: 24,
    icon: '',
    icon_click: '',
    url: '/application/management'
  },
  {
    name: '训练计划',
    id: 26,
    parentID: 7,
    icon: '',
    icon_click: '',
    url: '/rehabilitationTemplate/trainingPlan'
  }
]
// 主功能
const MAINFUNCTION = [
  {
    title: '客户机构',
    short_name: 'customer',
    navigateName: '/customer/management',
    children: [{ title: '机构管理', navigateName: '/customer/management', icon: '' }]
  },
  {
    title: '账号管理',
    short_name: 'account',
    navigateName: '/account',
    children: []
  },
  {
    title: '产品设备',
    short_name: 'product',
    navigateName: '/product',
    children: []
  },
  {
    title: '工单系统',
    short_name: 'workOrder',
    navigateName: '/workOrder',
    children: [
      {
        title: '工单管理',
        navigateName: '/workOrder/management',
        icon: ''
      }
    ]
  },
  {
    title: '消息推送',
    short_name: 'message',
    navigateName: '/message',
    children: []
  },
  {
    title: '统计报表',
    short_name: 'statistics',
    navigateName: '/statistics',
    children: []
  },
  {
    title: '康复模板',
    short_name: 'rehabilitationTemplate',
    navigateName: '/rehabilitationTemplate',
    children: []
  },
  {
    title: '表单系统',
    short_name: 'formSystem',
    navigateName: '/formSystem',
    children: []
  },
  {
    title: '内容管理',
    short_name: 'contentManagement',
    navigateName: '/contentManagement',
    children: []
  }
]

// home 页面
const HOME_PAGE = { url: '/apis' }

const ERROR_MESSAGE = [
  {
    code: 400,
    eMsg: 'Invalid grant: user credentials are invalid',
    cMsg: '用户名或密码错误'
  }
]

// 主题颜色
const MAINCOLOR = '#2A4680'

// 压力颜色分类
export const pressColor = [
  'rgb(0,0,0)',
  'rgb(0,0,255)',
  'rgb(0,64,255)',
  'rgb(0,128,255)',
  'rgb(0,255,255)',
  'rgb(0,128,64)',
  'rgb(0,192,0)',
  'rgb(0,224,0)',
  'rgb(0,255,0)',
  'rgb(255,255,0)',
  'rgb(255,192,0)',
  'rgb(255,160,0)',
  'rgb(255,128,0)',
  'rgb(255,0,0)',
  'rgb(192,0,0)',
  'rgb(160,0,0)',
  'rgb(160,0,0)'
]

export { API_SERVER, withData, HOME_PAGE, MAINCOLOR, PORT, TITLE, MAINFUNCTION, MENUS, grant_type, client_id, client_secret, scope, ERROR_MESSAGE, qiniuConfig }
