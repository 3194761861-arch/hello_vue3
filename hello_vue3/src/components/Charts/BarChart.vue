<script setup lang="ts">
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  xAxisData: string[]
  seriesData: number[]
  color?: string
}>()

const options = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.xAxisData,
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Sales',
      type: 'bar',
      barWidth: '60%',
      data: props.seriesData,
      itemStyle: {
        color: props.color || '#409EFF'
      }
    }
  ]
}))
</script>

<template>
  <BaseChart :options="options" />
</template>
