import React, { Component } from 'react'
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
    const xCord = event.clientX

    const xPercent = xCord / window.innerWidth * 100
    // need direction here.... to actually determine this
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
      <div style={{display: 'flex', height: '100vh'}}>
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
export default ResizablePanel
