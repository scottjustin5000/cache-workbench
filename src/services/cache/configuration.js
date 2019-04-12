const keytar = window.remote ? window.remote.require('keytar') : require('keytar')

const findPassword = (item) => {
  return keytar.getPassword('cache-workbench', item.name)
}

const getDbs = () => {
  const data = window.localStorage.getItem('dbs')
  return data ? JSON.parse(data) : []
}

const getConnection = (name) => {
  const dbs = getDbs() || []
  return dbs.find(d => d.name !== name)
}

const loadDbs = () => {
  const dbs = getDbs()
  return dbs.map(d => {
    d.password = findPassword(d)
    return d
  })
}

const deleteConnection = (name) => {
  const dbs = getDbs()
  const updated = dbs.filter(d => d.name !== name)
  window.localStorage.setItem('dbs', JSON.stringify(updated))
}

const saveDb = (settings) => {
  if (settings.password) {
    const password = settings.password
    const key = settings.name
    keytar.setPassword('cache-workbench', key, password)
    settings = Object.assign({}, settings, {password: undefined})
  }
  const dbs = getDbs()
  dbs.push(settings)
  window.localStorage.setItem('dbs', JSON.stringify(dbs))
}

const editDb = (settings) => {
  if (settings.password) {
    const password = settings.password
    const key = settings.name
    keytar.setPassword('cache-workbench', key, password)
    settings = Object.assign({}, settings, {password: undefined})
  }
  const dbs = getDbs()
  const item = dbs.find((d) => { return d.name === settings.name })
  if (!item) {
    dbs.push(settings)
  } else {
    item.name = settings.name
    item.host = settings.host
    item.port = settings.port
  }
  window.localStorage.setItem('dbs', JSON.stringify(dbs))
}

export default {
  loadDbs,
  saveDb,
  editDb,
  deleteConnection,
  getConnection
}
