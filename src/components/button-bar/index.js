import React from 'react'

import './style.css'
import FontAwesome from 'react-fontawesome'

function renderIcon (tab) {
  switch (tab) {
    case 'Data':
      return <FontAwesome name='database' />
    case 'Analyze':
      return <FontAwesome name='area-chart' />
    default:
      return <span />
  }
}

function renderItem (item, {active, onSelect}) {
  return <div
    className={'item' + (item === active ? ' is-active' : '')}
    key={item}
    onClick={() => onSelect(item)}
  >
    {renderIcon(item)}
    <span style={{marginLeft: '5px'}}>{item}</span>
  </div>
}

const ButtonBar = (props) => {
  return <div className='b-bar'>{ props.items.map(itm => renderItem(itm, props)) }</div>
}

export default ButtonBar
