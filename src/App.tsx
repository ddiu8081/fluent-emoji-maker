import { Component, createSignal, For, createEffect } from 'solid-js'
import SelectButton from './components/SelectButton'

const pathToImage = (path: string) => {
  return new Promise<HTMLImageElement>(resolve => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

const App: Component = () => {
  const [headImages, setHeadImages] = createSignal([]);
  const [eyesImages, setEyesImages] = createSignal([]);
  const [mouthImages, setMouthImages] = createSignal([]);
  const [detailImages, setDetailImages] = createSignal([]);

  const [selectedHead, setSelectedHead] = createSignal(0);
  const [selectedEyes, setSelectedEyes] = createSignal(0);
  const [selectedMouth, setSelectedMouth] = createSignal(0);
  const [selectedDetail, setSelectedDetail] = createSignal(0);
  const selectedHeadImage = () => headImages()[selectedHead()]?.default
  const selectedEyesImage = () => eyesImages()[selectedEyes()]?.default
  const selectedMouthImage = () => mouthImages()[selectedMouth()]?.default
  const selectedDetailImage = () => detailImages()[selectedDetail()]?.default

  const loadImage = async () => {
    // head
    const headModules = import.meta.glob('./assets/head/*.svg')
    const headValues = Object.values(headModules).map(m => m())
    const fullHeadImages = await Promise.all(headValues)
    setHeadImages(fullHeadImages)

    // eyes
    const eyesModules = import.meta.glob('./assets/eyes/*.svg')
    const eyesValues = Object.values(eyesModules).map(m => m())
    const fullEyesImages = await Promise.all(eyesValues)
    setEyesImages(fullEyesImages)

    // mouth
    const mouthModules = import.meta.glob('./assets/mouth/*.svg')
    const mouthValues = Object.values(mouthModules).map(m => m())
    const fullMouthImages = await Promise.all(mouthValues)
    setMouthImages(fullMouthImages)

    // detail
    const detailModules = import.meta.glob('./assets/details/*.svg')
    const detailValues = Object.values(detailModules).map(m => m())
    const fullDetailImages = await Promise.all(detailValues)
    setDetailImages(fullDetailImages)
  }
  loadImage()

  let canvas: HTMLCanvasElement, canvasSize = 32;

  createEffect(() => {
    const headPath = selectedHeadImage()
    const eyesPath = selectedEyesImage()
    const mouthPath = selectedMouthImage()
    const detailPath = selectedDetailImage()
    Promise.all([pathToImage(headPath), pathToImage(eyesPath), pathToImage(mouthPath), pathToImage(detailPath)]).then(images => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvasSize, canvasSize)
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasSize, canvasSize)
      images.forEach(img => {
        ctx.drawImage(img, 0, 0)
      })
    })
  })
  const handleClickHead = (i: number) => {
    setSelectedHead(i)
  }
  const handleClickEyes = (i: number) => {
    setSelectedEyes(i)
  }
  const handleClickMouth = (i: number) => {
    setSelectedMouth(i)
  }
  const handleClickDetail = (i: number) => {
    setSelectedDetail(i)
  }

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getRandom = () => {
    const head = randomInt(0, headImages().length - 1)
    const eyes = randomInt(0, eyesImages().length - 1)
    const mouth = randomInt(0, mouthImages().length - 1)
    const detail = randomInt(0, detailImages().length - 1)
    setSelectedHead(head)
    setSelectedEyes(eyes)
    setSelectedMouth(mouth)
    setSelectedDetail(detail)
  }

  const exportImage = () => {
    canvas.toBlob((blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${Date.now()}.png`
      a.click()
    })
  }

  return (
    <>
      <h1 text="2xl" font="bold">Fluent Emoji Maker</h1>

      <h2 mt-4 text-sm font-bold>Head</h2>
      <div flex="~ row wrap" gap-2>
        <For each={headImages()}>
          {(item, index) => (
            <SelectButton highlight={() => index() === selectedHead()}>
              <img onClick={[handleClickHead, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <h2 mt-4 text-sm font-bold>Eyes</h2>
      <div flex="~ row wrap" gap-2>
        <For each={eyesImages()}>
          {(item, index) => (
            <SelectButton index={index()} highlight={() => index() === selectedEyes()}>
              <img onClick={[handleClickEyes, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <h2 mt-4 text-sm font-bold>Mouth</h2>
      <div flex="~ row wrap" gap-2>
        <For each={mouthImages()}>
          {(item, index) => (
            <SelectButton index={index()} highlight={() => index() === selectedMouth()}>
              <img onClick={[handleClickMouth, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <h2 mt-4 text-sm font-bold>Detail</h2>
      <div flex="~ row wrap" gap-2>
        <For each={detailImages()}>
          {(item, index) => (
            <SelectButton index={index()} highlight={() => index() === selectedDetail()}>
              <img onClick={[handleClickDetail, index]} src={item.default} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>

      <div mt-8 border h-32>
        <canvas ref={canvas} width={canvasSize} height={canvasSize}></canvas>
      </div>

      <div mt-4>
        <button onClick={getRandom}>Random</button>
        <button onClick={() => exportImage()}>Export</button>
      </div>
    </>
  );
};

export default App;
