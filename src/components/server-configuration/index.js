import React from 'react'
import './style.css'

import CacheConfiguration from '../../services/cache/configuration'

class ServerConfigurator extends React.Component {
  constructor (props) {
    super(props)
    const selectedDb = props.connection || {}
    this.state = {
      loading: false,
      saved: false,
      inerror: false,
      name: selectedDb.name || '',
      host: selectedDb.host || '',
      port: selectedDb.port,
      password: selectedDb.password || ''
    }
    this.saveConfiguration = this.saveConfiguration.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onHostChange = this.onHostChange.bind(this)
    this.onPortChange = this.onPortChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }

  onNameChange (e) {
    this.setState({
      name: e.target.value
    })
  }

  onHostChange (e) {
    this.setState({
      host: e.target.value
    })
  }

  onPortChange (e) {
    this.setState({
      port: parseInt(e.target.value, 10)
    })
  }
  onPasswordChange (e) {
    this.setState({
      password: e.target.value
    })
  }

  componentDidUpdate (prevProps) {
    if (this.props.connection && Object.keys(this.props.connection).length && prevProps.connection !== this.props.connection) {
      this.setState({
        name: this.props.connection.name,
        host: this.props.connection.host,
        port: this.props.connection.port,
        password: this.props.connection.password || ''
      })
    }
  }

  saveConfiguration (e) {
    e.preventDefault()
    e.stopPropagation()
    CacheConfiguration.saveDb({ name: this.state.name, host: this.state.host, port: this.state.port, password: this.state.password })
    this.props.handleClose()
  }

  render () {
    const showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none'
    return (
      <div className={showHideClassName}>
        <section className='modal-main'>
          <div className='container'>
            <button onClick={this.props.handleClose} className='server-configure-close'>
            X
            </button>
            <form className='server-configure' action=''>
              <h3>Connection Info</h3>
              <h4>configure and connect to your redis server</h4>
              <fieldset>
                <input value={this.state.name} onChange={this.onNameChange} placeholder='Connection Name' type='text' required autoFocus />
              </fieldset>
              <fieldset>
                <input value={this.state.host} onChange={this.onHostChange} placeholder='Host' type='text' required />
              </fieldset>
              <fieldset>
                <input value={this.state.port} onChange={this.onPortChange} placeholder='Port' type='text' required />
              </fieldset>
              <fieldset>
                <input value={this.state.password} onChange={this.onPasswordChange} placeholder='Password' type='password' />
              </fieldset>
              <fieldset>
                <button name='submit' type='submit' onClick={this.saveConfiguration} id='contact-submit' data-submit='...Sending'>Submit</button>
              </fieldset>
            </form>
          </div>
        </section>
      </div>
    )
  }
}
export default ServerConfigurator
