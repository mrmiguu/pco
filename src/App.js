import React, { Component } from 'react'
import './styles/App.css'
import { SheetStore, EntityStore } from './Stores'
import tiles_desert from './assets/tiles/desert.png'
import sprites from './assets/sprites.png'
import background from './assets/background.png'

const tileSize = 32

const sides = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom'
]

const sideToTile = {
  'front':  [0, 0],
  'right':  [0, 2],
  'back':   [3, 2],
  'left':   [1, 0],
  'top':    [4, 1],
  'bottom': [3, 1],
}

const defaultSide = 'front'

const sideToTransform = {
  'front':  ([x, y]) => `translateZ(-40vmax) rotateY(   ${0 - ~~(x-4.5)*10}deg) rotateX(${0 + ~~(y-4.5)*10}deg)`,
  'right':  ([x, y]) => `translateZ(-40vmax) rotateY( ${-90 - ~~(x-4.5)*10}deg) rotateZ(${0 - ~~(y-4.5)*10}deg)`,
  'back':   ([x, y]) => `translateZ(-40vmax) rotateY(${-180 - ~~(x-4.5)*10}deg) rotateX(${0 - ~~(y-4.5)*10}deg)`,
  'left':   ([x, y]) => `translateZ(-40vmax) rotateY(  ${90 - ~~(x-4.5)*10}deg) rotateZ(${0 + ~~(y-4.5)*10}deg)`,
  'top':    ([x, y]) => `translateZ(-40vmax) rotateX( ${-90 + ~~(y-4.5)*10}deg) rotateZ(${0 - ~~(x-4.5)*10}deg)`,
  'bottom': ([x, y]) => `translateZ(-40vmax) rotateX(  ${90 + ~~(y-4.5)*10}deg) rotateZ(${0 + ~~(x-4.5)*10}deg)`,
}

const keyToLR = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
}

const keyToUD = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
}

const ms250 = t => (t || Date.now())/250 - (t || Date.now())/250%1

class Tile extends Component {
  
  static contextType = SheetStore.contextType
  
  render() {
    const { src, xy: [x, y], sxy: [sx, sy] } = this.props
    const [ sheets, setSheet ] = this.context

    return (
      <div
        className={`${this.props.className} tile`}
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

  static contextType = EntityStore.contextType
  
  render() {
    const { side, xy } = this.props
    const [ entities, setEntity ] = this.context

    if (xy) {
      console.log(`xy ${JSON.stringify(xy)}`)
    }
    
    return (
      <div className={`face ${side || defaultSide}`}>
        {
          [...Array(100).keys()].map(i => {
            const x = ~~(i%10)
            const y = ~~(i/10)
            const loc = `${side},${x},${y}`

            return (
              <Tile
                // className="edit"
                key={i}
                xy={[x, y]}
                src={tiles_desert}
                sxy={sideToTile[side]}
                onClick={() => {
                  setEntity({[loc]: entities[loc]? null : true})
                }}
              >
                {
                  xy && xy[1] === x && xy[0] === y? (
                    <Tile
                      className="entity"
                      src={sprites}
                      sxy={[0, 6]}
                    ></Tile>
                  ) : entities[loc]? (
                    <Tile
                      className="entity"
                      src={sprites}
                      sxy={[0, 2]}
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

const Camera = ({ face, xy }) => (
  <div
    className={`camera ${face || defaultSide}`}
    style={{
      transform: (sideToTransform[face] || sideToTransform[defaultSide])(xy)
    }}
  >
    <SheetStore>
      {
        sides.map(side =>
          side === face? (
            <Face
              key={side}
              side={side}
              xy={xy}
            />
          ) : (
            <Face
              key={side}
              side={side}
            />
          )
        )
      }
    </SheetStore>
  </div>
)

class App extends Component {

  state = {
    to: [null, null],
    xy: [0,1],
    side: 'front',
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
    this.setState(({ xy: [x, y], to: [lr, ud], last250ms }) => {
      let state = {}
      
      if (ms250() !== last250ms) {
        if (lr || ud) {
          state.xy = [
            lr === 'left'? x-1 : lr === 'right'? x+1 : x,
            ud === 'up'? y-1 : ud === 'down'? y+1 : y
          ]

          state.last250ms = ms250()
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
          <EntityStore>
            <Camera face={side} xy={xy} />
          </EntityStore>
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
