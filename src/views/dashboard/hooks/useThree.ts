import {
  onMounted,
  ref,
  shallowRef,
  createVNode,
  defineComponent,
  h,
  render,
} from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { isFunction } from 'lodash'
import TWEEN from 'three/examples/jsm/libs/tween.module.js'
import Label from '../components/label.vue'
import * as THREE from 'three'
import * as _ from 'lodash'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

function useThree() {
  const container = ref<HTMLElement>()
  const scene = shallowRef<THREE.Scene>()
  const camera = shallowRef<THREE.Camera>()
  const renderer = shallowRef<THREE.WebGLRenderer>()
  const cssRenderer = shallowRef<CSS2DRenderer>()
  const controls = shallowRef<OrbitControls>()
  const composers = new Map()
  const mixers: any = []
  const clock = new THREE.Clock()
  const renderMixins = new Map()
  const animate = () => {
    const delta = new THREE.Clock().getDelta()
    renderer.value!.render(scene.value!, camera.value!)
    const mixerUpdateDelta = clock.getDelta()
    mixers.forEach((mixer: any) => mixer.update(mixerUpdateDelta))
    composers.forEach((composer) => composer.render(delta))
    renderMixins.forEach((mixin) => isFunction(mixin) && mixin())
    cssRenderer.value!.render(scene.value!, camera.value!)
    TWEEN.update()
    requestAnimationFrame(() => animate())
  }

  const boostrap = () => {
    const { clientWidth, clientHeight } = container.value
    //Scene
    scene.value = new THREE.Scene()
    //Camera
    camera.value = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      1,
      10000
    )
    camera.value.position.set(20, 15, 20)
    //Renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.value.shadowMap.enabled = false
    renderer.value.outputEncoding = THREE.sRGBEncoding
    renderer.value.setSize(clientWidth, clientHeight)
    renderer.value.setClearAlpha(0.5)
    container.value!.appendChild(renderer.value.domElement)
    //CssRenderer
    cssRenderer.value = new CSS2DRenderer()
    cssRenderer.value.setSize(clientWidth, clientHeight)
    cssRenderer.value.domElement.className = 'css2d-renderer'
    cssRenderer.value.domElement.style.position = 'absolute'
    cssRenderer.value.domElement.style.top = '0px'
    cssRenderer.value.domElement.style.pointerEvents = 'none'
    container.value!.appendChild(cssRenderer.value.domElement)

    //Controls
    controls.value = new OrbitControls(camera.value, renderer.value.domElement)
    controls.value.minPolarAngle = 0
    controls.value.enableDamping = true
    controls.value.dampingFactor = 0.1
    controls.value.target.set(0, 5, 0)
    controls.value.maxPolarAngle = Math.PI / 2
    controls.value.minDistance = 10
    controls.value.maxDistance = 100
    controls.value.update()

    //Lights
    const ambientLight = new THREE.AmbientLight(0x999999, 10)
    scene.value.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5) // 从正上方（不是位置）照射过来的平行光，0.7的强度
    directionalLight.position.set(20, 20, 20)
    directionalLight.position.multiplyScalar(1)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
    // scene.value.add(new THREE.DirectionalLightHelper(directionalLight, 5))
    scene.value.add(directionalLight)

    //composer
    // const composer = new EffectComposer(renderer.value)
    // const renderPass = new RenderPass(scene.value, camera.value)
    // composer.addPass(renderPass)
    // outlinePass.value = new OutlinePass(
    //   new THREE.Vector2(window.innerWidth, window.innerHeight),
    //   scene.value,
    //   camera.value
    // )
    // outlinePass.value.edgeStrength = 20.0 // 边框的亮度
    // outlinePass.value.edgeGlow = 1 // 光晕[0,1]
    // outlinePass.value.usePatternTexture = false // 是否使用父级的材质
    // outlinePass.value.edgeThickness = 10.0 // 边框宽度
    // outlinePass.value.downSampleRatio = 1 // 边框弯曲度
    // outlinePass.value.pulsePeriod = 1 // 呼吸闪烁的速度
    // outlinePass.value.visibleEdgeColor.set('#f20c00') // 呼吸显示的颜色
    // outlinePass.value.hiddenEdgeColor = new THREE.Color(0, 0, 0) // 呼吸消失的颜色
    // outlinePass.value.clear = true
    // composer.addPass(outlinePass.value)
    // composers.set('outline', composer)
  }

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/js/draco/gltf/')
  dracoLoader.setDecoderConfig({ type: 'js' })

  const loadGltf = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    const onCompleted = (object: GLTF, resolve: any) => resolve(object)
    return new Promise<GLTF>((resolve) => {
      loader.load(url, (object: GLTF) => onCompleted(object, resolve))
    })
  }

  onMounted(() => {
    boostrap()
    animate()
  })

  return {
    container,
    scene,
    camera,
    renderer,
    cssRenderer,
    controls,
    mixers,
    renderMixins,
    composers,
    loadGltf,
  }
}

