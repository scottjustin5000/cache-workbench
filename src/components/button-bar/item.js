import './style.css'
const Item = ({instanceKey, onSelected, active, title}) => {
  return <div
    onMouseDown={() => {
      onSelected(instanceKey)
    }}
    className={active ? 'tab-item active' : 'tab-item'}
  >
    {title}
  </div>
}
export default Item
