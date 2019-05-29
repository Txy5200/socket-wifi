import { request } from './request'
const initState = {
}

export function serialport(state = initState, action = {}) {
  switch (action.type) {
    default:
      return state
  }
}

export const openPort = () => async dispatch => {
  try {
    const data = await request('/serialport/openPort')
    if (data.code !== '200') {
      return data.msg
    }
  } catch (e) {
    console.log(e)
    return e.message
  }
}

export const closePort = () => async dispatch => {
  try {
    const data = await request('/serialport/closePort')
    if (data.code !== '200') {
      return data.msg
    }
  } catch (e) {
    console.log(e)
    return e.message
  }
}
