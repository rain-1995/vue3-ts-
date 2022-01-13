<template>
  <div>
    <svg :class="svgClass" aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, computed } from 'vue'
export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const { className, iconClass } = toRefs(props)
    // 计算属性
    const computes = {
      iconName: computed(() => `#icon-${iconClass.value}`),
      svgClass: computed(() => className.value ? 'svg-icon ' + className.value : 'svg-icon')
    }
    return {
      ...computes
    }
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .svg-icon {
    width: 1.4em;
    height: 1.4em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
  }

</style>