export function useStation() {
  const { container, scene, camera, controls, loadGltf, renderMixins } =
    useThree()

  const devices = []
  let currentWarming

  const loadBaseModel = async () => {
    const glb = await loadGltf('/models/base.glb')
    scene.value.add(glb.scene)
    //箭头动画
    const textures = []
    glb.scene.traverse((mesh: any) => {
      mesh.name.indexOf('道路箭头') >= 0 && textures.push(mesh.material.map)
    })
    const animation = () => {
      textures.forEach((texture) => {
        if (texture.offset.y >= 10000) {
          texture.offset.y = 0
        } else {
          texture.offset.y += 0.02
        }
      })
    }
    renderMixins.set('road-arrow', animation)
  }

  const loadDeviceModel = async () => {
    const obj = await loadGltf('/models/devices.glb')
    devices.push(...obj.scene.children[4].children)

    scene.value.add(obj.scene)

    const handler = (event: MouseEvent) => {
      // const el = container.value as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.value!)
      const intersects = raycaster.intersectObject(scene.value!, true)
      console.log('intersects', intersects)
    }
    document.addEventListener('click', handler)

    const obj2 = await loadGltf('/models/lines.gltf')
    scene.value.add(obj2.scene)
    //添加设备label
    const componentRender = (component: any, props: any) => {
      const newComponent = defineComponent({
        render() {
          return h(component, props)
        },
      })
      const instance = createVNode(newComponent)
      render(instance, document.createElement('div'))
      return instance.el
    }

    const list = [
      {
        name: '1# 550KV I线高抗',
        position: [-32, 8, -22],
      },
      {
        name: '2# 550KV I线高抗',
        position: [-20.2, 8, -22],
      },
      {
        name: '3# 550KV I线高抗',
        position: [-8.4, 8, -22],
      },
      {
        name: '4# 550KV I线高抗',
        position: [3.4, 8, -22],
      },
      {
        name: '5# 550KV I线高抗',
        position: [15.2, 8, -22],
      },
      {
        name: '6# 550KV I线高抗',
        position: [27, 8, -22],
      },
      {
        name: '1# 变压器',
        position: [-32, 8, -6],
      },
      {
        name: '2# 变压器',
        position: [-20.2, 8, -6],
      },
      {
        name: '3# 变压器',
        position: [-8.4, 8, -6],
      },
      {
        name: '4# 变压器',
        position: [3.4, 8, -6],
      },
      {
        name: '5# 变压器',
        position: [15.2, 8, -6],
      },
      {
        name: '6# 变压器',
        position: [27, 8, -6],
      },
      // {
      //   name: '1# 隔离开关',
      //   position: [-33, 6, 14],
      // },
      // {
      //   name: '2# 隔离开关',
      //   position: [-21.2, 6, 14],
      // },
      // {
      //   name: '3# 隔离开关',
      //   position: [-9.4, 6, 14],
      // },
      // {
      //   name: '4# 隔离开关',
      //   position: [2.4, 6, 14],
      // },
      // {
      //   name: '5# 隔离开关',
      //   position: [14.2, 6, 14],
      // },
      // {
      //   name: '6# 隔离开关',
      //   position: [26, 6, 14],
      // },
    ]

    list.forEach((item) => {
      const label = new CSS2DObject(componentRender(Label, item))
      label.position.set(...item.position)
      scene.value.add(label)
    })
  }

  const cameraTween = (start, stop, during, time) => {
    const tween = new TWEEN.Tween(start).to(stop, during).easing(time)
    tween.onUpdate((object) => {
      camera.value.position.x = object.x1
      camera.value.position.y = object.y1
      camera.value.position.z = object.z1
      controls.value.target.x = object.x2
      controls.value.target.y = object.y2
      controls.value.target.z = object.z2
      controls.value.update()
    })
    return tween
  }

  const moveCamera = (oldP, oldT, newP, newT, callback) => {
    let tween = new TWEEN.Tween({
      x1: oldP.x,
      y1: oldP.y,
      z1: oldP.z,
      x2: oldT.x,
      y2: oldT.y,
      z2: oldT.z,
    })
    tween.to(
      {
        x1: newP.x,
        y1: newP.y,
        z1: newP.z,
        x2: newT.x,
        y2: newT.y,
        z2: newT.z,
      },
      1000
    )
    // 每一帧执行函数 、这个地方就是核心了、每变一帧跟新一次页面元素
    tween.onUpdate((object) => {
      camera.value.position.set(object.x1, object.y1, object.z1)
      controls.value.target.x = object.x2
      controls.value.target.y = object.y2
      controls.value.target.z = object.z2
      controls.value.update()
    })

    // 动画完成后的执行函数
    tween.onComplete(() => {
      controls.value.enabled = true
      callback && callback()
    })

    tween.easing(TWEEN.Easing.Cubic.InOut)
    tween.start()
  }
  let inspectTween
  const startInspect = (callback) => {
    const positions = [
      {
        x1: -47.46,
        y1: 1.45,
        z1: 6.01,
        x2: -25.23,
        y2: 1.45,
        z2: 6.01,
      },
      {
        x1: 34.92,
        y1: 1.45,
        z1: 6.01,
        x2: 47.16,
        y2: 1.45,
        z2: 6.01,
      },
      {
        x1: 39.27,
        y1: 1.45,
        z1: 8.29,
        x2: 39.3,
        y2: 1.45,
        z2: 4.67,
      },
      {
        x1: 38.94,
        y1: 1.45,
        z1: -15.85,
        x2: 38.94,
        y2: 1.45,
        z2: -17.77,
      },
      {
        x1: 40.81,
        y1: 1.45,
        z1: -18.95,
        x2: 38.31,
        y2: 1.45,
        z2: -18.7,
      },
      {
        x1: -38.12,
        y1: 1.45,
        z1: -18.95,
        x2: -47.36,
        y2: 1.45,
        z2: -18.09,
      },
      {
        x1: -42.01,
        y1: 1.45,
        z1: -19.7,
        x2: -41.91,
        y2: 1.45,
        z2: -17.7,
      },
      {
        x1: -41.86,
        y1: 1.45,
        z1: 1.82,
        x2: -41.83,
        y2: 1.45,
        z2: 3.29,
      },
      {
        x1: -44.21,
        y1: 1.45,
        z1: 5.97,
        x2: -41.51,
        y2: 1.45,
        z2: 5.61,
      },
      {
        x1: 20,
        y1: 15,
        z1: 20,
        x2: 0,
        y2: 5,
        z2: 0,
      },
    ]
    const current = {
      x1: camera.value.position.x,
      y1: camera.value.position.y,
      z1: camera.value.position.z,
      x2: controls.value.target.x,
      y2: controls.value.target.y,
      z2: controls.value.target.z,
    }
    inspectTween = cameraTween(
      current,
      positions[0],
      2000,
      TWEEN.Easing.Linear.None
    )
    // 漫游点B
    const tweenB = cameraTween(
      current,
      positions[1],
      6000,
      TWEEN.Easing.Linear.None
    )
    // 漫游点C
    const tweenC = cameraTween(
      current,
      positions[2],
      2000,

      TWEEN.Easing.Quadratic.InOut
    )
    // 漫游点D
    const tweenD = cameraTween(
      current,
      positions[3],
      2500,

      TWEEN.Easing.Linear.None
    )
    // 漫游点E
    const tweenE = cameraTween(
      current,
      positions[4],
      2000,

      TWEEN.Easing.Quadratic.InOut
    )
    // 漫游点F
    const tweenF = cameraTween(
      current,
      positions[5],
      6000,
      TWEEN.Easing.Linear.None
    )
    // 漫游点G
    const tweenG = cameraTween(
      current,
      positions[6],
      2000,
      TWEEN.Easing.Quadratic.InOut
    )
    // 漫游点H
    const tweenH = cameraTween(
      current,
      positions[7],
      2500,
      TWEEN.Easing.Linear.None
    )
    // 漫游点I
    const tweenI = cameraTween(
      current,
      positions[8],
      2000,
      TWEEN.Easing.Quadratic.InOut
    )
    // 漫游点J
    const tweenJ = cameraTween(
      current,
      positions[9],
      2000,
      TWEEN.Easing.Quadratic.InOut
    )
    inspectTween.chain(tweenB)
    tweenB.chain(tweenC)
    tweenC.chain(tweenD)
    tweenD.chain(tweenE)
    tweenE.chain(tweenF)
    tweenF.chain(tweenG)
    tweenG.chain(tweenH)
    tweenH.chain(tweenI)
    tweenI.chain(tweenJ)
    inspectTween.start()
    tweenJ.onComplete(() => {
      callback && callback()
    })
  }

  const stopInspect = () => {
    inspectTween.stop()
    const current = {
      x1: camera.value.position.x,
      y1: camera.value.position.y,
      z1: camera.value.position.z,
      x2: controls.value.target.x,
      y2: controls.value.target.y,
      z2: controls.value.target.z,
    }
    cameraTween(
      current,
      {
        x1: 20,
        y1: 15,
        z1: 20,
        x2: 0,
        y2: 5,
        z2: 0,
      },
      2000,
      TWEEN.Easing.Linear.None
    ).start()
  }

  let warmingTimer
  const startWarming = () => {
    warmingTimer = setInterval(() => {
      if (currentWarming) {
        currentWarming.traverse((mesh) => {
          if (!(mesh instanceof THREE.Mesh)) return undefined
          mesh.material.emissive.setHex(mesh.currentHex)
          return undefined
        })
      }
      const index = _.sample([0, 1, 2, 3, 4, 5])

      currentWarming = devices[index]

      moveCamera(
        camera.value.position,
        controls.value.target,
        {
          x: -31 + 12 * index,
          y: 2 + 20,
          z: -7 + 20,
        },
        {
          x: -31 + 12 * index,
          y: 0,
          z: -7,
        },
        () => {}
      )
      currentWarming.traverse((mesh) => {
        if (!(mesh instanceof THREE.Mesh)) return undefined
        mesh.material = mesh.material.clone()
        mesh.currentHex = mesh.currentHex ?? mesh.material.emissive.getHex()
        mesh.material.emissive.setHex(0xff0000)
        return undefined
      })
    }, 2000)
  }

  const stopWarming = () => {
    if (currentWarming) {
      currentWarming.traverse((mesh) => {
        if (!(mesh instanceof THREE.Mesh)) return undefined
        mesh.material.emissive.setHex(mesh.currentHex)
        return undefined
      })
    }
    window.clearInterval(warmingTimer)
    cameraTween(
      {
        x1: camera.value.position.x,
        y1: camera.value.position.y,
        z1: camera.value.position.z,
        x2: controls.value.target.x,
        y2: controls.value.target.y,
        z2: controls.value.target.z,
      },
      {
        x1: 20,
        y1: 15,
        z1: 20,
        x2: 0,
        y2: 5,
        z2: 0,
      },
      2000,
      TWEEN.Easing.Linear.None
    ).start()
  }

  onMounted(() => {
    loadBaseModel()
    loadDeviceModel()

    // onUnmounted(() => document.removeEventListener('click', handler))
  })
  return {
    container,
    startInspect,
    stopInspect,
    startWarming,
    stopWarming,
  }
}

export default useThree
