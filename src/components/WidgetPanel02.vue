<template>
  <LayoutPanel title="主变电负荷电流变化">
    <div class="container" ref="container"></div>
  </LayoutPanel>
</template>
<script setup lang="ts">
import LayoutPanel from './LayoutPanel.vue'
import { nextTick, onMounted } from 'vue'
import { sampleSize, range } from 'lodash'
import useEcharts from '@/hooks/useEcharts'

const { container, echarts, setOption } = useEcharts()

const generateOptions = (sources: any[][]) => {
  return {
    legend: {
      show: true,
      right: 0,
      textStyle: {
        color: '#fff',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#000',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '1%',
      right: '6%',
      bottom: '0%',
      top: '20%',
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
        color: '#fff',
        margin: 20,
      },
      data: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#c8c8c8',
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
            color: 'rgba(0, 254, 169, 1)',
          },
        },
        itemStyle: {
          color: 'rgba(0, 254, 169, 0.5)',
        },
        // areaStyle: {},
        data: sources[0],
      },
      {
        name: '2#',
        type: 'line',
        symbol: 'none',
        smooth: true,
        lineStyle: {
          normal: {
            width: 2,
            color: 'rgba(87, 153, 214, 1)',
          },
        },
        itemStyle: {
          color: 'rgba(87, 153, 214, 0.5)',
        },
        // areaStyle: {},
        data: sources[1],
      },
      {
        name: '3#',
        type: 'line',
        symbol: 'none',
        smooth: true,
        lineStyle: {
          normal: {
            width: 2,
            color: 'rgba(241, 189, 73, 1)',
          },
        },
        itemStyle: {
          color: 'rgba(241, 189, 73, 0.5)',
        },
        // areaStyle: {},
        data: sources[2],
      },
    ],
  }
}

onMounted(() => {
  nextTick(() => {
    const sources = [
      sampleSize(range(1000, 200), 7),
      sampleSize(range(1000, 200), 7),
      sampleSize(range(1000, 200), 7),
    ]
    const options = generateOptions(sources)
    setOption(options)
  })
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
