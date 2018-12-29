import React, { Component, createContext } from 'react'

class Store extends Component {
  state = {
    hook: [
      {},
      item => {
        this.setState(({ hook: [store, setStore] }) => ({
          hook: [{...store, ...item}, setStore]
        }))
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
