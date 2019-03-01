const redis = window.remote ? window.remote.require('redis') : require('redis')
class Cache {
  constructor (connection) {
    this.connection = connection
    this.client = null
  }

  getClient () {
    if (this.client) return this.client
    // return this.client
    const options = Object.assign((this.connection.options || {}), {no_ready_check: true})
    try {
      this.client = redis.createClient(this.connection.port, this.connection.host, options)
      return this.client
    } catch (err) {
      console.log(err)
    }
  }

  getKeys () {
    return new Promise((resolve, reject) => {
      this.getClient().keys('*', (err, keys) => {
        if (err) {
          return resolve()
        }
        if (keys) {
          return resolve(keys)
        } else {
          return resolve()
        }
      })
    })
  }

  getByKey (key) {
    return new Promise((resolve, reject) => {
      this.getClient().get(key, (err, reply) => {
        if (err) {
          console.log(err)
          // don't want to fail b/c cache errors
          return resolve()
        }
        return resolve(reply)
      })
    })
  }
}

export default Cache
