import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import './style.css'

class ListEditor extends Component {
  constructor (props) {
    super(props)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.itemChanged = this.itemChanged.bind(this)
    this.addItem = this.addItem.bind(this)
  }

  onDragStart (e, index) {
    this.draggedItem = this.props.items[index]
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.parentNode)
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20)
  }

  onDragOver (index) {
    const draggedOverItem = this.props.items[index]

    if (this.draggedItem === draggedOverItem) {
      return
    }

    // filter out the currently dragged item
    let items = this.props.items.filter(item => item !== this.draggedItem)

    items.splice(index, 0, this.draggedItem)

    this.props.updateItems(items)
  };

  onDragEnd () {
    this.draggedIdx = null
  }

  itemChanged (item, index) {
    const items = this.props.items.map((itm, idx) => {
      if (idx === index) {
        return item.target.value
      }
      return itm
    })
    this.props.updateItems(items)
  }

  addItem (e) {
    e.preventDefault()
    const items = [...[' '], ...this.props.items]
    this.props.updateItems(items)
  }

  deleteItem (item, index) {
    const items = this.props.items.filter((_, idx) => {
      return (idx !== index)
    })
    this.props.updateItems(items)
  }

  render () {
    return (
      <div className='list-view'>
        <main>
          <div className='list-view-header'>
            <div style={{marginRight: '5px'}}>
              <button style={{cursor: 'pointer', width: '24px', margin: '10px'}} onClick={this.addItem}><FontAwesome name='plus' /></button>
            </div>
          </div>
          <ul>
            {(this.props.items || []).map((item, idx) => (
              <li key={`idxt_${idx}`} onDragOver={() => this.onDragOver(idx)} style={{display: 'flex', margin: '5px'}}>
                <div
                  style={{marginTop: '12px'}}
                  key={`idx_${idx}`}
                  className='drag'
                  draggable
                  onDragStart={e => this.onDragStart(e, idx)}
                  onDragEnd={this.onDragEnd}
                >
                  <FontAwesome key={`idxj_${idx}`} name='bars' />
                </div>
                <span className='list-item-index'>{idx}</span>
                <input key={`idxr_${idx}`} className='content' value={item} onChange={(e) => { this.itemChanged(e, idx) }} />
                <button className='delete-item-btn' onClick={(e) => { this.deleteItem(e, idx) }} title='Delete Item'><FontAwesome name='trash-o' /></button>
              </li>
            ))}
          </ul>

        </main>
      </div>
    )
  }
}

ListEditor.propTypes = {
  items: PropTypes.array,
  updateItems: PropTypes.func
}
export default ListEditor
