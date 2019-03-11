import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FontAwesome from 'react-fontawesome'
import './style.css'

class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.title
    }
    this.close = this.close.bind(this)
  }

  componentDidUpdate () {
    const { listOpen } = this.state
    setTimeout(() => {
      if (listOpen) {
        window.addEventListener('click', this.close)
      } else {
        window.removeEventListener('click', this.close)
      }
    }, 0)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.close)
  }

  close (timeOut) {
    this.setState({
      listOpen: false
    })
  }

  selectItem (item) {
    this.setState({
      headerTitle: item.name,
      listOpen: false
    }, this.props.onItemSelected(item))
  }

  toggleList () {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  render () {
    const {list} = this.props
    const {listOpen, headerTitle} = this.state
    const height = (list || []).length * 50
    // dynamically set height based on elements
    const style = this.state.listOpen ? { height: height + 'px', zIndex: '10', visibility: 'visible', border: '1px solid #dfdfdf', borderTop: 'none', 'boxShadow': '0 2px 5px -1px #e8e8e8', 'borderBottomRightRadius': '3px', 'borderBottomLeftRadius': '3px' } : {}
    return (
      <div className='dd-wrapper'>
        <div className={listOpen ? 'dd-header active' : 'dd-header'} onClick={() => this.toggleList()}>
          <div className='dd-header-title'>{headerTitle}</div>
          <span className='arrow' />
        </div>
        <ul className='sub-menu' onClick={e => e.stopPropagation()} style={style}>
          {!!(list && list.length) && list.map((item) => (
            <li className='dd-list-item' key={item.name} onClick={() => this.selectItem(item)}>
              <div className='item-wrapper'>
                <div className='item-name'>{item.name} {item.selected && <FontAwesome name='check' />}</div>
                { this.props.showControls && <div className='item-control-wrapper'>
                  <div className='item-control-button'><FontAwesome name='edit' /> </div>
                  <div className='item-control-button'><FontAwesome name='trash-o' /></div>
                </div>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
Dropdown.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}
export default Dropdown
