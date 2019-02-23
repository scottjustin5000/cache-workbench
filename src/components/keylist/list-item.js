import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import './style.css'

class ListItem extends Component {
  constructor (props) {
    super(props)
    this.style = {
      height: 20,
      border: '1px solid green',
      margin: 6,
      padding: 8,
      paddingTop: 10,
      display: 'flex'

    }
  }

  render () {
    return (
      <div style={this.style}>
        <div style={{display: 'inline-block'}}>  <span className='key-type str'>type</span>  </div>
        <div style={{width: '50%', display: 'inline-block'}}>{this.props.name}</div>
        <div style={{display: 'flex', justifyContent: 'flex-end', width: '50%'}}>
          <div style={{paddingLeft: '5px', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='edit' />  </div>
          <div style={{paddingLeft: '5px', paddingRight: '5px', display: 'inline-block'}}><FontAwesome name='trash-o' /> </div>
        </div>
      </div>
    )
  }
}
ListItem.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string
}

export default ListItem
