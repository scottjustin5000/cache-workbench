import React, { Component } from 'react'
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

  selectItem (title, id, stateKey) {
    this.setState({
      headerTitle: title,
      listOpen: false
    }, this.props.resetThenSet(id, stateKey))
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
          {list.map((item) => (
            <li className='dd-list-item' key={item.id} onClick={() => this.selectItem(item.title, item.id, item.key)}>
              <div style={{display: 'inline-block', width: '100%'}}>
                <div style={{width: '50%', display: 'inline-block', 'textAlign': 'left'}}>{item.title} {item.selected && <FontAwesome name='check' />}</div>
                <div style={{width: '50%', display: 'inline-block'}}>
                  <div style={{width: '50%', display: 'inline-block'}}><FontAwesome name='edit' /> </div>
                  <div style={{width: '50%', display: 'inline-block'}}><FontAwesome name='trash-o' /></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Dropdown
