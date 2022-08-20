import { Component, createSignal, createEffect, onMount } from 'solid-js'
import { For } from 'solid-js'
import SelectButton from './components/SelectButton'

type SvgImageModule = typeof import('*.svg')
type ImportModuleFunction = () => Promise<SvgImageModule>

const pathToImage = (path: string) => {
  return new Promise<HTMLImageElement>(resolve => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

const resolveImportGlobModule = async (modules: Record<string, ImportModuleFunction>) => {
  const imports = Object.values(modules).map(importFn => importFn())
  const loadedModules = await Promise.all(imports)

  return loadedModules.map(module => module.default)
}

type EmojiSlice = 'head' | 'eyes' | 'mouth' | 'detail'
const tabs: EmojiSlice[] = ['head', 'eyes', 'mouth', 'detail']

const App: Component = () => {
  const [selectedTab, setSelectedTab] = createSignal<EmojiSlice>('head')
  const [images, setImages] = createSignal({
    head: [],
    eyes: [],
    mouth: [],
    detail: [],
  })
  const [selectedIndex, setSelectedIndex] = createSignal({
    head: 0,
    eyes: 0,
    mouth: 0,
    detail: 0,
  })
  const selectedImage = () => {
    return {
      head: images().head[selectedIndex().head],
      eyes: images().eyes[selectedIndex().eyes],
      mouth: images().mouth[selectedIndex().mouth],
      detail: images().detail[selectedIndex().detail],
    }
  }

  const loadImage = async () => {
    // head
    const headModules = import.meta.glob<SvgImageModule>('./assets/head/*.svg')
    const fullHeadImages = await resolveImportGlobModule(headModules)
    // eyes
    const eyesModules = import.meta.glob<SvgImageModule>('./assets/eyes/*.svg')
    const fullEyesImages = await resolveImportGlobModule(eyesModules)
    // mouth
    const mouthModules = import.meta.glob<SvgImageModule>('./assets/mouth/*.svg')
    const fullMouthImages = await resolveImportGlobModule(mouthModules)
    // detail
    const detailModules = import.meta.glob<SvgImageModule>('./assets/details/*.svg')
    const fullDetailImages = await resolveImportGlobModule(detailModules)
    setImages({
      head: fullHeadImages,
      eyes: fullEyesImages,
      mouth: fullMouthImages,
      detail: fullDetailImages,
    })
  }
  
  // lifecycle
  onMount(() => loadImage())

  let canvas: HTMLCanvasElement, imageSize = 160;

  createEffect(() => {
    const headPath = selectedImage().head
    const eyesPath = selectedImage().eyes
    const mouthPath = selectedImage().mouth
    const detailPath = selectedImage().detail
    Promise.all([pathToImage(headPath), pathToImage(eyesPath), pathToImage(mouthPath), pathToImage(detailPath)]).then(images => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, imageSize, imageSize)
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, imageSize, imageSize)
      images.forEach(img => {
        ctx.drawImage(img, 0, 0, imageSize, imageSize)
      })
    })
  })

  const handleSelectItem = ({tab, index}) => {
    setSelectedIndex({ ...selectedIndex(), [tab]: index() })
  }

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getRandom = () => {
    const randomIndexes = {
      head: randomInt(0, images().head.length - 1),
      eyes: randomInt(0, images().eyes.length - 1),
      mouth: randomInt(0, images().mouth.length - 1),
      detail: randomInt(0, images().detail.length - 1),
    }
    setSelectedIndex(randomIndexes)
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
      <div
        flex="~ col" items-center justify-center gap-4
        max-w="65ch" p-12
        mx-auto
        border
      >
        <div mt-8 border>
          <canvas ref={canvas} width={imageSize} height={imageSize}></canvas>
        </div>
        <div border w-full>
          <header flex items-center gap-3 p-4 border-b>
            <For each={tabs}>
              {item => (
                <div 
                  p-2 border
                  class={selectedTab() === item ? 'border-red-500' : ''}
                  onClick={() => setSelectedTab(item)}
                >
                  <img src={selectedImage()[item]} h-12></img>
                </div>
              )}
            </For>
          </header>
          <main p-4>
            <div flex="~ row wrap" gap-2>
              <For each={images()[selectedTab()]}>
                {(item, index) => (
                  <SelectButton highlight={() => index() === selectedIndex()[selectedTab()]}>
                    <img onClick={[handleSelectItem, {tab: selectedTab(), index }]} src={item} alt=""></img>
                  </SelectButton>
                )}
              </For>
            </div>
          </main>
        </div>
        <div>
          <button onClick={getRandom}>Random</button>
          <button onClick={() => exportImage()}>Export</button>
        </div>
      </div>
    </>
  );
};

export default App;
