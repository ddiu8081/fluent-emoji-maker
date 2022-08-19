import { Component, createSignal, For } from 'solid-js'
import SelectButton from './components/SelectButton'

const App: Component = () => {
  const [headImages, setHeadImages] = createSignal([]);
  const [eyesImages, setEyesImages] = createSignal([]);
  const [mouthImages, setMouthImages] = createSignal([]);
  const [selectedHead, setSelectedHead] = createSignal(0);
  const [selectedHeadImage, setSelectedHeadImage] = createSignal('');
  const [selectedEyes, setSelectedEyes] = createSignal(0);
  const [selectedEyesImage, setSelectedEyesImage] = createSignal('');
  const [selectedMouth, setSelectedMouth] = createSignal(0);
  const [selectedMouthImage, setSelectedMouthImage] = createSignal('');  

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

  return (
    <>
      <h1 text="2xl" font="bold">Fluent Emoji Maker</h1>

      <div mt-4 flex="~ row" gap-2>
        <For each={headImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickHead, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <div mt-4 flex="~ row" gap-2>
        <For each={eyesImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickEyes, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <div mt-4 flex="~ row" gap-2>
        <For each={mouthImages()}>
          {(item, index) => (
            <SelectButton >
              <img onClick={[handleClickMouth, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>

      <div mt-8 border h-32>
        <img  w-24 h-24 src={ selectedHeadImage() } />
        <img  w-24 h-24 src={ selectedEyesImage() } />
        <img  w-24 h-24 src={ selectedMouthImage() } />
      </div>
    </>
  );
};

export default App;
