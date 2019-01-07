import React, { Component } from 'react'

import { tileSize } from './consts'
import { SheetStore } from './Stores'

class Tile extends Component {
  
  static contextType = SheetStore.contextType

  componentDidMount() {
    this.draw()
  }

  draw = () => {
    const { ctx, xy: [x, y], sxy: [sx, sy] } = this.props

    if (!ctx) return

    ctx.drawImage(
      this.refs.img,
      sx*tileSize, sy*tileSize, tileSize, tileSize,
      x*tileSize, y*tileSize, tileSize, tileSize
    )
  }

  onLoad = ({ target }) => {
    const { width, height } = target
    const { src } = this.props
    const [ sheets, setSheets ] = this.context
    
    this.draw()

    if (!sheets[src]) {
      setSheets({
        [src]: {width, height}
      })
    }
  }
  
  render() {
    const { ctx, src, xy: [x, y], sxy: [sx, sy] } = this.props
    const [ sheets ] = this.context

    return <>
      <div
        className={`${this.props.className} tile`}
        onClick={this.props.onClick}
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
        style={{
          left: `${x*10}%`,
          top: `${y*10}%`,
        }}
      >
        <img
          ref="img"

          src={src}
          alt=""
          onLoad={this.onLoad}
          
          style={{
            left: `${-100*sx}%`,
            top: `${-100*sy}%`,

            ...sheets[src]? {
              width:  `${100*sheets[src].width/tileSize}%`,
              height: `${100*sheets[src].height/tileSize}%`,
            } : {},
            
            display: ctx? 'none' : 'initial',
          }}
        />
      </div>

      {
        React.Children.map(
          this.props.children,
          child => React.cloneElement(child, {xy: [x, y]})
        )
      }
      
    </>
  }
}

export default Tile
