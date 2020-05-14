import { hot } from 'react-hot-loader/root'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import Layout from 'pages/layout'
import Router from './routes'

const App = () => (
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <Layout>
        {Router}
      </Layout>
    </HashRouter>
  </ConfigProvider>
)

export default hot(App)
