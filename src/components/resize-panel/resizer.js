import React from 'react'
import PropTypes from 'prop-types'

class Resizer extends React.Component {
  render () {
    return (
      <span
        role='presentation'
        className='resizer'
        onMouseDown={event => this.props.onMouseDown(event)}
        onMouseUp={event => {
          event.preventDefault()
          this.props.onMouseUp(event)
        }}
      />
    )
  }
}

Resizer.propTypes = {
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired
}

export default Resizer
