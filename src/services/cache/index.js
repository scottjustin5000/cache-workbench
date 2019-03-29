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
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  purge () {
    return new Promise((resolve, reject) => {
      this.getClient().flushdb((err) => {
        if (err) return reject(err)
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

  addHashItem (key, propKey, value) {
    return new Promise((resolve, reject) => {
      this.getClient().hmset(key, propKey, value, (err, res) => {
        if (err) return reject(err)
        console.log(res)
        return resolve()
      })
    })
  }

  async addHash (key, item) {
    try {
      const data = JSON.parse(item)
      for (const prop in data) {
        let value = data[prop]
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }
        const result = await this.addHashItem(key, prop, value)
        console.log(result)
      }
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  rpush (key, items) {
    if (!items || Array.isArray(items) || items.length) { items.unshift(key) }
    return new Promise((resolve, reject) => {
      this.getClient().rpush(items, (err, res) => {
        if (err) return reject(err)
        return res()
      })
    })
  }

  zadd (key, items) {
    if (!items || Array.isArray(items) || items.length) { items.unshift(key) }
    return new Promise((resolve, reject) => {
      this.getClient().zadd(items, (err, res) => {
        if (err) return reject(err)
        return res()
      })
    })
  }

  addString (key, item) {
    return new Promise((resolve, reject) => {
      this.getClient().set(key, item, (err, res) => {
        if (err) return reject(err)
        return res()
      })
    })
  }

  addItem (key, item, type) {
    console.log('ADD T')
    if (type === 'STRING') {
      return this.addString(key, item)
    } else if (type === 'HASH') {
      return this.addHash(key, item)
    } else if (type === 'LIST') {
      return this.rpush(key, item)
    } else if (type === 'ZSET') {
      return this.zadd(key, item)
    }
    return Promise.resolve()
  }
}

export default Cache
