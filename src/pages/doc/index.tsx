import React, { FC, useState } from 'react'
import { Button } from 'antd'
import { createStore } from 'my_module/store'
import exampleStore from './store'

const Chat: FC = () => {
  const [editing] = useState(false)
  // const [store, actions] = createStore({
  //   default: 1234,
  // }, {
  //   fun1: () => (state) => {
  //     console.log('store', state)
  //   },
  // })
  const [state, actions1] = exampleStore.useStore()

  const handleClick = () => {
    console.log('default store:', state, actions1)
    actions1.fetchData({ test: 123 })
    console.log('after action:', state)
  }
  return (
    <Button disabled={editing} onClick={handleClick}>编辑</Button>
  )
}

export default Chat
