import React, { Component } from 'react'

import { tileSize, defaultSide, sideToTile } from './consts'
import { EntityStore } from './Stores'
import Tile from './Tile'

import tiles_desert from './assets/tiles/desert.png'
import sprites from './assets/sprites.png'

class Face extends Component {

  static contextType = EntityStore.contextType

  state = {}

  componentDidMount() {
    this.setState({
      ctx: this.refs.canvas.getContext('2d')
    })
  }
  
  render() {
    const { side, xy, isEditing } = this.props
    const { ctx } = this.state
    const [ entities, setEntities ] = this.context

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
                className={isEditing? 'edit' : null}
                ctx={ctx}
                xy={[x, y]}
                src={tiles_desert}
                sxy={sideToTile[side]}

                {
                  ...isEditing? {
                    onClick: () => setEntities({
                      [Date.now()]: {side, x, y}
                    })
                  } : {}
                }
                
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

              {
                ...isEditing? {
                  onClick: () => setEntities({
                    [id]: null
                  })
                } : {}
              }

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

export default Face
