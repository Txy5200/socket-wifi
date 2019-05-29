import NextHead from 'next/head'
import socketscss from '../../../static/css/socket_screen.scss'
import antdcss from 'antd/dist/antd.css'

const defaultDescription = ''
const defaultOGURL = ''

export const Head = props => (
  <NextHead>
    <meta content='text/html;charset=utf-8' />
    <title>{props.title || ''}</title>
    <meta name='description' content={props.description || defaultDescription} />
    <meta name='viewport' content='width=device-width,height=device-height,initial-scale=1,maximum-scale=1.0,user-scalable=no' />
    <meta name='apple-mobile-web-app-capable' content='yes' />
    <meta name='apple-mobile-web-app-status-bar-style' content='black' />
    <meta name='format-detection' content='telephne=no' />
    <link rel='icon' href='/static/favicon.ico' />
    <meta property='og:url' content={props.url || defaultOGURL} />
    <meta property='og:title' content={props.title || ''} />
    <meta property='og:description' content={props.description || defaultDescription} />
    <script src='https://res.wx.qq.com/open/js/jweixin-1.0.0.js' />
    <style
      dangerouslySetInnerHTML={{
        __html: socketscss + antdcss
      }}
    />
  </NextHead>
)

export default Head
