import React, { Component } from 'react'
import './styles/App.css'

const sides = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom'
]

class App extends Component {

  state = {}

  render() {
    const { side } = this.state
    
    return <>

      <div className="scene">
        <div className={`cube ${side || sides[0]}`}>
          <div className="face front">FRO</div>
          <div className="face back">BAC</div>
          <div className="face right">RIG</div>
          <div className="face left">LEF</div>
          <div className="face top">TOP</div>
          <div className="face bottom">BOT</div>
        </div>
      </div>

      <p className="radio-group">
        {sides.map(side => (
            <input
              key={side}
              type="radio"
              name="rotate-cube-side"
              onChange={() => this.setState({ side })}
            />
        ))}
      </p>

    </>
  }
}

export default App
