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

const defaultSide = 'left'

const sideToTransform = {
  'front':     ([x, y]) => `translateZ(-40vmax) rotateY(   ${0 - ~~(x-4.5)*10}deg) rotateX(${0 + ~~(y-4.5)*10}deg)`,
  'right':     ([x, y]) => `translateZ(-40vmax) rotateY( ${-90 - ~~(x-4.5)*10}deg) rotateZ(${0 - ~~(y-4.5)*10}deg)`,
  'back':      ([x, y]) => `translateZ(-40vmax) rotateY(${-180 - ~~(x-4.5)*10}deg) rotateX(${-180 - ~~(y-4.5)*10}deg)`,//wip
  'left':      ([x, y]) => `translateZ(-40vmax) rotateY(  ${90 - ~~(x-4.5)*10}deg) rotateZ(${0 + ~~(y-4.5)*10}deg)`,
  'top':       ([x, y]) => `translateZ(-40vmax) rotateX( ${-90 - ~~(x-4.5)*10}deg) rotateX(${-90 + ~~(y-4.5)*10}deg)`,//wip
  'bottom':    ([x, y]) => `translateZ(-40vmax) rotateX(  ${90 - ~~(x-4.5)*10}deg) rotateX(${90 + ~~(y-4.5)*10}deg)`,//wip
}

// // tilts the die to the edges your closest to
// adjustedDieRotation() {
//   let rotation = { 
//     x: this.dieRotation.x,
//     y: this.dieRotation.y,
//     z: this.dieRotation.z
//   };

//   //dont tilt the die if we're looking at a face other than the one the player is on
//   if (store.player.location.face != this.currentFace) {
//     return rotation;
//   }

//   //determine which axes to shift based on col and row position for each face
//   const faceAxes = [
//     { col: 'y', colMultiplier: '-1', row: 'x', rowMultiplier: '1' }, 	//ONE
//     { col: 'y', colMultiplier: '-1', row: 'z', rowMultiplier: '1' }, 	//TWO
//     { col: 'z', colMultiplier: '1', row: 'x', rowMultiplier: '1' }, 	//THREE
//     { col: 'z', colMultiplier: '-1', row: 'x', rowMultiplier: '1' }, 	//FOUR
//     { col: 'y', colMultiplier: '-1', row: 'z', rowMultiplier: '1' }, 	//FIVE
//     { col: 'y', colMultiplier: '1', row: 'x', rowMultiplier: '1' }, 	//SIX
//   ];

//   //make column-based adjustments
//   switch (store.player.location.col) {
//     case 6:
//       rotation[faceAxes[this.currentFace].col] += (30 * faceAxes[this.currentFace].colMultiplier);
//       break;
//     case 5:
//       rotation[faceAxes[this.currentFace].col] += (18 * faceAxes[this.currentFace].colMultiplier);
//       break;
//     case 4:
//       rotation[faceAxes[this.currentFace].col] += (10 * faceAxes[this.currentFace].colMultiplier);
//       break;
//     case 2:
//       rotation[faceAxes[this.currentFace].col] -= (10 * faceAxes[this.currentFace].colMultiplier);
//       break;
//     case 1:
//       rotation[faceAxes[this.currentFace].col] -= (18 * faceAxes[this.currentFace].colMultiplier);
//       break;
//     case 0:
//       rotation[faceAxes[this.currentFace].col] -= (30 * faceAxes[this.currentFace].colMultiplier);
//       break;
//   }

//   //make row-based adjustments
//   switch (store.player.location.row) {
//     case 6:
//       rotation[faceAxes[this.currentFace].row] += (30 * faceAxes[this.currentFace].rowMultiplier);
//       break;
//     case 5:
//       rotation[faceAxes[this.currentFace].row] += (18 * faceAxes[this.currentFace].rowMultiplier);
//       break;
//     case 4:
//       rotation[faceAxes[this.currentFace].row] += (10 * faceAxes[this.currentFace].rowMultiplier);
//       break;
//     case 2:
//       rotation[faceAxes[this.currentFace].row] -= (10 * faceAxes[this.currentFace].rowMultiplier);
//       break;
//     case 1:
//       rotation[faceAxes[this.currentFace].row] -= (18 * faceAxes[this.currentFace].rowMultiplier);
//       break;
//     case 0:
//       rotation[faceAxes[this.currentFace].row] -= (30 * faceAxes[this.currentFace].rowMultiplier);
//       break;
//   }

//   return rotation;
// }

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
    const { side } = this.props
    const [ entities, setEntity ] = this.context
    
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
                  entities[loc]? (
                    <Tile
                      className="entity"
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
    
    return (
      <div
        style={{
          backgroundImage: `url(${background})`
        }}
      >
        <div className="scene">
          <div
            className={`camera ${side || defaultSide}`}
            style={{
              transform: (sideToTransform[side] || sideToTransform[defaultSide])([2,2])
            }}
          >
            <SheetStore>
              <EntityStore>
                {
                  sides.map(side =>
                    <Face
                      key={side}
                      side={side}
                    />
                  )
                }
              </EntityStore>
            </SheetStore>
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
        <div
          className="edit icon"
          onClick={() => {}}
        >🛠</div>
      </div>
    )
  }
}

export default App
