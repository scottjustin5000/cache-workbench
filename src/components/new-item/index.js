import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import Dropdown from '../dropdown'
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
      dataTypes: [{name: 'string', selected: false}, {name: 'list', selected: false}, {name: 'hash', selected: false}, {name: 'set', selected: false}, {name: 'zset', selected: false}],
      selectedType: '',
      key: '',
      value: ''
    }
    this.addNewItem = this.addNewItem.bind(this)
    this.dataTypeSelected = this.dataTypeSelected.bind(this)
  }

  compress () {
    return gzip(this.state.value)
      .then((compressed) => {
        this.setState({
          value: compressed.toString('base64')
        })
      })
  }

  dataTypeSelected (item) {
    let selected = item.name
    const types = this.state.dbs.map((m) => {
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
            <button onClick={this.props.handleClose} id='x'>
            X
            </button>
            <form className='configure' action=''>
              <h3>Add New Key Value Pair</h3>
              <fieldset>
                <div style={{margin: '0 0 5px', padding: '10px'}}>
                  <Dropdown
                    title='Data Type'
                    list={this.state.dataTypes}
                    onItemSelected={this.dataTypeSelected}
                  />
                </div>
              </fieldset>
              {
                this.state.selectedType === 'string' && <fieldset>
                  <div className='editor-control-item' onClick={this.compress}><FontAwesome name='compress' />  </div>
                </fieldset>
              }
              <fieldset>
                <input value={this.state.key} onChange={this.onNameChange} placeholder='key' type='text' tabIndex='1' required autoFocus />
              </fieldset>
              <fieldset>
                <textarea style={{ width: '98%', height: '100%', minHeight: '250px' }} />
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
