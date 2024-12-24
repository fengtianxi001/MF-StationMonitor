import {
  onMounted,
  createVNode,
  defineComponent,
  h,
  render,
  nextTick,
  shallowRef,
  ref,
  reactive,
} from 'vue'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import TWEEN from 'three/examples/jsm/libs/tween.module.js'
import * as THREE from 'three'
import { sample } from 'lodash'
import useThree from './useThree'
import WidgetLabel from '@/components/WidgetLabel.vue'

// 模型路径信息
const Sources = {
  BuildingModel: `${import.meta.env.VITE_API_DOMAIN}/models/base.glb`,
  DeviceModel: `${import.meta.env.VITE_API_DOMAIN}/models/devices.glb`,
  LineModel: `${import.meta.env.VITE_API_DOMAIN}/models/lines.gltf`,
}

//设备名称点位信息
const LabelPositions = [
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
  {
    name: '1# 隔离开关',
    position: [-33, 6, 14],
  },
  {
    name: '2# 隔离开关',
    position: [-21.2, 6, 14],
  },
  {
    name: '3# 隔离开关',
    position: [-9.4, 6, 14],
  },
  {
    name: '4# 隔离开关',
    position: [2.4, 6, 14],
  },
  {
    name: '5# 隔离开关',
    position: [14.2, 6, 14],
  },
  {
    name: '6# 隔离开关',
    position: [26, 6, 14],
  },
]

