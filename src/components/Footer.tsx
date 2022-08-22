export default () => {
  return (
    <footer py-6 op-70>
      <p text-center text-xs text-neutral-400>
        <span pr-1>Images are from</span>
        <a
          text-neutral-400 border-b border-neutral-400 border-dotted
          hover:text-violet-400
          href="https://github.com/microsoft/fluentui-emoji" target="_blank"
        >
          Fluent Emoji
        </a>
      </p>
      <p mt-1 text-center text-xs text-neutral-400>
        <span pr-1>Made by</span>
        <a
          text-neutral-400 border-b border-neutral-400 border-dotted
          hover:text-violet-400
          href="https://ddiu.io" target="_blank"
        >
          Diu
        </a>
        <span px-1>|</span>
        <a
          text-neutral-400 border-b border-neutral-400 border-dotted
          hover:text-violet-400
          href="https://github.com/ddiu8081/fluent-emoji-maker" target="_blank"
        >
          Source Code
        </a>
      </p>
    </footer>
  )
}
