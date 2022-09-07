export default (props) => {
  const slot = props.children;
  const isHighlight = props.highlight;
  return (
    <div
      flex items-center justify-center m-auto my-2
      rounded-xl
      cursor-pointer
      transition-colors
      // hover="bg-violet-200 dark:bg-violet-200 border-violet-400"
      class={isHighlight() ? 'bg-gray-200' : ''}
      style={{width:'23vw',height:'23vw'}}
      onClick={props.onClick}
    >
      {slot}
    </div>
  )
}
