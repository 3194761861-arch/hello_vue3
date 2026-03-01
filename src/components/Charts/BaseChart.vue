<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

const props = defineProps<{
  options: EChartsOption
  width?: string
  height?: string
}>()

const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(props.options)
  }
}

const resizeHandler = () => {
  chartInstance?.resize()
}

watch(
  () => props.options,
  (newOptions) => {
    chartInstance?.setOption(newOptions)
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  chartInstance?.dispose()
})

defineExpose({
  chartInstance
})
</script>

<template>
  <div ref="chartRef" :style="{ width: width || '100%', height: height || '400px' }"></div>
</template>
