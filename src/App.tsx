import { Component, createSignal, For } from 'solid-js'
import Comp from './Comp'
import image from './assets/head/1.svg'


const App: Component = () => {
  const [headImages, setHeadImages] = createSignal([]);
  const [eyesImages, setEyesImages] = createSignal([]);
  const [mouthImages, setMouthImages] = createSignal([]);

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

  const eyesModules = import.meta.glob('./assets/eyes/*.svg')
  const eyesKeys = Object.keys(eyesModules)

  const mouthModules = import.meta.glob('./assets/mouth/*.svg')
  const mouthKeys = Object.keys(mouthModules)

  const handleClick = (i) => {
    alert('click' + i());
  }

  return (
    <>
      <h1 text="2xl" font="bold">Fluent Emoji Maker</h1>

      <div>
        <For each={headImages()}>
          {item => (
            <img src={item.default} alt=""></img>
          )}
        </For>
      </div>
      <div mt-4>
        <For each={eyesImages()}>
          {item => (
            <img src={item.default} alt=""></img>
          )}
        </For>
      </div>
      <div mt-4>
        <For each={mouthImages()}>
          {item => (
            <img src={item.default} alt=""></img>
          )}
        </For>
      </div>

      <div mt-4>
        <img w-24 src={image} alt="" />
      </div>

      <div mt-8 border h-32>
        {/* {images} */}
      </div>
    </>
  );
};

export default App;
