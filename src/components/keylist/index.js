import React, { Component } from 'react'
import PropTypes from 'prop-types'

const debounce = (fn, time) => {
  let timeoutId = false
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, time)
  }
}

class ScrollPanel extends Component {
  constructor (props) {
    super()
    this.state = {
      showLoader: false,
      lastScrollTop: 0,
      scrolling: false
    }

    this.onScrollListener = this.onScrollListener.bind(this)
    this.throttledOnScrollListener = debounce(this.onScrollListener, 150).bind(this)
    this.infScroll = React.createRef()
  }

  componentDidMount () {
    this.infScroll.current.addEventListener('scroll', this.throttledOnScrollListener)
  }

  componentWillUnmount () {
    this.infScroll.current.removeEventListener('scroll', this.throttledOnScrollListener)
  }

  componentWillReceiveProps (props) {
    // do nothing when dataLength and key are unchanged
    if (this.props.key === props.key && this.props.dataLength === props.dataLength) return

    this.setState({
      showLoader: false,
      scrolling: false
    })
  }

  isElementAtBottom (target) {
    const clientHeight = target.clientHeight
    const threshold = 0.8 * 100

    return (
      target.scrollTop + clientHeight >= threshold / 100 * target.scrollHeight
    )
  }

  onScrollListener (event) {
    const target = event.target
    if (this.state.scrolling) return

    const atBottom = this.isElementAtBottom(target)

    if (atBottom && this.props.hasMore) {
      this.setState({ scrolling: true, showLoader: true })
      this.props.next()
    }
    this.setState({ lastScrollTop: target.scrollTop })
  }

  render () {
    const style = {
      height: this.props.height,
      overflow: 'auto'
    }
    const hasChildren = !!(this.props.children && this.props.children.length)

    return (
      <div>
        <div
          ref={this.infScroll}
          style={style}
        >
          {this.props.children}
          {!this.state.showLoader &&
            !hasChildren &&
            this.props.hasMore &&
            this.props.loader}

        </div>
      </div>
    )
  }
}

ScrollPanel.propTypes = {
  next: PropTypes.func,
  hasMore: PropTypes.bool,
  children: PropTypes.node,
  loader: PropTypes.node.isRequired,
  endMessage: PropTypes.node,
  style: PropTypes.object,
  height: PropTypes.number,
  dataLength: PropTypes.number.isRequired,
  key: PropTypes.string
}

export default ScrollPanel
