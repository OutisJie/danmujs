import React, { FC, useState } from 'react'
import { Layout } from 'antd'
import menus from 'utils/navigation'
import Menu from './menu'
import './style.less'

const { Sider, Header, Content } = Layout

const PageLayout: FC = (props) => {
  const [collapsed] = useState(false)

  return (
    <Layout className="container">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu data={menus} />
      </Sider>
      <Layout>
        <Header>头部</Header>
        <Content>{props.children}</Content>
      </Layout>
    </Layout>
  )
}

export default PageLayout
