import React, { Component } from 'react'
import './App.css'

import 'font-awesome/css/font-awesome.min.css'

import FontAwesome from 'react-fontawesome'
import DataExplorer from './components/data-explorer'
import Dropdown from './components/dropdown'
import ButtonBar from './components/button-bar'
import Cache from './services/cache'
import CacheConfiguration from './services/cache/configuration'
import Modal from './components/server-configuration'

class App extends Component {
  constructor () {
    super()
    this.state = {
      mode: 'Data',
      left: 300,
      dbs: [],
      showModal: false,
      cacheClient: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.onDbSelected = this.onDbSelected.bind(this)
    this.newServer = this.newServer.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.deleteConnection = this.deleteConnection.bind(this)
  }

  resetDbs () {
    const dbs = CacheConfiguration.loadDbs()
    this.setState({
      dbs
    })
  }

  componentDidMount () {
    window.scrollTo(0, 0)
    this.resetDbs()
  }

  handleChange (e) {
    this.setState({
      mode: e
    })
  }

  newServer () {
    this.setState({
      showModal: true
    })
  }

  hideModal () {
    const dbs = CacheConfiguration.loadDbs()
    this.setState({
      dbs,
      showModal: false
    })
  }

  onDbSelected (item) {
    const dbs = this.state.dbs.map((m) => {
      if (m.name === item.name) {
        m.selected = true
      } else {
        m.selected = false
      }
      return m
    })
    const cacheClient = new Cache(item)
    this.setState({
      dbs,
      cacheClient
    })
  }

  deleteConnection (item) {
    CacheConfiguration.deleteConnection(item.name)
    this.resetDbs()
  }

  render () {
    return (
      <div className='app'>
        <div className='data-explorer-top'>
          <div style={{width: this.state.left + 'px'}}>
            <div className='wrapper'>
              <Dropdown
                showControls
                title='Cache'
                list={this.state.dbs}
                onItemSelected={this.onDbSelected}
                onItemDelete={this.deleteConnection}
              />
              <a href='#' onClick={this.newServer} className='btn btn-4'><span>New <FontAwesome name='bolt' /></span></a>
            </div>
          </div>
          <div className='b-bar-container'>
            <div className='b-bar-wrapper'>
              <ButtonBar
                items={['Data', 'Analyze']}
                active={this.state.mode}
                onSelect={this.handleChange}
              />
            </div>
          </div>
        </div>
        <DataExplorer cacheClient={this.state.cacheClient} />
        <div> <Modal show={this.state.showModal} handleClose={this.hideModal} /></div>
      </div>
    )
  }
}

export default App
