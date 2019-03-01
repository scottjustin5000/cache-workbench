import React, { Component } from 'react'

import FontAwesome from 'react-fontawesome'
import ContentEditable from 'react-contenteditable'

import Cache from '../../services/cache'
import ResizablePanels from '../resize-panel'
import Dropdown from '../dropdown'
import ListView from '../keylist'
import ListItem from '../keylist/list-item'
import ButtonBar from '../button-bar'
import Modal from '../server-configuration'

import CacheConfiguration from '../../services/cache/configuration'
import './style.css'

const Promise = require('bluebird')
const zlib = require('zlib')
const gzip = Promise.promisify(zlib.gzip)
const gunzip = Promise.promisify(zlib.gunzip)

class DataExporer extends Component {
  constructor () {
    super()
    this.contentEditable = React.createRef()
    this.state = {
      items: [],
      hasMore: false,
      height: 500,
      html: '',
      mode: 'Data',
      left: 300,
      dbs: [],
      showModal: false
    }

    this.keys = []
    this.keys.length = 0
    this.keyPartition = 10
    this.cacheClient = null
    this.handleChange = this.handleChange.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.newServer = this.newServer.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.resetThenSet = this.resetThenSet.bind(this)
    this.fetchMoreData = this.fetchMoreData.bind(this)
    this.onKeySelected = this.onKeySelected.bind(this)
    this.keySearch = this.keySearch.bind(this)
    this.expand = this.expand.bind(this)
  }
  newServer () {
    this.setState({
      showModal: true
    })
  }
  hideModal () {
    this.setState({
      showModal: false
    })
  }
  handleChange (e) {
    console.log(e)
  }
  componentDidMount () {
    // const height = document.documentElement.scrollHeight - 280
    // this.setState({
    //   height
    // })
    const dbs = CacheConfiguration.loadDbs()
    this.setState({
      dbs
    })
  }

  // toggleSelected (id, key) {
  //   let temp = JSON.parse(JSON.stringify(this.state[key]))
  //   temp[id].selected = !temp[id].selected
  //   this.setState({
  //     [key]: temp
  //   })
  // }

  keySearch (value) {
    console.log(value)
    const filtered = this.keys.filter(k => k.indexOf(value) > -1)

    console.log(filtered)
  }

  getKeys (db) {
    this.cacheClient = new Cache(db)
    this.cacheClient.getKeys()
      .then((keys) => {
        this.keys = keys
        this.setState({
          items: keys.slice(0, 10),
          hasMore: keys.length > 10
        })
      })
  }

  resetThenSet (item) {
    // item.selected = true
    const dbs = this.state.dbs.map((m) => {
      if (m.name === item.name) {
        m.selected = true
      } else {
        m.selected = false
      }
      return m
    })

    this.setState({
      dbs
    }, () => {
      this.getKeys(item)
    })
  }

  fetchMoreData () {
    if (this.state.items.length < this.keys.length) {
      this.setState({
        items: this.state.items.concat([this.keys[this.state.items.length]])
      })
    }
  }

  handleTabChange (e) {
    this.setState({mode: e})
  }

  handleResize (v) {
    this.setState({left: v})
  }

  async onKeySelected (key) {
    const contents = await this.cacheClient.getByKey(key)
    this.setState({
      html: contents
    })
  }

  expand () {
    return gunzip(Buffer.from(this.state.html, 'base64'))
      .then((reply) => {
        const obj = JSON.parse(reply)
        this.setState({
          html: JSON.stringify(obj, null, 4)
        })
      })
  }

  render () {
    if (this.state.mode !== 'Data') {
      return (
        <div>Analyze</div>
      )
    }
    return (
      <div className='App'>
        <div style={{display: 'flex'}}>
          <div style={{width: this.state.left + 'px'}}>
            <div className='wrapper'>
              <Dropdown
                title='Cache'
                list={this.state.dbs}
                resetThenSet={this.resetThenSet}
              />
              <a href='#' onClick={this.newServer} className='btn btn-4'><span>New <FontAwesome name='bolt' /></span></a>
            </div>
          </div>
          <div style={{flexGrow: 1}}>
            <div style={{height: '45px', width: '100%', backgroundColor: '#f0f0f0'}}>
              <ButtonBar
                items={['Data', 'Analyze']}
                activeTab='Data'
                onSelectTab={this.handleTabChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <ResizablePanels onResizing={this.handleResize}>
          <div>
            <div className='pattern-input' style={{marginTop: '-10'}}>
              <FontAwesome name='search' style={{margin: '15px', position: 'absolute'}} />
              <input
                type='text'
                className='search-input'
                placeholder='Key name or patterns (e.g. user:*)'
                value={this.state.pattern}
                onChange={evt => {
                  this.keySearch(evt.target.value)
                }}
              />
            </div>
            <div>
              <div style={{display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', paddingTop: '5px'}}>
                <button style={{cursor: 'pointer'}}><FontAwesome name='plus' /></button>
                <button style={{cursor: 'pointer'}}><FontAwesome name='refresh' /></button>
                <button style={{cursor: 'pointer'}}><FontAwesome name='trash-o' /></button>
              </div>
            </div>
            <div>
              <ListView
                height={430}
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

                {this.state.items.map((i, index) => (
                  <ListItem name={`${i}`} key={index} onSelect={this.onKeySelected}>
              div - {i}
                  </ListItem>
                ))}
              </ListView>
            </div>
          </div>
          <div>
            <div style={{paddingTop: '10px', paddingRight: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                <div style={{paddingLeft: '5px', cursor: 'pointer', paddingRight: '5px', display: 'inline-block'}} onClick={this.expand}><FontAwesome name='expand' />  </div>
                <div style={{paddingLeft: '5px', cursor: 'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='compress' />  </div>
                <div style={{paddingLeft: '5px', cursor: 'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='save' />  </div>
                <div style={{paddingLeft: '5px', cursor: 'pointer', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='trash-o' /> </div>
              </div>
            </div>

            <div style={{minHeight: '600px'}}>
              <ContentEditable
                innerRef={this.contentEditable}
                html={this.state.html} // innerHTML of the editable div
                disabled={false} // use true to disable editing
                onChange={this.handleChange} // handle innerHTML change
                tagName='article' // Use a custom HTML tag (uses a div by default)
              />
            </div>
          </div>
        </ResizablePanels>
        <div> <Modal show={this.state.showModal} handleClose={this.hideModal} /></div>
      </div>
    )
  }
}

export default DataExporer
