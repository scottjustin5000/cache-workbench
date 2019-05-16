import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Analyze extends Component {
  constructor () {
    super()
    this.state = {
      info: []
    }
  }

  async loadInfo () {
    if (!this.props.cacheClient) return
    const info = await this.props.cacheClient.info()
    this.setState({
      info: info
    })
  }

  componentDidMount () {
    this.loadInfo()
  }

  render () {
    return (<div style={{width: '100%'}}>{this.state.info.map((m, i) => {
      return <div key={i} style={{ color: '#ffffff', fontSize: '12px', width: '100%', textAlign: 'left', marginLeft: '8px' }}>{m}</div>
    })}</div>)
  }
}

Analyze.propTypes = {
  cacheClient: PropTypes.object
}

export default Analyze
