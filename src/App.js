import React, { Component } from 'react'
import './styles/App.css'
import tiles_desert from './assets/tiles-desert.png'

const sides = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom'
]

const Tile = ({ xy: [x, y] }) => (
  <div className="tile"
    style={{
      top: `${x*10}%`,
      left: `${y*10}%`,
      backgroundImage: `url(${tiles_desert})`
    }}
  ></div>
)

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
          {
            sides.map(side =>
              <Face
                key={side}
                side={side}
              />
            )
          }
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
