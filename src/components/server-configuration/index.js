import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

class ServerConfigurator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      saved: false,
      inerror: false
    }
    this.saveConfiguration = this.saveConfiguration.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.onHostChange = this.onHostChange.bind(this)
    this.onPortChange = this.onPortChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }

  onNameChange (e) {
    this.props.onConnectionChanged('name', e.target.value)
  }

  onHostChange (e) {
    this.props.onConnectionChanged('host', e.target.value)
  }

  onPortChange (e) {
    this.props.onConnectionChanged('port', parseInt(e.target.value, 10))
  }

  onPasswordChange (e) {
    this.props.onConnectionChanged('password', e.target.value)
  }

  async saveConfiguration (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      loading: true
    })
    await this.props.onSaveConnection()
    this.setState({
      loading: true
    })
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
                <input value={this.props.connection.name} onChange={this.onNameChange} placeholder='Connection Name' type='text' required autoFocus />
              </fieldset>
              <fieldset>
                <input value={this.props.connection.host} onChange={this.onHostChange} placeholder='Host' type='text' required />
              </fieldset>
              <fieldset>
                <input value={this.props.connection.port} onChange={this.onPortChange} placeholder='Port' type='text' required />
              </fieldset>
              <fieldset>
                <input value={this.props.connection.password} onChange={this.onPasswordChange} placeholder='Password' type='password' />
              </fieldset>
              <fieldset>
                <button disabled={this.state.loading} name='submit' type='submit' onClick={this.saveConfiguration} id='contact-submit' data-submit='...Sending'>Submit</button>
              </fieldset>
            </form>
          </div>
        </section>
      </div>
    )
  }
}

ServerConfigurator.propTypes = {
  onConnectionChanged: PropTypes.func.isRequired,
  onSaveConnection: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  connection: PropTypes.object.isRequired
}
export default ServerConfigurator
