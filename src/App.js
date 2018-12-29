import React, { Component } from 'react'
import './styles/App.css'
import { Sheets, Entities } from './Stores'
import tiles_desert from './assets/tiles/desert.png'
import sprites from './assets/sprites.png'

const tileSize = 32

const sides = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom'
]

class Tile extends Component {
  
  static contextType = Sheets.contextType
  
  render() {
    const { src, xy: [x, y], sxy: [sx, sy] } = this.props
    const [ sheets, setSheet ] = this.context

    return (
      <div
        className="tile"
        onClick={this.props.onClick}
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
        style={{
          top: `${x*10}%`,
          left: `${y*10}%`,
        }}
      >
        {sheets[src]? (
          <img
            src={src}
            alt=""
            style={{
              width: `${100*sheets[src].width/tileSize}%`,
              height: `${100*sheets[src].height/tileSize}%`,
              left: `${-100*sx}%`,
              top: `${-100*sy}%`,
            }}
          />
        ) : (
          <img
            src={src}
            alt=""
            onLoad={({ target: {width, height} }) => setSheet({
              [src]: {width, height}
            })}
          />
        )}
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {xy: [x, y]})
        )}
      </div>
    )
  }
}

class Face extends Component {

  static contextType = Entities.contextType
  
  render() {
    const { side } = this.props
    const [ entities, setEntity ] = this.context
    
    return (
      <div className={`face ${side || sides[0]}`}>
        {
          [...Array(100).keys()].map(i => {
            const x = ~~(i%10)
            const y = ~~(i/10)
            const loc = `${side},${x},${y}`

            return (
              <Tile
                key={i}
                xy={[x, y]}
                src={tiles_desert}
                sxy={[0, 0]}
                onMouseDown={() => setEntity({[loc]: entities[loc]? null : true})}
                onTouchStart={() => setEntity({[loc]: entities[loc]? null : true})}
              >
                {
                  entities[loc]? (
                    <Tile
                      src={sprites}
                      sxy={[0, 6]}
                    ></Tile>
                  ) : null
                }
              </Tile>
            )
          })
        }
      </div>
    )
  }
}

class App extends Component {

  state = {}

  render() {
    const { side } = this.state
    
    return <>

      <div className="scene">
        <div className={`camera ${side || sides[0]}`}>
          <Sheets>
            <Entities>
              {
                sides.map(side =>
                  <Face
                    key={side}
                    side={side}
                  />
                )
              }
            </Entities>
          </Sheets>
        </div>
      </div>

      <p className="radio-group">
        {
          sides.map(side =>
            <input
              key={side}
              type="radio"
              name="rotate-cube-side"
              onChange={() => this.setState({ side })}
            />
          )
        }
      </p>

    </>
  }
}

export default App
