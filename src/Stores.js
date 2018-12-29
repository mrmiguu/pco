import React, { Component, createContext } from 'react'

class Store extends Component {
  state = {
    hook: [
      {},
      items => {
        this.setState(({ hook: [store, setStore] }) => {
          Object.keys(items)
            .filter(item => items[item] === null)
            .forEach(item => {
              delete items[item]
              delete store[item]
            })

          return {
            hook: [{...store, ...items}, setStore]
          }
        })
      }
    ]
  }
}

const generateStore = () => class Temp extends Store {

  static contextType = createContext()

  render() {
    return (
      <Temp.contextType.Provider value={this.state.hook}>
        {this.props.children}
      </Temp.contextType.Provider>
    )
  }
}

export const Sheets = generateStore()
export const Entities = generateStore()
