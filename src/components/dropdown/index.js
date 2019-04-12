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
    this.onDelete = this.onDelete.bind(this)
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

    if (this.state.headerTitle !== this.props.title && this.props.list && this.props.list.length && this.props.list.every(e => !e.selectItem)) {
      this.setState({
        headerTitle: this.props.title
      })
    }
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
  resetHeader () {
    this.setState({
      listOpen: false,
      headerTitle: this.props.title
    })
  }

  onDelete (e, item) {
    e.stopPropagation()
    this.props.onItemDelete(item)
  }

  onEdit (e, item) {
    e.stopPropagation()
    this.props.onItemEdit(item)
  }

  render () {
    const {list} = this.props
    const {listOpen, headerTitle} = this.state
    const height = (list || []).length * 42
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
                <div className='item-name'>{item.name} {item.selected && <FontAwesome name='check' style={{color: '#fff'}} />}</div>
                { this.props.showControls && <div className='item-control-wrapper'>
                  <div className='item-control-button' onClick={(e) => this.onEdit(e, item)}><FontAwesome name='edit' style={{color: '#ffffff'}} /> </div>
                  <div className='item-control-button' onClick={(e) => this.onDelete(e, item)}><FontAwesome name='trash-o' style={{color: '#ffffff'}} /></div>
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
  onItemSelected: PropTypes.func,
  onItemEdit: PropTypes.func,
  onItemDelete: PropTypes.func
}
export default Dropdown
