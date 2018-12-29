import React, { Component } from 'react'
import './styles/App.css'
import { Sheets } from './Stores'
import tiles_desert from './assets/tiles/desert.png'

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
    const { xy: [x, y] } = this.props
    const [ sheets, setSheet ] = this.context

    return (
      <div
        className="tile"
        style={{
          top: `${x*10}%`,
          left: `${y*10}%`,
        }}
      >
        {sheets[tiles_desert]? (
          <img
            src={tiles_desert}
            alt=""
            style={{
              width: `${100*sheets[tiles_desert].width/tileSize}%`,
              height: `${100*sheets[tiles_desert].height/tileSize}%`,
            }}
          />
        ) : (
          <img
            src={tiles_desert}
            alt=""
            onLoad={({ target: {width, height} }) => setSheet({
              [tiles_desert]: {width, height}
            })}
          />
        )}
      </div>
    )
  }
}

const Face = ({ side }) => (
  <div className={`face ${side || sides[0]}`}>
    {
      [...Array(100).keys()].map(i =>
        <Tile
          key={i}
          xy={[~~(i%10), ~~(i/10)]}
        />
      )
    }
  </div>
)

class App extends Component {

  state = {}

  render() {
    const { side } = this.state
    
    return <>

      <div className="scene">
        <div className={`camera ${side || sides[0]}`}>
          <Sheets>
            {
              sides.map(side =>
                <Face
                  key={side}
                  side={side}
                />
              )
            }
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
