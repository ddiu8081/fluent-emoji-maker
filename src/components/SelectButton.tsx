export default (props) => {
  const slot = props.children;
  const isHighlight = props.highlight;
  return (
    <div
      flex items-center justify-center
      bg-gray-100 h-14 w-14
      rounded-md
      border border-2 cursor-pointer
      transition-colors
      hover="bg-red-100 border-red-400"
      class={isHighlight() ? 'bg-red-100 border-red-400' : 'border-transparent'}
      onClick={props.onClick}
    >
      {slot}
    </div>
  )
}
