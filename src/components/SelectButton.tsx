export default (props) => {
  const slot = props.children;
  return (
    <div
      bg-gray-100 p-2
      rounded-md
      border border-2 border-transparent cursor-pointer
      transition-colors
      hover="bg-red-100 border-red-400"
    >
      {slot}
    </div>
  );
};
