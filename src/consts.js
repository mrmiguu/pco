export const tileSize = 32

export const defaultSide = 'front'

export const sideToTransform = {
  'front':  ([x, y]) => `translateZ(-40vmax) rotateY(   ${0 - ~~(x-4.5)*10}deg) rotateX(${0 + ~~(y-4.5)*10}deg)`,
  'right':  ([x, y]) => `translateZ(-40vmax) rotateY( ${-90 - ~~(x-4.5)*10}deg) rotateZ(${0 - ~~(y-4.5)*10}deg)`,
  'back':   ([x, y]) => `translateZ(-40vmax) rotateY(${-180 - ~~(x-4.5)*10}deg) rotateX(${0 - ~~(y-4.5)*10}deg)`,
  'left':   ([x, y]) => `translateZ(-40vmax) rotateY(  ${90 - ~~(x-4.5)*10}deg) rotateZ(${0 + ~~(y-4.5)*10}deg)`,
  'top':    ([x, y]) => `translateZ(-40vmax) rotateX( ${-90 + ~~(y-4.5)*10}deg) rotateZ(${0 - ~~(x-4.5)*10}deg)`,
  'bottom': ([x, y]) => `translateZ(-40vmax) rotateX(  ${90 + ~~(y-4.5)*10}deg) rotateZ(${0 + ~~(x-4.5)*10}deg)`,
}

export const sides = [
  'front',
  'right',
  'back',
  'left',
  'top',
  'bottom'
]

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
}

export const keyToUD = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
}

export const ms500 = t => (t || Date.now())/500 - (t || Date.now())/500%1
