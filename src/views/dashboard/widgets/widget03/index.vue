<template>
  <WidgetPanel title="主变电负荷电流变化">
    <div class="bug-repair" ref="container"></div>
  </WidgetPanel>
</template>
<script setup lang="ts">
import WidgetPanel from '../widgetPanel.vue'
import { nextTick, onMounted } from 'vue'
import { map, max, min, sampleSize, range } from 'lodash'
import useEcharts from '@/hooks/useEcharts'

const { container, echarts, setOption } = useEcharts()

const generateOptions = (sources: any[][]) => {
  const minValue = map(sources, (source) => min(source))
  const maxValue = map(sources, (source) => max(source))
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#2f2f48',
      borderColor: '#2f2f48',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '1%',
      right: '3%',
      bottom: '0%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#c8c8c8',
        margin: 20,
        fontFamily: 'DengJuGengShaHeiTi',
      },
      data: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#c8c8c8',
        fontFamily: 'DengJuGengShaHeiTi',
      },
      splitLine: {
        lineStyle: {
          color: '#c8c8c830',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '1#',
        type: 'line',
        symbol: 'none',
        smooth: true,
        lineStyle: {
          normal: {
            width: 2,
          },
        },
        data: sources[0],
      },
      {
        name: '2#',
        type: 'line',
        symbol: 'none',
        smooth: true,
        itemStyle: {
          color: '#ffe641',
        },
        lineStyle: {
          normal: {
            width: 2,
            color: '#ffe641',
          },
        },
        data: sources[1],
      },
      {
        name: '3#',
        type: 'line',
        symbol: 'none',
        smooth: true,
        itemStyle: {
          color: '#c8c8c8',
        },
        lineStyle: {
          normal: {
            width: 2,
            color: '#c8c8c8',
          },
        },
        data: sources[2],
      },
    ],
  }
}

onMounted(() => {
  setTimeout(() => {
    const sources = [
      sampleSize(range(1000, 200), 7),
      sampleSize(range(1000, 200), 7),
      sampleSize(range(1000, 200), 7),
    ]
    const options = generateOptions(sources)
    setOption(options)
  }, 1000)
})
</script>
<style lang="scss" scoped>
.bug-repair {
  width: 100%;
  height: 200px;
}
</style>
