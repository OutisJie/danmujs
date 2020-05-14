import React from 'react'
import { Menu } from 'antd'
// import Icon, { IconProps } from 'components/icon'
import { useHistory } from 'react-router-dom'


const { SubMenu } = Menu

interface IMenu {
  name: string;
  path: string;
  children?: IMenu[];
}

interface Iprops {
  data: IMenu[];
}

function MenuComponent (props: Iprops) {
  const { data } = props
  const history = useHistory()

  const handleMenuClick = (e: any) => {
    console.log('跳转', e)
    history.push(e.key)
  }

  const helper = (data: IMenu[]) => data.map((item) => {
    if (item.children && item.children.length) {
      return (
        <SubMenu
          key={item.path}
          title={(
            <span>
              {/* {item.icon ? <Icon icon={item.icon} /> : null} */}
              <span>{item.name}</span>
            </span>
          )}
        >
          {helper(item.children)}
        </SubMenu>
      )
    }
    return (
      <Menu.Item
        key={item.path}
        title={item.name}
      >
        {/* {item.icon ? <Icon icon={item.icon} /> : null} */}
        <span>{item.name}</span>
      </Menu.Item>
    )
  })
  return (
    <Menu mode="inline" theme="dark" onClick={handleMenuClick}>
      {helper(data)}
    </Menu>
  )
}

export default MenuComponent
