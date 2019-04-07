import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'

import ResizablePanels from '../resize-panel'
import ListView from '../keylist'
import ListItem from '../keylist/list-item'
import NewItemModal from '../new-item'
import ListEditor from '../list-editor'

import CollectionTypes from '../../collection-types'

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
      listItems: [],
      selectedType: 'STRING',
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
    this.purge = this.purge.bind(this)
    this.addItem = this.addItem.bind(this)
    this.updateItems = this.updateItems.bind(this)
    this.updateData = this.updateData.bind(this)
    this.getKeys = this.getKeys.bind(this)
    this.contentsChanged = this.contentsChanged.bind(this)
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

  handleResize (v) {
    this.setState({left: v})
  }

  checkJson (contents) {
    let json
    try {
      json = JSON.parse(contents)
    } catch (err) {}
    if (json) {
      json = JSON.stringify(json, null, 4)
    } else {
      json = contents
    }
    return json
  }

  componentDidUpdate (prevProps) {
    if (prevProps.cacheClient !== this.props.cacheClient) {
      this.getKeys()
    }
  }

  async addItem (key, item, type) {
    await this.props.cacheClient.addItem(key, item, type)
    await this.closeModal()
    this.getKeys()
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

  keySearch (evt) {
    if (!this.keys || !this.keys.length) return

    const filtered = this.keys.filter(k => k.key.indexOf(evt.target.value) > -1)

    this.setState({
      items: filtered
    })
  }

  fetchMoreData () {
    if (this.state.items.length < this.keys.length) {
      this.setState({
        items: this.state.items.concat([this.keys[this.state.items.length]]),
        hasMore: (this.state.items.length < this.keys.length)
      })
    }
  }

  async onKeySelected (key, type) {
    const formattedType = type.toUpperCase()
    const data = await this.props.cacheClient.getByKey(key, formattedType)
    if (formattedType === CollectionTypes.LIST || formattedType === CollectionTypes.ZSET) {
      this.setState({
        selectedKey: key,
        listItems: data || [],
        selectedType: formattedType
      })
    } else {
      this.setState({
        selectedKey: key,
        contents: this.checkJson(data),
        selectedType: formattedType
      })
    }
  }

  async deleteItem (key) {
    await this.props.cacheClient.remove(key || this.selectedKey)

    this.props.cacheClient.getKeysAndTypes()
      .then((keys) => {
        this.keys = keys
        if (this.state.selectedKey === key) {
          this.setState({
            selectedKey: '',
            contents: '',
            listItems: [],
            selectedType: CollectionTypes.STRING,
            items: keys.slice(0, 12),
            hasMore: keys.length > 12
          })
        } else {
          this.setState({
            items: keys.slice(0, 12),
            hasMore: keys.length > 12
          })
        }
      })
  }

  updateItems (items) {
    this.setState({listItems: items})
  }

  async updateData () {
    const data = (this.state.selectedType === CollectionTypes.LIST || this.state.selectedType === CollectionTypes.ZSET) ? this.state.listItems : this.state.contents
    await this.props.cacheClient.updateItem(this.state.selectedKey, data, this.state.selectedType)
    this.setState({
      selectedKey: '',
      listItems: undefined,
      selectedType: undefined
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

  contentsChanged (e) {
    const json = this.checkJson(e.target.value)
    this.setState({
      contents: json
    })
  }

  render () {
    return (
      <div className='data-explorer-wrapper'>
        <ResizablePanels onResizing={this.handleResize}>
          <div>
            <div className='pattern-input' style={{marginTop: '-10'}}>
              <FontAwesome name='search' style={{margin: '15px', position: 'absolute', color: '#ffffff'}} />
              <input
                type='text'
                className='search-input'
                placeholder='key name'
                value={this.state.pattern}
                onChange={this.keySearch}
              />
            </div>
            <div>
              <div className='server-controls'>
                <button title='add item' disabled={!this.state.controlsEnabled} onClick={this.openAddItemModal}><FontAwesome name='plus' /></button>
                <button title='reload keys' disabled={!this.state.controlsEnabled} onClick={this.getKeys}><FontAwesome name='refresh' /></button>
                <button title='purge cache' disabled={!this.state.controlsEnabled} onClick={this.purge}><FontAwesome name='trash-o' /></button>
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
                { this.state.selectedType === CollectionTypes.STRING &&
                <div className='editor-control-item'>
                  <div className='editor-control-item' onClick={this.expand}><FontAwesome name='expand' />  </div>
                  <div className='editor-control-item' onClick={this.compress}><FontAwesome name='compress' />  </div>
                </div>
                }
                <div onClick={this.updateData} className='editor-control-item' ><FontAwesome name='save' />  </div>
                <div onClick={this.deleteItem} className='editor-control-item' ><FontAwesome name='trash-o' /> </div>
              </div>
            </div>
            { (this.state.selectedType === CollectionTypes.STRING || this.state.selectedType === CollectionTypes.HASH) &&
            <div>
              <textarea className='item-editor' onChange={this.contentsChanged} value={this.state.contents} />
            </div>
            }
            { (this.state.selectedType === CollectionTypes.LIST || this.state.selectedType === CollectionTypes.ZSET) &&
            <div className='list-editor-container'>
              <div className='list-editor-view-wrapper'>
                <ListEditor items={this.state.listItems} updateItems={this.updateItems} />
              </div>
            </div>
            }
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
