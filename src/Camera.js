import React from 'react'

import { defaultSide, sideToTransform, sides } from './consts'
import { SheetStore, EntityStore } from './Stores'
import Face from './Face'

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

export default Camera
