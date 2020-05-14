import React from 'react'
import { VideoCameraOutlined, WechatOutlined } from '@ant-design/icons'

const IconTypes = {
  chat: <VideoCameraOutlined />,
  video: <WechatOutlined />,
}

export interface IconProps {
  icon?: keyof typeof IconTypes;
}

function Icon (props: IconProps) {
  const { icon } = props
  return icon ? IconTypes[icon] : IconTypes.chat
}

export default Icon
