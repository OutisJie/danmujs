import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'
import { Spin } from 'antd'

import Doc from 'pages/doc'
// import Video from 'pages/video'
// import Chat from 'pages/chat'

const routes = (
  <Suspense fallback={<Spin className="layout-spinning" />}>
    <Route exact path="/doc" component={Doc} />
    {/* <Route exact path="/" component={RiderCheck} /> */}
  </Suspense>
)

export default routes
