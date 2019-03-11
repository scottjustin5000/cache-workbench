import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'

import ResizablePanels from '../resize-panel'
import ListView from '../keylist'
import ListItem from '../keylist/list-item'
import NewItemModal from '../new-item'

import './style.css'

const Promise = require('bluebird')
const zlib = require('zlib')
const gzip = Promise.promisify(zlib.gzip)
const gunzip = Promise.promisify(zlib.gunzip)

class DataExplorer extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      hasMore: false,
      contents: '',
      left: 300,
      showModal: false,
      controlsEnabled: false
    }

    this.keys = []
    this.keys.length = 0

    this.handleResize = this.handleResize.bind(this)
    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.onKeySelected = this.onKeySelected.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.keySearch = this.keySearch.bind(this)
    this.expand = this.expand.bind(this)
    this.compress = this.compress.bind(this)
    this.openAddItemModal = this.openAddItemModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    // this.reloadKeys = this.reloadKeys.bind(this)
    this.purge = this.purge.bind(this)
    this.addItem = this.addItem.bind(this)
  }

  openAddItemModal () {
    this.setState({
      showModal: true
    })
  }

  closeModal () {
    this.setState({
      showModal: false
    })
  }

  async addItem (item) {
    await this.closeModal()

    // show modal
    // select type....
  }
  async purge () {
    try {
      await this.props.cacheClient.purge()
      this.getKeys()
    } catch (err) {
      // need to notify
      console.log(err)
    }
  }

  toggleSelected (id, key) {
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp[id].selected = !temp[id].selected
    this.setState({
      [key]: temp
    })
  }

  getKeys () {
    this.props.cacheClient.getKeysAndTypes()
      .then((keys) => {
        this.keys = keys
        this.setState({
          items: keys.slice(0, 12),
          hasMore: this.keys.length > 12,
          controlsEnabled: true
        })
      }).catch((err) => {
        // need to notify
        console.log(err)
      })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.cacheClient !== this.props.cacheClient) {
      this.getKeys()
    }
  }

  keySearch (value) {
    const filtered = this.keys.filter(k => k.indexOf(value) > -1)
    console.log(filtered)
  }

  fetchMoreData () {
    if (this.state.items.length < this.keys.length) {
      this.setState({
        items: this.state.items.concat([this.keys[this.state.items.length]]),
        hasMore: (this.state.items.length + 12 <= this.keys.length)
      })
    }
  }

  handleResize (v) {
    this.setState({left: v})
  }

  async onKeySelected (key) {
    const contents = await this.props.cacheClient.getByKey(key)
    this.setState({
      contents
    })
  }

  async deleteItem (key) {
    await this.props.cacheClient.remove(key)
    this.props.cacheClient.getKeysAndTypes()
      .then((keys) => {
        this.keys = keys
        this.setState({
          items: keys.slice(0, 12),
          hasMore: keys.length > 12
        })
      })
  }

  expand () {
    return gunzip(Buffer.from(this.state.contents, 'base64'))
      .then((reply) => {
        const obj = JSON.parse(reply)
        const data = JSON.stringify(obj, null, 4)
        this.setState({
          contents: data
        })
      })
  }

  compress () {
    return gzip(this.state.contents)
      .then((compressed) => {
        this.setState({
          contents: compressed.toString('base64')
        })
      })
  }

  render () {
    return (
      <div className='data-explorer-wrapper'>

        <ResizablePanels onResizing={this.handleResize}>
          <div>
            <div className='pattern-input' style={{marginTop: '-10'}}>
              <FontAwesome name='search' style={{margin: '15px', position: 'absolute'}} />
              <input
                type='text'
                className='search-input'
                placeholder='key name'
                value={this.state.pattern}
                onChange={evt => {
                  this.keySearch(evt.target.value)
                }}
              />
            </div>
            <div>
              <div className='server-controls'>
                <button title='add item' disabled={!this.state.controlsEnabled} onClick={this.openAddItemModal}><FontAwesome name='plus' /></button>
                <button title='reload keys' disabled={!this.state.controlsEnabled}><FontAwesome name='refresh' /></button>
                <button title='purge cache' disabled={!this.state.controlsEnabled}><FontAwesome name='trash-o' /></button>
              </div>
            </div>
            <div>
              <ListView
                height={485}
                dataLength={this.state.items.length}
                next={this.fetchMoreData}
                hasMore={this.state.hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>No More Keys Found</b>
                  </p>
                }
              >
                {this.state.items.map((item, index) => (
                  <ListItem name={`${item.key}`} type={item.type} key={index} onSelect={this.onKeySelected} onDelete={this.deleteItem} />
                ))}
              </ListView>
            </div>
          </div>
          <div>
            <div className='editor-panel'>
              <div className='editor-panel-inner'>
                <div className='editor-control-item' onClick={this.expand}><FontAwesome name='expand' />  </div>
                <div className='editor-control-item' onClick={this.compress}><FontAwesome name='compress' />  </div>
                <div className='editor-control-item' ><FontAwesome name='save' />  </div>
                <div className='editor-control-item' ><FontAwesome name='trash-o' /> </div>
              </div>
            </div>

            <div>
              <textarea className='item-editor' onChange={() => {}} value={this.state.contents} />
            </div>
          </div>
        </ResizablePanels>
        <div> <NewItemModal submitItem={this.addItem} show={this.state.showModal} handleClose={this.closeModal} /></div>
      </div>
    )
  }
}

DataExplorer.propTypes = {
  cacheClient: PropTypes.object
}

export default DataExplorer
