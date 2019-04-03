import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import './style.css'

class ListItem extends Component {
  render () {
    return (
      <div className='key-item'>
        <div className='key-item-type-wrapper'>  <span className={`key-type ${this.props.type.toLowerCase()}`}>{this.props.type}</span> </div>
        <div className='key-item-name'>{this.props.name}</div>
        <div className='key-item-controls'>
          <div className='key-item-control' onClick={() => { this.props.onSelect(this.props.name, this.props.type) }}><FontAwesome name='edit' />  </div>
          <div className='key-item-control' onClick={() => { this.props.onDelete(this.props.name) }}><FontAwesome name='trash-o' /> </div>
        </div>
      </div>
    )
  }
}
ListItem.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func
}

export default ListItem