export function useStation() {
  const { container, scene, camera, controls, loadGltf, renderMixins } =
    useThree()

  const models: any = {
    building: null,
    devices: null,
    lines: null,
  }
  const loading = reactive({
    total: 3, // 全部
    loaded: 0, // 已加载
    isLoading: true, // 执行状态
  })

  const inspect = shallowRef()

  const devices = shallowRef([])
  const warmingTimer = ref()
  const warmingCurrent = shallowRef()

  //加载模型
  const loadModel = async () => {
    const loadBuildingModel = async () => {
      const gltf = await loadGltf(Sources.BuildingModel)
      loading.loaded += 1
      models.building = gltf.scene
      scene.value.add(gltf.scene)
    }
    const loadDeviceModel = async () => {
      const gltf: any = await loadGltf(Sources.DeviceModel)
      devices.value.push(...gltf.scene.children[4].children)
      loading.loaded += 1
      models.devices = gltf.scene
      scene.value.add(gltf.scene)
    }
    const loadLineModel = async () => {
      const gltf = await loadGltf(Sources.LineModel)
      loading.loaded += 1
      models.lines = gltf.scene
      scene.value.add(gltf.scene)
    }
    await Promise.all([loadBuildingModel(), loadDeviceModel(), loadLineModel()])
    loading.isLoading = false
    loading.loaded = 3
  }
  //添加道路箭头动画
  const addRoadArrowAnimation = () => {
    if (!models.building) return void 0
    const textures: any[] = []
    models.building.traverse((mesh: any) => {
      mesh.name.includes('道路箭头') && textures.push(mesh.material.map)
    })
    const animation = () => {
      textures.forEach((texture) => {
        texture.offset.y = (texture.offset.y + 0.02) % 10000
      })
    }
    renderMixins.set('road-arrow', animation)
  }
  //添加设备名称标识
  const addDeviceLabels = () => {
    const cRender = (component: any, props: any) => {
      const newComponent = defineComponent({
        render() {
          return h(component, props)
        },
      })
      const instance = createVNode(newComponent)
      render(instance, document.createElement('div'))
      return instance.el
    }
    LabelPositions.forEach((item) => {
      const label = new CSS2DObject(cRender(WidgetLabel, item))
      label.position.set(...item.position)
      scene.value.add(label)
    })
  }

  //摄像头移动效果
  const cameraAnimation = (
    oldPosition: any,
    oldTarget: any,
    newPosition: any,
    newTarget: any,
    during = 1000,
    time = TWEEN.Easing.Cubic.InOut
  ) => {
    const start = {
      x1: oldPosition.x,
      y1: oldPosition.y,
      z1: oldPosition.z,
      x2: oldTarget.x,
      y2: oldTarget.y,
      z2: oldTarget.z,
    }
    const stop = {
      x1: newPosition.x,
      y1: newPosition.y,
      z1: newPosition.z,
      x2: newTarget.x,
      y2: newTarget.y,
      z2: newTarget.z,
    }
    const tween = new TWEEN.Tween(start).to(stop, during).easing(time)
    tween.onUpdate((object: any) => {
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
  //开始巡检
  const startInspect = () => {
    return new Promise((resolve) => {
      const positions = [
        {
          position: {
            x: -47.46,
            y: 1.45,
            z: 6.01,
          },
          target: {
            x: -25.23,
            y: 1.45,
            z: 6.01,
          },
        },
        {
          position: {
            x: 34.92,
            y: 1.45,
            z: 6.01,
          },
          target: {
            x: 47.16,
            y: 1.45,
            z: 6.01,
          },
        },
        {
          position: {
            x: 39.27,
            y: 1.45,
            z: 8.29,
          },
          target: {
            x: 39.3,
            y: 1.45,
            z: 4.67,
          },
        },
        {
          position: {
            x: 38.94,
            y: 1.45,
            z: -15.85,
          },
          target: {
            x: 38.94,
            y: 1.45,
            z: -17.77,
          },
        },
        {
          position: {
            x: 40.81,
            y: 1.45,
            z: -18.95,
          },
          target: {
            x: 38.31,
            y: 1.45,
            z: -18.7,
          },
        },
        {
          position: {
            x: -38.12,
            y: 1.45,
            z: -18.95,
          },
          target: {
            x: -47.36,
            y: 1.45,
            z: -18.09,
          },
        },
        {
          position: {
            x: -42.01,
            y: 1.45,
            z: -19.7,
          },
          target: {
            x: -41.91,
            y: 1.45,
            z: -17.7,
          },
        },
        {
          position: {
            x: -41.86,
            y: 1.45,
            z: 1.82,
          },
          target: {
            x: -41.83,
            y: 1.45,
            z: 3.29,
          },
        },
        {
          position: {
            x: -44.21,
            y: 1.45,
            z: 5.97,
          },
          target: {
            x: -41.51,
            y: 1.45,
            z: 5.61,
          },
        },
        {
          position: {
            x: 20,
            y: 15,
            z: 20,
          },
          target: {
            x: 0,
            y: 5,
            z: 0,
          },
        },
      ]
      //漫游起点
      inspect.value = cameraAnimation(
        {
          x: camera.value.position.x,
          y: camera.value.position.y,
          z: camera.value.position.z,
        },
        {
          x: controls.value.target.x,
          y: controls.value.target.y,
          z: controls.value.target.z,
        },
        positions[0].position,
        positions[0].target,
        2000,
        TWEEN.Easing.Linear.None
      )
      // 漫游点B
      const tweenB = cameraAnimation(
        positions[0].position,
        positions[0].target,
        positions[1].position,
        positions[1].target,
        6000,
        TWEEN.Easing.Linear.None
      )
      // 漫游点C
      const tweenC = cameraAnimation(
        positions[1].position,
        positions[1].target,
        positions[2].position,
        positions[2].target,
        2000,
        TWEEN.Easing.Quadratic.InOut
      )
      // 漫游点D
      const tweenD = cameraAnimation(
        positions[2].position,
        positions[2].target,
        positions[3].position,
        positions[3].target,
        2500,
        TWEEN.Easing.Linear.None
      )
      // 漫游点E
      const tweenE = cameraAnimation(
        positions[3].position,
        positions[3].target,
        positions[4].position,
        positions[4].target,
        2000,
        TWEEN.Easing.Quadratic.InOut
      )
      // 漫游点F
      const tweenF = cameraAnimation(
        positions[4].position,
        positions[4].target,
        positions[5].position,
        positions[5].target,
        6000,
        TWEEN.Easing.Linear.None
      )
      // 漫游点G
      const tweenG = cameraAnimation(
        positions[5].position,
        positions[5].target,
        positions[6].position,
        positions[6].target,
        2000,
        TWEEN.Easing.Quadratic.InOut
      )
      // 漫游点H
      const tweenH = cameraAnimation(
        positions[6].position,
        positions[6].target,
        positions[7].position,
        positions[7].target,
        2500,
        TWEEN.Easing.Linear.None
      )
      // 漫游点I
      const tweenI = cameraAnimation(
        positions[7].position,
        positions[7].target,
        positions[8].position,
        positions[8].target,
        2000,
        TWEEN.Easing.Quadratic.InOut
      )
      // 漫游点J
      const tweenJ = cameraAnimation(
        positions[8].position,
        positions[8].target,
        positions[9].position,
        positions[9].target,
        2000,
        TWEEN.Easing.Quadratic.InOut
      )
      inspect.value.chain(tweenB)
      tweenB.chain(tweenC)
      tweenC.chain(tweenD)
      tweenD.chain(tweenE)
      tweenE.chain(tweenF)
      tweenF.chain(tweenG)
      tweenG.chain(tweenH)
      tweenH.chain(tweenI)
      tweenI.chain(tweenJ)
      inspect.value.start()

      tweenJ.onComplete(() => {
        resolve(true)
      })
    })
  }
  //停止巡检
  const stopInspect = () => {
    inspect.value?.stop()
    cameraAnimation(
      {
        x: camera.value.position.x,
        y: camera.value.position.y,
        z: camera.value.position.z,
      },
      {
        x: controls.value.target.x,
        y: controls.value.target.y,
        z: controls.value.target.z,
      },
      {
        x: 20,
        y: 15,
        z: 20,
      },
      {
        x: 0,
        y: 5,
        z: 0,
      },
      6000,
      TWEEN.Easing.Linear.None
    ).start()
  }
  //开始模拟告警
  const startWarming = () => {
    const handle = () => {
      if (warmingCurrent.value) {
        warmingCurrent.value.traverse((mesh: any) => {
          if (!(mesh instanceof THREE.Mesh)) return undefined
          mesh.material.emissive.setHex(mesh.currentHex)
          return undefined
        })
      }
      const index = sample([0, 1, 2, 3, 4, 5])
      warmingCurrent.value = devices.value[index]

      cameraAnimation(
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
        }
      ).start()

      warmingCurrent.value.traverse((mesh: any) => {
        if (!(mesh instanceof THREE.Mesh)) return undefined
        mesh.material = mesh.material.clone()
        mesh.currentHex = mesh.currentHex ?? mesh.material.emissive.getHex()
        mesh.material.emissive.setHex(0xff0000)
        return undefined
      })
    }
    handle()
    warmingTimer.value = setInterval(handle, 1000 * 2)
  }
  //停止模拟告警
  const stopWarming = () => {
    if (warmingCurrent.value) {
      warmingCurrent.value.traverse((mesh: any) => {
        if (!(mesh instanceof THREE.Mesh)) return undefined
        mesh.material.emissive.setHex(mesh.currentHex)
        return undefined
      })
    }
    window.clearInterval(warmingTimer.value)
    cameraAnimation(
      {
        x: camera.value.position.x,
        y: camera.value.position.y,
        z: camera.value.position.z,
      },
      {
        x: controls.value.target.x,
        y: controls.value.target.y,
        z: controls.value.target.z,
      },
      {
        x: 20,
        y: 15,
        z: 20,
      },
      {
        x: 0,
        y: 5,
        z: 0,
      },
      2000,
      TWEEN.Easing.Linear.None
    ).start()
  }

  onMounted(() => {
    nextTick(async () => {
      await loadModel()
      addRoadArrowAnimation()
      addDeviceLabels()
    })
  })
  return {
    container,
    loadModel,
    loading,
    startInspect,
    stopInspect,
    startWarming,
    stopWarming,
  }
}

export default useStation
