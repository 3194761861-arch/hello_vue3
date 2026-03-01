<script setup lang="ts">
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  data: { name: string; value: number }[]
}>()

const options = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: props.title || 'Access From',
      type: 'pie',
      radius: '50%',
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))
</script>

<template>
  <BaseChart :options="options" />
</template>
