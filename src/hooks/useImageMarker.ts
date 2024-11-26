import { ref, shallowRef } from 'vue'
import Konva from 'konva'

type StageOptions = {
  width?: number
  height?: number
  backgroundImage: string
  mode: 'preview' | 'editor'
}

type MarkerOption = {
  id: string | number
  name: string | number
  code: string | number
  x: number
  y: number
  userData?: Record<string, any>
  onDragend?: (evt: Konva.KonvaEventObject<DragEvent>) => any
  onClick?: (evt: Konva.KonvaEventObject<MouseEvent>) => any
  onMouseenter?: (evt: Konva.KonvaEventObject<MouseEvent>) => any
  onMouseleave?: (evt: Konva.KonvaEventObject<MouseEvent>) => any
  onMouseover?: (evt: Konva.KonvaEventObject<MouseEvent>) => any
  onMouseout?: (evt: Konva.KonvaEventObject<MouseEvent>) => any
}

function imageLoader(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

export function useImageMarker() {
  const container = ref<HTMLDivElement>()
  const mode = ref<'preview' | 'editor'>('preview')
  const stage = shallowRef<Konva.Stage | null>()
  const backgroundLayer = shallowRef<Konva.Layer | null>()
  const markerLayer = shallowRef<Konva.Layer | null>()

  const boostrap = async (stageOptions: StageOptions) => {
    const image = await imageLoader(stageOptions.backgroundImage)
    if (!image) return console.error('Image loading error')
    mode.value = stageOptions.mode
    stage.value = boostrapStage(image, stageOptions)
    backgroundLayer.value = boostrapBackground(image)
    stage.value.add(backgroundLayer.value)
  }

  const boostrapStage = (
    image: HTMLImageElement,
    stageOptions: StageOptions
  ) => {
    const width =
      stageOptions.width ?? (container.value?.clientWidth || image.width)
    const height =
      stageOptions.height ?? (container.value?.clientHeight || image.height)
    // 创建舞台实例
    const stage = new Konva.Stage({
      container: container.value as HTMLDivElement,
      width,
      height,
      draggable: true,
      scale: {
        x: height / image.height,
        y: height / image.height,
      },
    })
    stage.on('wheel', (evt) => {
      evt.evt.preventDefault()
      // 获取当前舞台的缩放比例
      const currentScale: number = stage!.scaleX()
      // 获取鼠标的位置
      const currentPointerPosition =
        stage.getPointerPosition() as Konva.Vector2d
      // 计算鼠标相对于地图的坐标
      const mousePointTo = {
        x: (currentPointerPosition.x - stage!.x()) / currentScale,
        y: (currentPointerPosition.y - stage!.y()) / currentScale,
      }
      //
      const scaleStep = 1.05
      // 根据滚轮方向计算新的缩放比例
      const updatedScale =
        evt.evt.deltaY > 0 ? currentScale * scaleStep : currentScale / scaleStep
      // 设置新的缩放比例
      stage.scale({ x: updatedScale, y: updatedScale })
      // 根据鼠标位置和新的缩放比例计算地图的新坐标
      const stagePosition = {
        x: currentPointerPosition!.x - mousePointTo.x * updatedScale,
        y: currentPointerPosition!.y - mousePointTo.y * updatedScale,
      }
      // 舞台缩放时，希望保持marker大小不变 todo
      // 设置新的地图坐标
      stage!.position(stagePosition)
      // 更新图层
      stage!.batchDraw()
    })
    return stage
  }

  const boostrapBackground = (image: HTMLImageElement) => {
    const backgroundLayer = new Konva.Layer()
    const background = new Konva.Image({
      image: image,
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    })
    backgroundLayer.add(background)
    return backgroundLayer
  }

  const generateMarker = (markerOption: MarkerOption) => {
    if (!stage.value) {
      return console.error('Please initialize the stage first')
    }
    if (!markerLayer.value) {
      markerLayer.value = new Konva.Layer()
      stage.value.add(markerLayer.value)
    }

    const markerGroup = new Konva.Group({
      id: String(markerOption.id),
      x: markerOption.x ?? 0,
      y: markerOption.y ?? 0,
      userData: {
        sensorId: markerOption.id,
        name: markerOption.name,
        ...(markerOption.userData ?? {}),
      },
      draggable: mode.value === 'editor',
    })

    markerGroup.on('dragend', (evt) => {
      if (markerOption.onDragend) {
        markerOption.onDragend(evt)
      }
    })
    markerGroup.on('click', (evt) => {
      if (markerOption.onClick) {
        markerOption.onClick(evt)
      }
    })
    markerGroup.on('mouseover', (evt) => {
      markerGroup.scale({ x: 2, y: 2 })
      if (markerOption.onMouseover) {
        markerOption.onMouseover(evt)
      }
    })
    markerGroup.on('mouseout', (evt) => {
      markerGroup.scale({ x: 1, y: 1 })
      if (markerOption.onMouseout) {
        markerOption.onMouseout(evt)
      }
    })
    markerGroup.on('mouseenter', (evt) => {
      if (mode.value === 'editor') {
        document.body.style.cursor = 'move'
      }
      if (markerOption.onMouseenter) {
        markerOption.onMouseenter(evt)
      }
    })
    markerGroup.on('mouseleave', (evt) => {
      if (mode.value === 'editor') {
        document.body.style.cursor = 'default'
      }
      if (markerOption.onMouseleave) {
        markerOption.onMouseleave(evt)
      }
    })

    const markerPoint = new Konva.Circle({
      radius: 6,
      stroke: '#2092fb',
      strokeWidth: 5,
    })

    const markerName = new Konva.Text({
      x: 15,
      y: -12,
      text: markerOption.name ?? '--',
      fontSize: 13,
      fontFamily: 'Arial',
      fill: 'white',
      fontStyle: 'bold',
      shadowColor: '#000',
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      shadowOpacity: 0.8,
    })

    const markerCode = new Konva.Text({
      x: 15,
      y: 2,
      text: markerOption.code ?? '--',
      fontSize: 10,
      fontFamily: 'Arial',
      fill: 'white',
      fontStyle: 'bold',
      shadowColor: '#000',
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      shadowOpacity: 0.8,
    })
    markerGroup.add(markerPoint)
    markerGroup.add(markerName)
    markerGroup.add(markerCode)
    markerLayer.value.add(markerGroup)
  }

  const generateMarkers = (markerOptions: MarkerOption[]) => {
    markerOptions.forEach((markerOption) => {
      generateMarker(markerOption)
    })
  }

  const removeMarker = (id: any) => {
    const _id = String(id)
    const group = stage.value?.find(`#${_id}`)?.[0]
    group?.destroy()
  }

  const flyToMarker = (id: any) => {
    // const _id = String(id)
    // const group = stage.value?.find(`#${_id}`)?.[0]
    // var groupPos = group?.absolutePosition()
    // // 定位到Group对象
    // console.log('inter', groupPos.x - stage.value.width() / 2)
    // stage.value?.position({
    //   x: groupPos.x - stage.value.width() / 2,
    //   y: groupPos.y - stage.value.height() / 2,
    // })
    // stage.value?.draw()
  }

  const getMarkers = () => {
    return markerLayer.value?.children.map((item) => item.attrs) ?? []
  }

  return {
    container,
    stage,
    backgroundLayer,
    markerLayer,
    boostrap,
    generateMarker,
    generateMarkers,
    removeMarker,
    flyToMarker,
    getMarkers,
  }
}

export default useImageMarker
