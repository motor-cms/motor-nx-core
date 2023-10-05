<template>
    <span class="tooltip-container" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <span v-if="props.type == 'questionmark'" class="tooltip-icon"><b>?</b></span>
    <span v-else class="tooltip-icon"><b>i</b></span>
    <div v-if="isTooltipVisible" class="tooltip-text" :class="tooltipPositionClass" ref="el">
      {{ text }}
      <div class="tooltip-arrow"></div>
    </div>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Tooltip',
  props: {
    id: String,
    type: {
      type: String,
      default: 'questionmark',
    },
    text: {
      type: String,
      required: true,
    },
    cssClass: {
      type: String,
      default: '',
    },
    position: {
      type: String,
      default: 'right',
    }
  }, 
  setup(props) {
    const isTooltipVisible = ref(false);

    const showTooltip = () => {
      isTooltipVisible.value = true;
    };

    const hideTooltip = () => {
      isTooltipVisible.value = false;
    };

    return {
      isTooltipVisible,
      showTooltip,
      hideTooltip,
      props
    };
  },
  computed: {
    tooltipPositionClass() {
      return `tooltip-text ${this.position}`;
    },
  },
});
</script>