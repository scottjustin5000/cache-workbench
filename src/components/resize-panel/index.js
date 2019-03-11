import React, { Component } from 'react'
import Proptypes from 'prop-types'
import ReactDOM from 'react-dom'
import Resizer from './resizer'
import './style.css'

function unFocus (document, window) {
  if (document.selection) {
    document.selection.empty()
  } else {
    try {
      window.getSelection().removeAllRanges()
      // eslint-disable-next-line no-empty
    } catch (e) {
      console.log(e)
    }
  }
}

class ResizablePanel extends Component {
  constructor () {
    super()
    this.oldX = 0
    this.startX = 0
    this.state = {
      isDragging: false,
      left: 300
    }
  }

  componentDidMount () {
    this.startResize = this.startResize.bind(this)
    this.stopResize = this.stopResize.bind(this)
    this.resizePanel = this.resizePanel.bind(this)
    ReactDOM.findDOMNode(this).addEventListener('mousemove', this.resizePanel)
  }

  startResize (event) {
    this.oldx = event.pageX
    unFocus(document, window)
    this.setState({
      isDragging: true
    })
  }

  stopResize (event) {
    if (this.state.isDragging) {
      unFocus(document, window)
      this.setState({
        isDragging: false,
        left: event.clientX
      })
    }
  }

  betweenBounds (event) {
    let direction = ''
    if (event.pageX < this.oldx) {
      direction = 'left'
    } else if (event.pageX > this.oldx) {
      direction = 'right'
    }
    this.oldx = event.pageX
    const xCord = event.clientX
    const xPercent = xCord / window.innerWidth * 100
    if (direction === 'left' && xCord > 300) {
      return true
    } else if (direction === 'right' && Math.round(xPercent) <= 80) {
      return true
    }

    if (xCord > 300 && Math.round(xPercent) <= 80) return true
  }

  resizePanel (event) {
    if (this.state.isDragging && this.betweenBounds(event)) {
      unFocus(document, window)
      this.props.onResizing(event.clientX)
      this.setState({
        left: event.clientX
      })
    } else if (this.state.isDragging && !this.betweenBounds(event.clientX)) {
      this.setState({
        isDragging: false
      })
    }
  }

  render () {
    return (
      <div style={{display: 'flex'}}>
        <div className='panel' style={{width: this.state.left + 'px'}}>
          {this.props.children[0]}
        </div>
        <Resizer
          onMouseDown={this.startResize}
          onMouseUp={this.stopResize}
        />
        <div style={{flexGrow: 1}}>
          {this.props.children[1]}
        </div>
      </div>
    )
  }
}

ResizablePanel.propTypes = {
  onResizing: Proptypes.func
}

export default ResizablePanel
