export const tileSize = 32

export const defaultSide = 'front'
export const defaultXY = [2,2]

export const sideToTransform = {
  'front':  ([x, y]) => `translateZ(-40vmax) rotateY(${  0 - ~~(x-4.5)*10}deg) rotateX(${0 + ~~(y-4.5)*10}deg) rotateZ(${  0}deg)`,
  'right':  ([x, y]) => `translateZ(-40vmax) rotateY(${-90 - ~~(x-4.5)*10}deg) rotateZ(${0 - ~~(y-4.5)*10}deg) rotateX(${-90}deg)`,
  'back':   ([x, y]) => `translateZ(-40vmax) rotateY(${180 - ~~(x-4.5)*10}deg) rotateX(${0 - ~~(y-4.5)*10}deg) rotateZ(${180}deg)`,
  'left':   ([x, y]) => `translateZ(-40vmax) rotateY(${ 90 - ~~(x-4.5)*10}deg) rotateZ(${0 + ~~(y-4.5)*10}deg) rotateX(${ 90}deg)`,
  'top':    ([x, y]) => `translateZ(-40vmax) rotateX(${-90 + ~~(y-4.5)*10}deg) rotateZ(${0 - ~~(x-4.5)*10}deg) rotateY(${-90}deg)`,
  'bottom': ([x, y]) => `translateZ(-40vmax) rotateX(${ 90 + ~~(y-4.5)*10}deg) rotateZ(${0 + ~~(x-4.5)*10}deg) rotateY(${-90}deg)`,
}

export const sides = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom'
]

// TODO: make into concise 12-edge relationship
export const edgeTransform = (side, [ x, y ]) => {
  switch (true) {
    case side === 'front'  && y < 0: return {side: 'top',    xy: [0, x]}
    case side === 'top'    && x < 0: return {side: 'front',  xy: [y, 0]}
    case side === 'top'    && y < 0: return {side: 'left',   xy: [0, x]}
    case side === 'left'   && x < 0: return {side: 'top',    xy: [y, 0]}
    case side === 'left'   && y < 0: return {side: 'front',  xy: [0, x]}
    case side === 'front'  && x < 0: return {side: 'left',   xy: [y, 0]}
    case side === 'front'  && x > 9: return {side: 'right',  xy: [y, 9]}
    case side === 'right'  && y > 9: return {side: 'front',  xy: [9, x]}
    case side === 'right'  && x > 9: return {side: 'bottom', xy: [9-y, 0]}
    case side === 'bottom' && y < 0: return {side: 'right',  xy: [9, 9-x]}
    case side === 'bottom' && x < 0: return {side: 'front',  xy: [9-y, 9]}
    case side === 'front'  && y > 9: return {side: 'bottom', xy: [0, 9-x]}
    case side === 'right'  && y < 0: return {side: 'back',   xy: [9, 9-x]}
    case side === 'back'   && x > 9: return {side: 'right',  xy: [9-y, 0]}
    case side === 'back'   && y > 9: return {side: 'top',    xy: [9, x]}
    case side === 'top'    && x > 9: return {side: 'back',   xy: [y, 9]}
    case side === 'top'    && y > 9: return {side: 'right',  xy: [0, 9-x]}
    case side === 'right'  && x < 0: return {side: 'top',    xy: [9-y, 9]}
    case side === 'left'   && x > 9: return {side: 'bottom', xy: [y, 9]}
    case side === 'bottom' && y > 9: return {side: 'left',   xy: [9, x]}
    case side === 'bottom' && x > 9: return {side: 'back',   xy: [9-y, 0]}
    case side === 'back'   && y < 0: return {side: 'bottom', xy: [9, 9-x]}
    case side === 'back'   && x < 0: return {side: 'left',   xy: [9-y, 9]}
    case side === 'left'   && y > 9: return {side: 'back',   xy: [0, 9-x]}
    default: return {side, xy: [x, y]}
  }
}

/* for testing purposes */
export const sideToTile = {
  'front':  [0, 0],
  'right':  [0, 2],
  'back':   [3, 2],
  'left':   [1, 0],
  'top':    [4, 1],
  'bottom': [3, 1],
}

export const keyToLR = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'a': 'left',
  'd': 'right',
}

export const keyToUD = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'w': 'up',
  's': 'down',
}

export const ms500 = t => (t || Date.now())/500 - (t || Date.now())/500%1
