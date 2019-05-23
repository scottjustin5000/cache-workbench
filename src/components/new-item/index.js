import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import Dropdown from '../dropdown'
import ListEditor from '../list-editor'
import CollectionTypes from '../../collection-types'

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
      dataTypes: [{name: CollectionTypes.STRING, selected: false}, {name: CollectionTypes.LIST, selected: false}, {name: CollectionTypes.HASH, selected: false}, {name: CollectionTypes.ZSET, selected: false}],
      selectedType: '',
      key: '',
      value: '',
      contents: '',
      listItems: [],
      title: 'Data Type'
    }
    this.addNewItem = this.addNewItem.bind(this)
    this.dataTypeSelected = this.dataTypeSelected.bind(this)
    this.onContentChanged = this.onContentChanged.bind(this)
    this.onKeyChanged = this.onKeyChanged.bind(this)
    this.updateItems = this.updateItems.bind(this)
    this.onClose = this.onClose.bind(this)
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
    let json
    try {
      json = JSON.parse(e.target.value)
    } catch (err) {}
    if (json) {
      json = JSON.stringify(json, null, 4)
    } else {
      json = e.target.value
    }
    this.setState({
      contents: json
    })
  }

  onKeyChanged (e) {
    this.setState({
      key: e.target.value
    })
  }

  dataTypeSelected (item) {
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

  resetState () {
    const types = this.state.dataTypes.map((m) => {
      m.selected = false
      return m
    })
    this.setState({
      types,
      selectedType: '',
      key: '',
      value: '',
      contents: '',
      listItems: [],
      title: 'Data Type'
    })
  }

  async addNewItem (e) {
    e.preventDefault()
    e.stopPropagation()
    const data = (this.state.selectedType === CollectionTypes.STRING || this.state.selectedType === CollectionTypes.HASH) ? this.state.contents : this.state.listItems
    await this.props.submitItem(this.state.key, data, this.state.selectedType)
  }

  updateItems (items) {
    this.setState({listItems: items})
  }

  onClose () {
    this.resetState()
    this.props.handleClose()
  }

  render () {
    return (
      <div className={this.props.show ? 'modal display-block' : 'modal display-none'}>
        <section className='modal-main'>
          <div className='new-item-container'>
            <button className='close' onClick={this.onClose}>
            X
            </button>
            <form className='configure' action=''>
              <h3>Add New Key Value Pair</h3>
              <fieldset>
                <div className='configure-control-panel'>
                  <div className='new-item-type-wrapper'>
                    <Dropdown
                      title='Data Type'
                      list={this.state.dataTypes}
                      onItemSelected={this.dataTypeSelected}
                    />
                  </div>
                  {
                    this.state.selectedType === CollectionTypes.STRING && <div className='compression-controls'>
                      <div className='editor-control-item' onClick={this.compress}><FontAwesome name='compress' style={{color: '#ffffff'}} />  </div>
                      <div className='editor-control-item' onClick={this.expand}><FontAwesome name='expand' style={{color: '#ffffff'}} />  </div>
                    </div>
                  }
                  {
                    this.state.selectedType === CollectionTypes.HASH && <div className='config-hash-message'>*valid JSON required </div>
                  }
                </div>
              </fieldset>
              <fieldset>
                <input className='key-name' onChange={this.onKeyChanged} value={this.state.key} placeholder='key *required' type='text' />
              </fieldset>
              <fieldset>
                <div>
                  { (!this.state.selectedType || (this.state.selectedType === CollectionTypes.STRING || this.state.selectedType === CollectionTypes.HASH)) && <textarea value={this.state.contents} style={{ width: '98%', height: '300px', color: '#ffffff', backgroundColor: '#383838' }} onChange={this.onContentChanged} /> }
                  { (this.state.selectedType !== CollectionTypes.STRING && this.state.selectedType !== CollectionTypes.HASH) && this.state.selectedType &&
                  <div className='config-list-container'>
                    <div className='config-list-view-wrapper'>
                      <ListEditor items={this.state.listItems} updateItems={this.updateItems} />
                    </div>
                  </div>
                  }
                </div>
              </fieldset>
              <fieldset>
                <button className={`${!this.state.key ? 'configure-button-disabled' : 'configure-button'}`} title={!this.state.key ? 'Key Required' : 'Add New Item'} disabled={!this.state.key} type='submit' onClick={this.addNewItem} data-submit='...Sending'>Submit</button>
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
