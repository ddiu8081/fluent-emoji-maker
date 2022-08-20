import { Component, createSignal, For, createEffect, onMount } from 'solid-js'
import SelectButton from './components/SelectButton'

type SvgImageModule = typeof import('*.svg')

const pathToImage = (path: string) => {
  return new Promise<HTMLImageElement>(resolve => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

const resolveImportGlobModule = async (modules: (() => Promise<SvgImageModule>)[]) => {
  const loadedModules = await Promise.all(modules.map(module => module()))

  return loadedModules.map(module => module.default)
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
  const selectedHeadImage = () => headImages()[selectedHead()]
  const selectedEyesImage = () => eyesImages()[selectedEyes()]
  const selectedMouthImage = () => mouthImages()[selectedMouth()]
  const selectedDetailImage = () => detailImages()[selectedDetail()]

  const loadImage = async () => {
    // head
    const headModules = import.meta.glob<SvgImageModule>('./assets/head/*.svg')
    const fullHeadImages = await resolveImportGlobModule(Object.values(headModules))
    setHeadImages(fullHeadImages)

    // eyes
    const eyesModules = import.meta.glob<SvgImageModule>('./assets/eyes/*.svg')
    const fullEyesImages = await resolveImportGlobModule(Object.values(eyesModules))
    setEyesImages(fullEyesImages)

    // mouth
    const mouthModules = import.meta.glob<SvgImageModule>('./assets/mouth/*.svg')
    const fullMouthImages = await resolveImportGlobModule(Object.values(mouthModules))
    setMouthImages(fullMouthImages)

    // detail
    const detailModules = import.meta.glob<SvgImageModule>('./assets/details/*.svg')
    const fullDetailImages = await resolveImportGlobModule(Object.values(detailModules))
    setDetailImages(fullDetailImages)
  }
  
  // lifecycle
  onMount(() => loadImage())

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
              <img onClick={[handleClickHead, index]} src={item} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <h2 mt-4 text-sm font-bold>Eyes</h2>
      <div flex="~ row wrap" gap-2>
        <For each={eyesImages()}>
          {(item, index) => (
            <SelectButton index={index()} highlight={() => index() === selectedEyes()}>
              <img onClick={[handleClickEyes, index]} src={item} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <h2 mt-4 text-sm font-bold>Mouth</h2>
      <div flex="~ row wrap" gap-2>
        <For each={mouthImages()}>
          {(item, index) => (
            <SelectButton index={index()} highlight={() => index() === selectedMouth()}>
              <img onClick={[handleClickMouth, index]} src={item} alt=""></img>
            </SelectButton>
          )}
        </For>
      </div>
      <h2 mt-4 text-sm font-bold>Detail</h2>
      <div flex="~ row wrap" gap-2>
        <For each={detailImages()}>
          {(item, index) => (
            <SelectButton index={index()} highlight={() => index() === selectedDetail()}>
              <img onClick={[handleClickDetail, index]} src={item} alt=""></img>
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
