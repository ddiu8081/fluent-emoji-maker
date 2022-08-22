export default (props) => {
  const slot = props.children;
  const isHighlight = props.highlight;
  return (
    <div
      flex items-center justify-center h-14 w-14
      rounded-md
      border border-2 cursor-pointer
      transition-colors
      hover="bg-violet-200 dark:bg-violet-200 border-violet-400"
      class={isHighlight() ? 'bg-violet-100 border-violet-400' : 'bg-neutral-100 dark:bg-neutral-600 border-transparent'}
      onClick={props.onClick}
    >
      {slot}
    </div>
  )
}
