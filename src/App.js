import React, { Component } from 'react'

import './styles/App.css'
import { sides, keyToLR, keyToUD, ms500 } from './consts'
import Camera from './Camera'

import background from './assets/background.png'

class App extends Component {

  state = {
    to: [null, null],
    side: 'front',
    xy: [2,2],
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)

    if (!this.animFrameRef) {
      this.animFrameRef = window.requestAnimationFrame(this.animFrame)
    }
  }

  keyDown = e => {
    this.setState(({ to: [lr, ud], dir }) => {
      const newLR = keyToLR[e.key] || lr
      const newUD = keyToUD[e.key] || ud
  
      if (newLR === lr && newUD === ud) return

      return {
        to: [newLR, newUD],
        dir: newLR || newUD || dir
      }
    })
  }

  keyUp = e => {
    this.setState(({ to: [lr, ud], dir }) => {
      const newLR = keyToLR[e.key]
      const newUD = keyToUD[e.key]
  
      if (!newLR && !newUD) return

      return {
        to: [newLR? null : lr, newUD? null : ud],
        dir: ud || lr || dir
      }
    })
  }

  animFrame = time => {
    this.setState(({ xy: [x, y], to: [lr, ud], last500ms }) => {
      let state = {}
      
      if (ms500() !== last500ms) {
        if (lr || ud) {
          state.xy = [
            lr === 'left'? x-1 : lr === 'right'? x+1 : x,
            ud === 'up'? y-1 : ud === 'down'? y+1 : y
          ]

          state.last500ms = ms500()
        }
      }

      if (Object.keys(state).length) return state
    })

    this.animFrameRef = window.requestAnimationFrame(this.animFrame)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)

    window.cancelAnimationFrame(this.animFrameRef)
  }

  render() {
    const { side, xy } = this.state
    
    return (
      <div
        style={{
          backgroundImage: `url(${background})`
        }}
      >
        <div className="scene">
          <Camera face={side} xy={xy} />
        </div>

        <p className="radio-group">
          {
            sides.map(side =>
              <input
                key={side}
                type="radio"
                name="camera-face"
                onChange={() => this.setState({ side })}
              />
            )
          }
        </p>
        <div
          className="edit icon"
          onClick={() => {}}
        >🛠</div>
      </div>
    )
  }
}

export default App
