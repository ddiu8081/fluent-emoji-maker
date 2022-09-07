import { Component, createSignal, createEffect, onMount } from 'solid-js'
import { For, Switch, Match, Show } from 'solid-js'
import SelectButton from './components/SelectButton'
import Header from './components/Header'
import random from "../public/random.png";

function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
  } else {
      document.addEventListener(
          'WebViewJavascriptBridgeReady'
          , function() {
              callback(WebViewJavascriptBridge)
          },
          false
      );
  }
}
connectWebViewJavascriptBridge(function(bridge) {
  bridge.init(function(message, responseCallback) {
      console.log('JS got a message', message);
      let data = {
          'Javascript Responds': '测试中文!'
      };

      if (responseCallback) {
          console.log('JS responding with', data);
          responseCallback(data);
      }
  });

  bridge.registerHandler("functionInJs", function(data, responseCallback) {
      if (responseCallback) {
          let responseData = "Javascript Says Right back aka!";
          responseCallback(responseData);
      }
  });
})

type PngImageModule = typeof import('*.png')
type ImportModuleFunction = () => Promise<PngImageModule>

const pathToImage = (path: string) => {
  return new Promise<HTMLImageElement | null>(resolve => {
    if (path === '') {
      resolve(null)
    }
    const img = new Image(512, 512)
    img.src = path
    img.onload = (e) => {
      // console.log(e)
      resolve(img)
    }
  })
}

const resolveImportGlobModule = async (modules: Record<string, ImportModuleFunction>) => {
  const imports = Object.values(modules).map(importFn => importFn())
  const loadedModules = await Promise.all(imports)

  return loadedModules.map(module => module.default)
}

type EmojiSlice = 'head' | 'eyes' | 'eyebrows' | 'mouth' | 'detail'
const tabs: EmojiSlice[] = ['head', 'eyes', 'eyebrows', 'mouth', 'detail']

