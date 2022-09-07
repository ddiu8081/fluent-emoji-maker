import back from "../../public/back.png";

export default ({onDone,onBack}) => {
  return (
    <>
      <header style={{width:'100vw'}} box-border flex h-14 items-center justify-between px-3>
        <div font-extrabold tracking-wide w-5 h-5 onClick={onBack}>
          <img src={back} alt="" w-full h-full />
        </div>
        <button
          w-16
          h-8
          text-sm
          border-none
          rounded-lg
          text-white
          style={{ background: "#6E64FF" }}
          onClick={onDone}
        >
          Done
        </button>
      </header>
      {/* <Show when={!showDark()}>
        <div hidden md="block" class="glow-bg"></div>
      </Show> */}
    </>
  );
};
