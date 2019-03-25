import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

import './style.css'
class ListView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: ['Cake', 'Donut', 'Apple', 'Pizza', 'Twix', 'mm', 'rp', 'sp']
    }
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.itemChanged = this.itemChanged.bind(this)
    this.addItem = this.addItem.bind(this)
  }

  onDragStart (e, index) {
    this.draggedItem = this.state.items[index]
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.parentNode)
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20)
  }

  onDragOver (index) {
    console.log('over', index)
    const draggedOverItem = this.state.items[index]

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return
    }

    // filter out the currently dragged item
    let items = this.state.items.filter(item => item !== this.draggedItem)

    // add the dragged item after the dragged over item
    console.log(this.draggedItem)
    items.splice(index, 0, this.draggedItem)
    console.log(items)
    this.setState({ items })
  };

  onDragEnd () {
    console.log('done')
    this.draggedIdx = null
  }

  itemChanged (item, index) {
    const items = this.state.items.map((itm, idx) => {
      if (idx === index) {
        return item.target.value
      }
      return itm
    })
    this.setState({ items })
  }

  addItem (e) {
    e.preventDefault()

    const items = [...[' '], ...this.state.items]
    this.setState({ items })
  }

  render () {
    return (
      <div className='list-view'>
        <main>
          <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
            <div>
              <button style={{cursor: 'pointer'}} onClick={this.addItem}><FontAwesome name='plus' /></button>
            </div>
          </div>
          <ul>
            {this.state.items.map((item, idx) => (
              <li key={`idxt_${idx}`} onDragOver={() => this.onDragOver(idx)}>
                <div
                  key={`idx_${idx}`}
                  className='drag'
                  draggable
                  onDragStart={e => this.onDragStart(e, idx)}
                  onDragEnd={this.onDragEnd}
                >
                  <FontAwesome key={`idxj_${idx}`} name='bars' />
                </div>
                <span style={{paddingRight: '5px', marginTop: '2px'}}>{idx}</span>
                <input key={`idxr_${idx}`} className='content' value={item} onChange={(e) => { this.itemChanged(e, idx) }} />
              </li>
            ))}
          </ul>

        </main>
      </div>
    )
  }
}

export default ListView
