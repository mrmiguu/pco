import React, { Component } from 'react'

import './styles/App.css'
import { sides, keyToLR, keyToUD, edgeTransform, defaultSide, defaultXY } from './consts'
import Camera from './Camera'

import tiles_desert from './assets/tiles/desert.png'
import background from './assets/background.png'

class App extends Component {

  state = {
    to:   [null, null],
    side: defaultSide,
    xy:   defaultXY,
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
    window.addEventListener('mousedown', this.mouseDown)
    window.addEventListener('mousemove', e => this.move(e.movementX, e.movementY))
    window.addEventListener('mouseup', this.mouseUp)

    window.addEventListener('touchstart', this.mouseDown)

    let dXY = [0,0]
    window.addEventListener('touchmove', e => {
      const [ dX, dY ] = dXY
      this.move(e.touches[0].pageX-dX, e.touches[0].pageY-dY)
      dXY = [e.touches[0].pageX, e.touches[0].pageY]
    })
    
    window.addEventListener('touchend', this.mouseUp)

    if (!this.animFrameRef) {
      this.animFrameRef = window.requestAnimationFrame(this.animFrame)
    }
  }

  mouseDown = e => {
    this.setState({
      mouseDown: true
    })
  }

  toDirOn = (dLR, dUD) => {
    this.setState(({ to: [lr, ud], dir }) => {
      const newLR = dLR || lr
      const newUD = dUD || ud
  
      if (newLR === lr && newUD === ud) return

      return {
        to: [newLR, newUD],
        dir: newLR || newUD || dir
      }
    })
  }

  toDirOff = (dLR, dUD) => {
    if (!dLR && !dUD) return

    this.setState(({ to: [lr, ud], dir }) => ({
      to: [dLR? null : lr, dUD? null : ud],
      dir: ud || lr || dir
    }))
  }

  keyDown = e => {
    this.toDirOn(keyToLR[e.key], keyToUD[e.key])
  }

  keyUp = e => {
    this.toDirOff(keyToLR[e.key], keyToUD[e.key])
  }

  move = (dX, dY) => {
    const { mouseDown } = this.state
    
    if (!mouseDown) return
    
    const dLR = dX < -1? 'left' : dX > 1? 'right' : null
    const dUD = dY < -1? 'up' : dY > 1? 'down' : null

    this.setState(({ to: [lr, ud], dir }) => {
      const newLR = dLR || (lr && ud? dLR : lr)
      const newUD = dUD || (lr && ud? dUD : ud)
  
      if (newLR === lr && newUD === ud) return

      return {
        to: [newLR, newUD],
        dir: newLR || newUD || dir
      }
    })
  }

  mouseUp = e => {
    this.setState(({ to: [lr, ud], dir }) => ({
      mouseDown: false,
      to: [null, null],
      dir: ud || lr || dir
    }))
  }

  animFrame = time => {
    this.setState(({ side, xy: [x, y], to: [lr, ud], last500ms }) => {

      let state = {}
      
      if (Date.now() >= (last500ms||0)+500) {
        if (lr || ud) {

          const xy = [
            lr === 'left'? x-1 : lr === 'right'? x+1 : x,
            ud === 'up'? y-1 : ud === 'down'? y+1 : y
          ]

          state = {
            ...state,
            ...edgeTransform(side, xy),
            last500ms: Date.now(),
          }
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
    const { side, xy, isMenuOpen, isEditing, isPickingTile } = this.state
    
    return (
      <div
        style={{
          backgroundImage: `url(${background})`
        }}
      >
        <div className="scene">
          <Camera face={side} xy={xy} isEditing={isEditing} />
        </div>

        {
          isEditing? (
            <p className="radio-group">
              {
                sides.map(s =>
                  <input
                    key={s}
                    type="radio"
                    name="camera-face"
                    onChange={() => this.setState({ side: s })}
                    checked={s === side}
                  />
                )
              }
            </p>
          ) : null
        }

        <div className="ui icons">️

          {
            isMenuOpen? <>

              <span
                onClick={() => this.setState(({ isPickingTile }) => ({
                  isPickingTile: !isPickingTile,
                  isMenuOpen: !isPickingTile,
                }))}
              >🗺</span>

              <span
                onClick={() => this.setState(({ isEditing }) => ({
                  isEditing: !isEditing,
                  isMenuOpen: !isEditing,
                }))}
              >🛠</span>

            </> : null
          }

          <span
            onClick={() => this.setState(({ isMenuOpen }) => ({
              isMenuOpen: !isMenuOpen,
            }))}
          >⚙</span>

        </div>

        {
          isPickingTile? (
            <div className="ui tile-picker">
              <img src={tiles_desert} alt="" />
            </div>
          ) : null
        }
        
      </div>
    )
  }
}

export default App
