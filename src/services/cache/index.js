import CollectionTypes from '../../collection-types'
const redis = window.remote ? window.remote.require('redis') : require('redis')

class Cache {
  constructor (connection) {
    this.connection = connection
    this.client = null
  }

  getClient () {
    if (this.client) return this.client
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

  getSet (key) {
    return new Promise((resolve, reject) => {
      this.getClient().zrevrange(key, 0, -1, (err, reply) => {
        if (err) {
          console.log(err)
          return resolve()
        }
        return resolve(reply)
      })
    })
  }

  getList (key) {
    return new Promise((resolve, reject) => {
      this.getClient().lrange(key, 0, -1, (err, reply) => {
        if (err) {
          console.log(err)
          return resolve()
        }
        return resolve(reply)
      })
    })
  }

  getHash (key) {
    return new Promise((resolve, reject) => {
      this.getClient().hgetall(key, (err, reply) => {
        if (err) {
          console.log(err)
          return resolve()
        }
        let str = []
        Object.keys(reply).forEach(k => {
          // if (reply[k] && reply[k].charAt(0) === '{')
          try {
            JSON.parse(reply[k])
            str.push(`"${k}":${reply[k]}`)
          } catch (e) {
            str.push(`"${k}":"${reply[k]}"`)
          }
        })
        return resolve(`{ ${str.join(',')} }`)
      })
    })
  }

  getByKey (key, type) {
    if (type === CollectionTypes.ZSET) {
      return this.getSet(key)
    }
    if (type === CollectionTypes.LIST) {
      return this.getList(key)
    }
    if (type === CollectionTypes.HASH) {
      return this.getHash(key)
    }
    return new Promise((resolve, reject) => {
      this.getClient().get(key, (err, reply) => {
        if (err) {
          console.log(err)
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
        await this.addHashItem(key, prop, value)
      }
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  rpush (key, items) {
    if (items && Array.isArray(items) && items.length) { items.unshift(key) }
    return new Promise((resolve, reject) => {
      this.getClient().rpush(items, (err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
    })
  }

  zadd (key, items) {
    let indexedSet = []
    if (items && Array.isArray(items) && items.length) {
      let index = 1
      items.forEach((itm, indx) => {
        indexedSet.push(index)
        indexedSet.push(itm)
        index++
      })
      indexedSet.unshift(key)
    } else {
      indexedSet = [key]
    }
    console.log(indexedSet)
    return new Promise((resolve, reject) => {
      this.getClient().zadd(indexedSet, (err, res) => {
        if (err) return reject(err)
        return resolve(res)
      })
    })
  }

  addString (key, item) {
    return new Promise((resolve, reject) => {
      this.getClient().set(key, item, (err, res) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  addItem (key, item, type) {
    switch (type) {
      case CollectionTypes.STRING:
        return this.addString(key, item)
      case CollectionTypes.HASH:
        return this.addHash(key, item)
      case CollectionTypes.LIST:
        return this.rpush(key, item)
      case CollectionTypes.ZSET:
        return this.zadd(key, item)
      default:
        return Promise.resolve()
    }
  }

  async updateList (key, item) {
    await this.remove(key)
    return this.rpush(key, item)
  }

  async updateSet (key, item) {
    await this.remove(key)
    return this.zadd(key, item)
  }

  updateItem (key, item, type) {
    switch (type) {
      case CollectionTypes.STRING:
        return this.addString(key, item)
      case CollectionTypes.HASH:
        return this.addHash(key, item)
      case CollectionTypes.LIST:
        return this.updateList(key, item)
      case CollectionTypes.ZSET:
        return this.updateSet(key, item)
      default:
        return Promise.resolve()
    }
  }
}

export default Cache
