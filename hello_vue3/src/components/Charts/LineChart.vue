<script setup lang="ts">
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  xAxisData: string[]
  seriesData: { name: string; data: number[] }[]
}>()

const options = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: props.seriesData.map(item => item.name),
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.xAxisData
  },
  yAxis: {
    type: 'value'
  },
  series: props.seriesData.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
    smooth: true
  }))
}))
</script>

<template>
  <BaseChart :options="options" />
</template>
