import { Component, createSignal, For } from 'solid-js'
import SelectButton from './components/SelectButton'

const App: Component = () => {
  const [headImages, setHeadImages] = createSignal([]);
  const [eyesImages, setEyesImages] = createSignal([]);
  const [mouthImages, setMouthImages] = createSignal([]);
  const [detailImages, setDetailImages] = createSignal([]);

  const [selectedHead, setSelectedHead] = createSignal(0);
  const [selectedHeadImage, setSelectedHeadImage] = createSignal('');
  const [selectedEyes, setSelectedEyes] = createSignal(0);
  const [selectedEyesImage, setSelectedEyesImage] = createSignal('');
  const [selectedMouth, setSelectedMouth] = createSignal(0);
  const [selectedMouthImage, setSelectedMouthImage] = createSignal('');
  const [selectedDetail, setSelectedDetail] = createSignal(0);
  const [selectedDetailImage, setSelectedDetailImage] = createSignal('');

  const loadImage = async () => {
    // head
    const headModules = await import.meta.glob('./assets/head/*.svg')
    const headValues = Object.values(headModules).map(m => m())
    const fullHeadImages = await Promise.all(headValues)
    setHeadImages(fullHeadImages)

    // eyes
    const eyesModules = await import.meta.glob('./assets/eyes/*.svg')
    const eyesValues = Object.values(eyesModules).map(m => m())
    const fullEyesImages = await Promise.all(eyesValues)
    setEyesImages(fullEyesImages)

    // mouth
    const mouthModules = await import.meta.glob('./assets/mouth/*.svg')
    const mouthValues = Object.values(mouthModules).map(m => m())
    const fullMouthImages = await Promise.all(mouthValues)
    setMouthImages(fullMouthImages)

    // detail
    const detailModules = await import.meta.glob('./assets/details/*.svg')
    const detailValues = Object.values(detailModules).map(m => m())
    const fullDetailImages = await Promise.all(detailValues)
    setDetailImages(fullDetailImages)
  }
  loadImage()

  const handleClickHead = (i) => {
    setSelectedHead(i)
    console.log(headImages()[i()].default)
    setSelectedHeadImage(headImages()[i()].default)
  }
  const handleClickEyes = (i) => {
    setSelectedEyes(i)
    setSelectedEyesImage(eyesImages()[i()].default)
  }
  const handleClickMouth = (i) => {
    setSelectedMouth(i)
    setSelectedMouthImage(mouthImages()[i()].default)
  }
  const handleClickDetail = (i) => {
    setSelectedDetail(i)
    setSelectedDetailImage(detailImages()[i()].default)
  }

  return (
    <>
      <h1 text="2xl" font="bold">Fluent Emoji Maker</h1>

      <div mt-4 flex="~ row wrap" gap-2>
        <For each={headImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickHead, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <div mt-8 flex="~ row wrap" gap-2>
        <For each={eyesImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickEyes, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <div mt-8 flex="~ row wrap" gap-2>
        <For each={mouthImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickMouth, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <div mt-8 flex="~ row wrap" gap-2>
        <For each={detailImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickDetail, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>

      <div mt-8 border h-32>
        <img class="absolute" w-24 h-24 src={ selectedHeadImage() } />
        <img class="absolute" w-24 h-24 src={ selectedEyesImage() } />
        <img class="absolute" w-24 h-24 src={ selectedMouthImage() } />
        <img class="absolute" w-24 h-24 src={ selectedDetailImage() } />
      </div>
    </>
  );
};

export default App;
