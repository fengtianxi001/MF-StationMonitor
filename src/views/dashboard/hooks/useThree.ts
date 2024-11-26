import * as THREE from 'three'
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
import TWEEN from '@tweenjs/tween.js'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import Label from '../components/label.vue'
import { isFunction } from 'lodash'

export function useThree() {
  const container = ref()
  const scene = shallowRef()
  const camera = shallowRef()
  const renderer = shallowRef()
  const cssRenderer = shallowRef()
  const controls = shallowRef()
  const composer = shallowRef()
  const mixins = []

  const animate = (time) => {
    // const delta = new THREE.Clock().getDelta()

    // const mixerUpdateDelta = clock.getDelta()
    // mixers.forEach((mixer: any) => mixer.update(mixerUpdateDelta))
    // composers.forEach((composer) => composer.render(delta))
    mixins.forEach((mixin) => isFunction(mixin) && mixin())
    renderer.value!.render(scene.value!, camera.value!)
    cssRenderer.value!.render(scene.value!, camera.value!)
    TWEEN.update(time)
    requestAnimationFrame((time) => animate(time))
  }
  const boostrapScene = () => {
    const _scene = new THREE.Scene()
    scene.value = _scene

    const geometry = new THREE.PlaneGeometry(500, 500)

    // 创建材质，并加载网格贴图
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/textures/grid.png') // 替换为你的贴图路径
    texture.repeat.set(3, 3) // 在这里设置平面上贴图的重复次数
    texture.wrapS = THREE.RepeatWrapping // 横向重复
    texture.wrapT = THREE.RepeatWrapping // 纵向重复
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0x49a1f0,
      transparent: true, // 允许透明度
      opacity: 1.5,
    })
    // 创建网格对象
    const plane = new THREE.Mesh(geometry, material)
    plane.position.y = -5
    plane.rotation.x = -Math.PI / 2
    scene.value.add(plane)
  }
  const boostrapCamera = () => {
    const { clientWidth, clientHeight } = container.value
    const fov = 45
    const aspect = clientWidth / clientHeight
    const near = 1
    const far = 1000 * 10
    const _camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    _camera.position.x = 20 // 正视
    _camera.position.y = 15 // 俯视
    _camera.position.z = 20 // 离模型有多远
    camera.value = _camera
  }
  const boostrapRenderer = () => {
    const { clientWidth, clientHeight } = container.value
    const _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    _renderer.shadowMap.enabled = false
    _renderer.outputEncoding = THREE.sRGBEncoding
    _renderer.setSize(clientWidth, clientHeight)
    _renderer.setClearAlpha(0.5)
    container.value!.appendChild(_renderer.domElement)
    renderer.value = _renderer
  }
  const boostrapCssRenderer = () => {
    const { clientWidth, clientHeight } = container.value
    const _cssRenderer = new CSS2DRenderer()
    _cssRenderer.setSize(clientWidth, clientHeight)
    _cssRenderer.domElement.className = 'three-css-renderer'
    _cssRenderer.domElement.style.position = 'absolute'
    _cssRenderer.domElement.style.top = '0px'
    // _cssRenderer.domElement.style.pointerEvents = 'none'
    container.value!.appendChild(_cssRenderer.domElement)
    cssRenderer.value = _cssRenderer
  }
  const boostrapControl = () => {
    const _controls = new OrbitControls(
      camera.value,
      cssRenderer.value.domElement
    )
    _controls.minPolarAngle = 0
    _controls.enableDamping = true
    _controls.dampingFactor = 0.1
    _controls.target.set(0, 5, 0)
    _controls.maxPolarAngle = Math.PI / 2
    _controls.minDistance = 10 // 设置最小缩放距离
    _controls.maxDistance = 100 // 设置最大缩放距离
    _controls.update()
    controls.value = _controls
  }
  const boostrapLights = () => {
    const ambientLight = new THREE.AmbientLight(0x999999, 10)
    scene.value.add(ambientLight)
    // 另一种平行光

    const points = [
      [0, 50, 0],
      [50, 50, 0],
    ]
    // points.forEach((point) => {
    //   const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    //   directionalLight.position.set(...point)
    //   scene.value.add(directionalLight)
    //   scene.value.add(new THREE.DirectionalLightHelper(directionalLight, 5))
    // })

    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
    // directionalLight2.position.set(-100, 100, 100)
    // scene.value.add(directionalLight2)
    // scene.value.add(new THREE.DirectionalLightHelper(directionalLight2, 5))
  }
  const loadGLTF = (url: string): Promise<GLTF> => {
    // const loader = new GLTFLoader()
    // Draco 解码库
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/js/draco/gltf/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    const onCompleted = (object: GLTF, resolve: any) => resolve(object)
    return new Promise<GLTF>((resolve) => {
      loader.load(url, (object: GLTF) => onCompleted(object, resolve))
    })
  }
  const boostrapModels = async () => {
    const obj = await loadGLTF('/models/base2.glb')
    scene.value.add(obj.scene)
    let textures = []
    obj.scene.traverse((mesh: any) => {
      if (mesh.name.indexOf('道路箭头') < 0) return void 0
      textures.push(mesh.material.map)
    })
    mixins.push(() => {
      textures.forEach((texture) => {
        if (texture.offset.y >= 10000) {
          texture.offset.y = 0
        } else {
          texture.offset.y += 0.02
        }
      })
    })

    const obj2 = await loadGLTF('/models/devices.glb')
    // console.log('obj2', obj2)
    scene.value.add(obj2.scene)

    const obj3 = await loadGLTF('/models/lines.gltf')
    // console.log('obj3', obj3)
    scene.value.add(obj3.scene)

    new TWEEN.Tween({ x: 0, y: 0 })
      .to({ x: 2, y: 1 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate((object) => {
        alert(1)
        console.log('object', object)
      })
      .onComplete(() => {
        alert(1)
      })
      .start()
  }
  const boostrapLabels = () => {
    const listA = [[-33, 10, 14]]
    listA.forEach((item) => {
      const newComponent = defineComponent({
        render() {
          return h(Label, {})
        },
      })
      const instance = createVNode(newComponent)
      render(instance, document.createElement('div'))
      const obj = new CSS2DObject(instance.el)
      obj.position.set(...item)
      scene.value.add(obj)
    })
  }
  const roamItem = (nowPosition, endPosition, time, easing) => {
    const tween1 = new TWEEN.Tween(nowPosition)
      .to(endPosition, time)
      .easing(easing)
    console.log('tween1', tween1)
    // console.log('tween1', nowPosition, endPosition, time, easing)
    tween1.onUpdate((object) => {
      alert(1)
      camera.value.position.x = object.x1
      camera.value.position.y = object.y1
      camera.value.position.z = object.z1
      controls.value.target.x = object.x2
      controls.value.target.y = object.y2
      controls.value.target.z = object.z2
      controls.value.update()
    })
    return tween1
  }
  const roamCheck = () => {
    new TWEEN.Tween({ x: 1, y: 1 })
      .to({ x: 2, y: 1 }, 10000)
      .easing()
      .onUpdate((object) => {
        console.log('object', object)
      })
      .start()

    // const roamTweenEndCarm = []
    // roamTweenEndCarm.push({
    //   x1: -47.46,
    //   y1: 1.45,
    //   z1: 6.01,
    //   x2: -25.23,
    //   y2: 1.45,
    //   z2: 6.01,
    // }) //A
    // roamTweenEndCarm.push({
    //   x1: 34.92,
    //   y1: 1.45,
    //   z1: 6.01,
    //   x2: 47.16,
    //   y2: 1.45,
    //   z2: 6.01,
    // })
    // roamTweenEndCarm.push({
    //   x1: 39.27,
    //   y1: 1.45,
    //   z1: 8.29,
    //   x2: 39.3,
    //   y2: 1.45,
    //   z2: 4.67,
    // })
    // roamTweenEndCarm.push({
    //   x1: 38.94,
    //   y1: 1.45,
    //   z1: -15.85,
    //   x2: 38.94,
    //   y2: 1.45,
    //   z2: -17.77,
    // })
    // roamTweenEndCarm.push({
    //   x1: 40.81,
    //   y1: 1.45,
    //   z1: -18.95,
    //   x2: 38.31,
    //   y2: 1.45,
    //   z2: -18.7,
    // })
    // roamTweenEndCarm.push({
    //   x1: -38.12,
    //   y1: 1.45,
    //   z1: -18.95,
    //   x2: -47.36,
    //   y2: 1.45,
    //   z2: -18.09,
    // })
    // roamTweenEndCarm.push({
    //   x1: -42.01,
    //   y1: 1.45,
    //   z1: -19.7,
    //   x2: -41.91,
    //   y2: 1.45,
    //   z2: -17.7,
    // })
    // roamTweenEndCarm.push({
    //   x1: -41.86,
    //   y1: 1.45,
    //   z1: 1.82,
    //   x2: -41.83,
    //   y2: 1.45,
    //   z2: 3.29,
    // })
    // roamTweenEndCarm.push({
    //   x1: -44.21,
    //   y1: 1.45,
    //   z1: 5.97,
    //   x2: -41.51,
    //   y2: 1.45,
    //   z2: 5.61,
    // })
    // roamTweenEndCarm.push({ x1: -80, y1: 70, z1: 40, x2: -25, y2: 5, z2: 0 })
    // var nowPosition = {
    //   x1: camera.value.position.x, // 相机x
    //   y1: camera.value.position.y, // 相机y
    //   z1: camera.value.position.z, // 相机z
    //   x2: controls.value.target.x, // 控制点的中心点x
    //   y2: controls.value.target.y, // 控制点的中心点y
    //   z2: controls.value.target.z, // 控制点的中心点z
    // }
    // // const cameraRe = camera.value
    // // const controlsRe = controls.value
    // console.log('roamTweenEndCarm', roamTweenEndCarm)
    // // 尾部参数为毫秒
    // const tweenA = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[0],
    //   2000,
    //   TWEEN.Easing.Linear.None
    // )
    // // 漫游点B
    // let tweenB = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[1],
    //   6000,
    //   TWEEN.Easing.Linear.None
    // )
    // // 漫游点C
    // let tweenC = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[2],
    //   2000,
    //   TWEEN.Easing.Quadratic.InOut
    // )
    // // 漫游点D
    // let tweenD = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[3],
    //   2500,
    //   TWEEN.Easing.Linear.None
    // )
    // // 漫游点E
    // let tweenE = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[4],
    //   2000,
    //   TWEEN.Easing.Quadratic.InOut
    // )
    // // 漫游点F
    // let tweenF = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[5],
    //   6000,
    //   TWEEN.Easing.Linear.None
    // )
    // // 漫游点G
    // let tweenG = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[6],
    //   2000,
    //   TWEEN.Easing.Quadratic.InOut
    // )
    // // 漫游点H
    // let tweenH = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[7],
    //   2500,
    //   TWEEN.Easing.Linear.None
    // )
    // // 漫游点I
    // let tweenI = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[8],
    //   2000,
    //   TWEEN.Easing.Quadratic.InOut
    // )
    // // 漫游点J
    // let tweenJ = roamItem(
    //   nowPosition,
    //   roamTweenEndCarm[9],
    //   2000,
    //   TWEEN.Easing.Quadratic.InOut
    // )
    // // console.log('tweenJ', tweenJ)
    // // tweenA.chain(tweenB)
    // // tweenB.chain(tweenC)
    // // tweenC.chain(tweenD)
    // // tweenD.chain(tweenE)
    // // tweenE.chain(tweenF)
    // // tweenF.chain(tweenG)
    // // tweenG.chain(tweenH)
    // // tweenH.chain(tweenI)
    // // tweenI.chain(tweenJ)
    // tweenA.start()
    // // tweenB.start()
  }
  onMounted(() => {
    boostrapScene()
    boostrapCamera()
    boostrapRenderer()
    boostrapCssRenderer()
    boostrapControl()
    boostrapLights()

    boostrapModels()
    boostrapLabels()
    // setTimeout(() => {
    //   roamCheck()
    // }, 2000)
    // let helper = new THREE.AxesHelper(500)
    // scene.value.add(helper)

    animate(1)
  })

  return {
    container,
    scene,
  }
}

export default useThree
