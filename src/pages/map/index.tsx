import React, { Component } from 'react'
import { Map, MouseTool } from 'react-amap'
import { MAP_OPTION } from 'constant/map'

interface Iprops {
  children: React.ReactNode;
}

interface Istate {
  mapInstance: any;
  zoom: number;
}

export default class MyMap extends Component<Iprops, Istate> {
  // 地图实例
  mapInstance!: {}

  // 绘制工具实例
  tool!: {}

  // 地图事件
  amapEvents: { created: (ins: any) => void }

  // 绘制工具
  toolEvent: { created: (tool: any) => void }

  constructor(props: any) {
    super(props)
    this.state = {
      mapInstance: {},
      zoom: 10,
    }
    // 地图实例
    this.amapEvents = {
      created: (ins) => {
        console.log('map created', ins)
        this.mapInstance = ins
        this.setState({
          mapInstance: ins,
        })
      },
    }
    this.toolEvent = {
      created: (tool) => {
        this.tool = tool
      },

    }
  }

  onZoomChange = (zoom: number) => {
    this.setState({
      zoom,
    })
  }

  render() {
    const { mapInstance, zoom } = this.state
    return (
      <div>
        <Map
          amapkey={MAP_OPTION.key}
          version={MAP_OPTION.version}
          zoom={zoom}
          events={this.amapEvents}
        >
          <MouseTool events={this.toolEvent} />
        </Map>
      </div>
    )
  }
}
