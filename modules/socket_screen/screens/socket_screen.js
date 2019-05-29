import React, { Component } from 'react'
import { connect } from 'react-redux'
import ChartCopLine from '../../common/screens/line_chart'
import ChartScatter from '../../common/screens/chart_pressure_scatter'
import { Button, message } from 'antd'
import { openPort, closePort } from '../../../ducks'
import { variables } from '../../../global_variables'
var socket = require('socket.io-client')('http://localhost:8897', {autoConnect: false})

class SocketScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceArrayJson: {},
      isStart: false,
      initxAxisData: [],
      pressureArrayData: []
    }
  }

  componentDidMount() {
    let initxAxisData = []
    for (let i = 0; i < 500; i++) {
      initxAxisData.push(i)
    }
    this.setState({ initxAxisData })
    this.setOnDevice()
  }

  // 开始检测后定时获取全局变量中的数据
  // intervalFunc() {
  //   const { data_position } = variables;
  //   const { left, right } = data_position;
  //   let pressureArrayData = [...left, ...right];
  //   this.setState({ pressureArrayData });
  // }

  setOnDevice() {
    socket.on('connect', function() {
      console.log('connect========>')
    })
    socket.on('event', function(data) {
      console.log('event=======>', data)
    })
    socket.on('disconnect', function() {
      console.log('disconnect========>')
    })

    socket.on('send', data => {
      let { deviceArrayJson, isStart } = this.state
      if (isStart) {
        deviceArrayJson[data.client_name] = []
        for (let item of data.data) {
          deviceArrayJson[data.client_name].push(item)
        }
        this.setState({ deviceArrayJson })
      }
    })

    socket.on('pressData', pressureArrayData => {
      this.setState({ pressureArrayData })
    })
  }

  // 开始
  async startSocket() {
    const { openPort } = this.props
    let data = await openPort()
    socket.open()
    if (data) {
      socket.disconnect()
      message.error(data)
    } else {
      // this.timeOut = setInterval(this.intervalFunc.bind(this), 20);
      this.setState({ isStart: true })
    }
  }

  // 停止
  async endSocket() {
    const { closePort } = this.props
    const { deviceArrayJson } = this.state
    let data = await closePort(deviceArrayJson)
    socket.disconnect()
    if (data) {
      socket.open()
      message.error(data)
    } else {
      // clearInterval(this.timeOut)
      this.setState({ isStart: false })
    }
  }

  async saveData() {
    const { closePort } = this.props
    let data = await closePort()
    if (data) {
      message.error(data)
    } else {
      this.setState({ isStart: false })
    }
  }

  renderBtns() {
    const { isStart } = this.state

    return (
      <div className={'oper_btns'}>
        <Button
          onClick={() => {
            isStart ? this.endSocket() : this.startSocket()
          }}
        >
          {isStart ? '停止' : '开始'}
        </Button>
        {/* <Button
          onClick={() => {
            this.saveData()
          }}
          disabled={isStart}
        >
          保存
        </Button> */}
      </div>
    )
  }

  render() {
    const { deviceArrayJson, initxAxisData, pressureArrayData } = this.state

    let array = []
    for (let key in deviceArrayJson) {
      array.push({
        name: key,
        array: deviceArrayJson[key]
      })
    }
    return (
      <div className={'socket_screen'}>
        {this.renderBtns()}
        <div className={'screen_content'}>
          <div className={'press_chart'}>
            <ChartScatter data={pressureArrayData} />
          </div>
          <div className={'line_charts'}>
            {array.map((item, index) => {
              return <ChartCopLine key={index} data={item.array} seriesName={item.name} xAxisData={initxAxisData} />
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  {
    openPort,
    closePort
  }
)(SocketScreen)
