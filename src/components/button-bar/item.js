import './style.css'
const Item = ({instanceKey, onSelected, active, title}) => {
  return <div
    onMouseDown={() => {
      onSelected(instanceKey)
    }}
    className={active ? 'b-bar-item active' : 'b-bar-item'}
  >
    {title}
  </div>
}
export default Item