const App: Component = () => {
  const [selectedTab, setSelectedTab] = createSignal<EmojiSlice>('head')
  const [isShadow, setIsShadow] = createSignal<boolean>(false)
  const [isHome, setIsHome] = createSignal<boolean>(true)
  const [images, setImages] = createSignal({
    head: [],
    eyes: [],
    eyebrows: [],
    mouth: [],
    detail: [],
  })
  const [selectedIndex, setSelectedIndex] = createSignal({
    head: 0,
    eyes: 0,
    eyebrows: 0,
    mouth: 0,
    detail: 0,
  })
  const selectedImage = () => {
    return {
      head: images().head[selectedIndex().head],
      eyes: images().eyes[selectedIndex().eyes],
      eyebrows: images().eyebrows[selectedIndex().eyebrows],
      mouth: images().mouth[selectedIndex().mouth],
      detail: images().detail[selectedIndex().detail],
    }
  }

  createEffect(()=>{
    setTimeout(() => {
      setIsHome(false)
    }, 2000);
  })

  const loadImage = async () => {
    // head
    const headModules = import.meta.glob<PngImageModule>('./assets/head/*.png')
    const fullHeadImages = await resolveImportGlobModule(headModules)
    // eyes
    const eyesModules = import.meta.glob<PngImageModule>('./assets/eyes/*.png')
    const fullEyesImages = await resolveImportGlobModule(eyesModules)
    // eyebrows
    const eyebrowsModules = import.meta.glob<PngImageModule>('./assets/eyebrows/*.png')
    const fullEyebrowsImages = await resolveImportGlobModule(eyebrowsModules)
    // mouth
    const mouthModules = import.meta.glob<PngImageModule>('./assets/mouth/*.png')
    const fullMouthImages = await resolveImportGlobModule(mouthModules)
    // detail
    const detailModules = import.meta.glob<PngImageModule>('./assets/details/*.png')
    const fullDetailImages = await resolveImportGlobModule(detailModules)
    
    setImages({
      head: fullHeadImages,
      eyes: ['', ...fullEyesImages],
      eyebrows: ['', ...fullEyebrowsImages],
      mouth: ['', ...fullMouthImages],
      detail: ['', ...fullDetailImages],
    })
    getRandom()
  }
  
  // lifecycle
  onMount(() => {
    loadImage()
  })

  let canvas: HTMLCanvasElement, canvasSize = 512;

  createEffect(() => {
    const headPath = selectedImage().head
    const eyesPath = selectedImage().eyes
    const eyebrowsPath = selectedImage().eyebrows
    const mouthPath = selectedImage().mouth
    const detailPath = selectedImage().detail
    Promise.all([
      pathToImage(headPath),
      pathToImage(eyesPath),
      pathToImage(eyebrowsPath),
      pathToImage(mouthPath),
      pathToImage(detailPath)
    ]).then(images => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      images.forEach(img => {
        img && ctx.drawImage(img, 0, 0, canvasSize, canvasSize)
      })
      canvas.classList.add('animation')
      setTimeout(() => {
        canvas.classList.remove('animation')
      }, 500)
    })
   
    
  })

  const handleSelectItem = ({tab, index}: {tab: string, index: number}) => {
    if(selectedIndex()[tab]===index&&selectedTab()!=='head'){
      setSelectedIndex({ ...selectedIndex(), [tab]: 0 })
    }else{
      setSelectedIndex({ ...selectedIndex(), [tab]: index })
    }
  }

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getRandom = () => {
    const randomIndexes = {
      head: randomInt(0, images().head.length - 1),
      eyes: randomInt(0, images().eyes.length - 1),
      eyebrows: randomInt(0, images().eyebrows.length - 1),
      mouth: randomInt(0, images().mouth.length - 1),
      detail: randomInt(0, images().detail.length - 1),
    }
    setSelectedIndex(randomIndexes)
  }

  
  const onDone = () => {
    window.WebViewJavascriptBridge.callHandle(
      'openPage',
       // 事件参数
      {  
        'page': 'publish',
        'portal': 'emojimaker',
        'data':{'image': canvas.toDataURL('image/webp',1)}
      },
      function(responseData) {
        console.log(responseData);
      }
    );
  }

  const onBack = () => {
    window.WebViewJavascriptBridge.callHandle(
      'finishPage',
      function(responseData) {
        console.log(responseData);
      }
    );
  }

  return (
    <div box-border overflow-hidden style={{'padding-top':'355px'}}>
      <div z-2 class="fixed top-0 left-0">
        <div z-2  style={{background:'#F2F3F4 '}}><Header onDone={onDone} onBack={onBack} /></div>
        <div px-3 style={{background:'#F2F3F4'}}>
          <div flex items-center justify-center w-50 h-50 border-2 border-neutral-500 border-op-20 rounded-2xl m-auto>
              <canvas ref={canvas} width={canvasSize} height={canvasSize} w-45 h-45 class="animation"></canvas>
          </div>
          <div class='relative' h-6>
            <div
              flex items-center justify-center w-12 h-12 rounded-full
              bg-neutral-400
              text-black
              cursor-pointer transition-colors
              // hover="bg-violet-200"
              class="absolute right-1 bottom-3"
              onClick={getRandom}
            >
              <img src={random} alt="" w-6 h-6 />
            </div>
          </div>
        </div>
        <header flex z-1 bg-white items-center w-full box-border px-4 py-2 justify-around  class={isShadow()?'shadow-md':''} >
            <For each={tabs}>
              {(item, index) => (
                <div 
                  flex items-center justify-center
                  h-13 w-13 rounded-lg
                  cursor-pointer transition-colors
                  // hover="bg-violet-200 dark:bg-violet-200"
                  class={selectedTab() === item ? 'bg-gray-200' : ''}
                  onClick={() => {
                    console.log(item);
                    
                    setSelectedTab(item)
                    setIsShadow(false)
                  }}
                >
                  <Show
                    when={selectedImage()[item]}
                  >
                    <img src={selectedImage()[item]} alt={selectedTab() + index()} h-12 w-12></img>
                  </Show>
                </div>
              )}
            </For>
          </header>
      </div>
      <main
        items-center justify-center gap-4
        w-full px-6 mx-auto bg-op-80
        class='relative'
        box-border
        dark:bg-dark
        md:px-24
        onTouchMove={()=>{if(document.documentElement.scrollTop===0){
          isShadow()===true && setIsShadow(false)
        }else{
          isShadow()===false && setIsShadow(true)
        }}}
      >
        <div w-full>
          <main >
            <div class='grid grid-cols-3'>
              {selectedTab()!=='head'&&<div flex justify-center items-center 
              onClick={[handleSelectItem, {tab: selectedTab(), index: 0 }]}>
                <img src="../public/clear.png" alt="" style={{width:'18vw',height:'18vw'}} />
              </div>}
              <Switch>
                <For each={Object.keys(images())}>
                  {(tab: EmojiSlice) => (
                    <Match when={tab === selectedTab()}>
                      <For each={images()[tab]}>
                        {(item, index) => (
                          <>
                            {item==='' ? <></> : <SelectButton
                              highlight={() => index() === selectedIndex()[selectedTab()]}
                              onClick={[handleSelectItem, {tab: selectedTab(), index: index() }]}
                            >
                              <Show when={item}>
                                <img src={item} alt={selectedTab() + index()} style={{width:'21vw',height:'21vw'}}></img>
                              </Show>
                            </SelectButton>}
                          </>
                        )}
                      </For>
                    </Match>
                  )}
                </For>
              </Switch>
            </div>
          </main>
        </div>
      </main>
      {isHome() && (
        <div z-3 class='fixed left-0 top-0' style={{
          width:'100vw',
          height:'100vh',
          background:'url(../public/bg_emoji.png) left top no-repeat',
          "background-size":"100vw 100vh"
        }}>
          <div style={{width:'68vw',height:'87vw','margin-top':'26vw'}} m-auto>
            <img w-full h-full  src="../public/banner.png" alt=""  />
          </div>
          <div style={{width:'70vw'}} h-5 bg-white m-auto mt-15 rounded-full overflow-hidden>
            <div class='myLoading'></div>
          </div>
          <h5 text-white text-lg text-center mt-2>Loading...</h5>
      </div>
      )}
    </div>
  )
}

export default App
