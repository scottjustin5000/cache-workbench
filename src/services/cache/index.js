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

  getType (key) {
    return new Promise((resolve, reject) => {
      this.getClient().type(key, (err, res) => {
        if (err) return console.log('Error:', err)
        return resolve(res)
      })
    })
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

  remove (key) {
    return new Promise((resolve, reject) => {
      this.getClient().del(key, (err, keys) => {
        if (err) {
          return resolve()
        }
        return resolve()
      })
    })
  }

  async getKeysAndTypes () {
    const keys = await this.getKeys()
    const keysAndTypes = []
    for (let i = 0; i < keys.length; i++) {
      let keyType = await this.getType(keys[i])
      keysAndTypes.push({ key: keys[i], type: keyType })
    }
    return Promise.resolve(keysAndTypes)
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
