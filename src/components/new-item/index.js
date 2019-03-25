import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import Dropdown from '../dropdown'
import ListView from './list-view'
import './style.css'

const Promise = require('bluebird')
const zlib = require('zlib')
const gzip = Promise.promisify(zlib.gzip)

class NewItemModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      saved: false,
      inerror: false,
      dataTypes: [{name: 'STRING', selected: false}, {name: 'LIST', selected: false}, {name: 'HASH', selected: false}, {name: 'ZSET', selected: false}],
      selectedType: '',
      key: '',
      value: '',
      contents: '',
      listItems: [{name: 'heloo', score: 0}, {name: 'heloo', score: 1} ]
    }
    this.addNewItem = this.addNewItem.bind(this)
    this.dataTypeSelected = this.dataTypeSelected.bind(this)
    this.onContentChanged = this.onContentChanged.bind(this)
    this.onKeyChanged = this.onKeyChanged.bind(this)
    // move listview to edit....
    // this will be for zest/set, list, etc
    // hash will be JSON...string will be string...unless it is valid json
    // in this form this will be like terminal...just write JSON...sorry dude but this is just a technical piece
    // of software...

    // lists
    // https://www.sitepoint.com/using-redis-node-js/
    // https://thisdavej.com/guides/redis-node/node/lists.html

    // hashes
    /*  https://medium.com/@stockholmux/store-javascript-objects-in-redis-with-node-js-the-right-way-1e2e89dbbf64
   const shamu = {
        type: 'killer whale',
        age: 5,
        lastFeedDate: 'Jan 06 2018',
    };

    try {
        const key = 'shamu';
        const result = await redis.hmset(key, shamu);
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
   */

    // zset
    // need to handle
    // https://gist.github.com/danielrvt/91765654445006bb28e2
  }

  compress () {
    return gzip(this.state.value)
      .then((compressed) => {
        this.setState({
          value: compressed.toString('base64')
        })
      })
  }

  onContentChanged (e) {
    console.log(e)
  }

  onKeyChanged (e) {
    console.log(e)
  }

  dataTypeSelected (item) {
    // if hash...notify needs to be JSON
    let selected = item.name
    const types = this.state.dataTypes.map((m) => {
      if (m.name === item.name) {
        m.selected = true
      } else {
        m.selected = false
      }
      return m
    })
    this.setState({
      types,
      selectedType: selected
    })
  }

  addNewItem (e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.submitItem()
  }

  render () {
    const showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none'
    return (
      <div className={showHideClassName}>
        <section className='modal-main'>
          <div className='new-item-container'>
            <button className='close' onClick={this.props.handleClose}>
            X
            </button>
            <form className='configure' action=''>
              <h3>Add New Key Value Pair</h3>
              <fieldset>
                <div className='configure-control-panel'>
                  <div className='new-item-type-wrapper' style={{textAlign: 'left'}}>
                    <Dropdown
                      title='Data Type'
                      list={this.state.dataTypes}
                      onItemSelected={this.dataTypeSelected}
                    />
                  </div>
                  {
                    this.state.selectedType === 'STRING' && <div style={{display: 'flex', margin: 'auto 5px'}}>
                      <div className='editor-control-item' onClick={this.compress}><FontAwesome name='compress' />  </div>
                      <div className='editor-control-item' onClick={this.expand}><FontAwesome name='expand' />  </div>
                    </div>
                  }
                </div>
              </fieldset>
              <fieldset>
                <input className='key-name' onChange={this.onKeyChanged} value={this.state.key} placeholder='key' type='text' />
              </fieldset>
              <fieldset>
                <div>
                  { (!this.state.selectedType || (this.state.selectedType === 'STRING' || this.state.selectedType === 'HASH')) && <textarea value={this.contents} style={{ width: '98%', height: '300px', color: '#ffffff', backgroundColor: '#383838' }} onChange={this.onContentChanged} /> }
                  { (this.state.selectedType !== 'STRING' && this.state.selectedType !== 'HASH') && this.state.selectedType &&
                  <div style={{display: 'flex'}}>
                    <div style={{ width: '100%', overflowY: 'scroll', height: '300px' }}>
                      <ListView items={this.state.listItems} />
                    </div>
                  </div>
                  }
                </div>
              </fieldset>
              <fieldset>
                <button name='submit' type='submit' onClick={this.addNewItem} data-submit='...Sending'>Submit</button>
              </fieldset>
            </form>
          </div>
        </section>
      </div>
    )
  }
}

NewItemModal.propTypes = {
  submitItem: PropTypes.func,
  handleClose: PropTypes.func
}

export default NewItemModal
