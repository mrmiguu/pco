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
const ms500 = t => (t || Date.now())/500 - (t || Date.now())/500%1

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
      {React.Children.map(this.props.children, child =>
        React.cloneElement(child, {xy: [x, y]})
      )}
    </>
  }
}

class Face extends Component {

  static contextType = EntityStore.contextType

  state = {}

  componentDidMount() {
    this.setState({
      ctx: this.refs.canvas.getContext('2d')
    })
  }
  
  render() {
    const { side, xy } = this.props
    const { ctx } = this.state
    const [ entities, setEntities ] = this.context

    const evs = Object.values(entities)
    const ekvs = Object.entries(entities)

    return (
      <div className={`face ${side || defaultSide}`}>

        <canvas
          ref="canvas"
          width={10*tileSize}
          height={10*tileSize}
        />

        {
          [...Array(100).keys()].map(i => {
            const x = ~~(i%10)
            const y = ~~(i/10)

            return (
              <Tile
                key={`${i},${!!ctx}`}
                className="edit"
                ctx={ctx}
                xy={[x, y]}
                src={tiles_desert}
                sxy={sideToTile[side]}

                onClick={() => setEntities({
                  [Date.now()]: {side, x, y}
                })}
              >
              </Tile>
            )
          })
        }

        {
          ekvs.map(([ id, e ]) => e.side === side? (
            <Tile
              key={id}
              className="entity"
              xy={[e.x, e.y]}
              src={sprites}
              sxy={[0,2]}

              onClick={() => {
                setEntities({
                  [id]: null
                })
              }}

            ></Tile>
          ) : null)
        }

        {
          xy? (
            <Tile
              className="entity"
              xy={xy}
              sxy={[0, 6]}
              src={sprites}
            ></Tile>
          ) : null
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
      <EntityStore>
        {
          sides.map(side =>
            <Face
              key={side}
              side={side}
              xy={side === face? xy : null}
            />
          )
        }
      </EntityStore>
    </SheetStore>
  </div>
)

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
