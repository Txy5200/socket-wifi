import { request } from './request'
const USER_SIGNIN = 'USER_SIGNIN'
const USER_SIGNOUT = 'USER_SIGNOUT'
const USER_MENU = 'USER_MENU'
const ALL_MENU = 'ALL_MENU'

const initState = {
  data: {},
  user_menu: [],
  all_menu: []
}

export function user(state = initState, action = {}) {
  switch (action.type) {
    case USER_SIGNIN:
      return { ...state, data: action.data }
    case USER_SIGNOUT:
      return { ...state, data: {} }
    case USER_MENU:
      return { ...state, user_menu: action.user_menu }
    case ALL_MENU:
      return { ...state, all_menu: action.data }
    default:
      return state
  }
}

export const signin = ({ username, password }) => async dispatch => {
  try {
    const data = await request('/personnel/login', {
      username,
      password
    })
    if (data.code !== '200') {
      return data.msg
    }
    const user = data.data || {}
    dispatch({
      type: USER_SIGNIN,
      data: user
    })
    return data
  } catch (e) {
    console.log(e)
    return e.message
  }
}

export const signout = () => async dispatch => {
  try {
    dispatch({
      type: USER_SIGNOUT
    })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}
export const FunMenusByPersonnel = ({ id }) => async dispatch => {
  try {
    console.log('limit====', id)
    const data = await request('/personnel/FunMenusByPersonnel', { id })
    console.log('FunMenusByPersonnel=======', data)
    const docs = data.data || []
    return docs
  } catch (e) {
    console.log(e)
    return [] // e.message
  }
}

export const MenubarList = ({ ascription }) => async dispatch => {
  try {
    const data = await request('/business/menubar/list', { ascription })
    console.log('MenubarList=======', data)
    const docs = data.data || []
    dispatch({
      type: ALL_MENU,
      data: docs
    })
    return docs
  } catch (e) {
    console.log(e)
    return []
  }
}

export const saveUserMenu = ({ user_menu }) => async dispatch => {
  try {
    // localforage.clear()
    dispatch({
      type: USER_MENU,
      user_menu
    })
    return null
  } catch (e) {
    console.log(e)
    return e.message
  }
}
