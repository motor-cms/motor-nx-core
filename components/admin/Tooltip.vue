<template>
  <span class="tooltip-container" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <span class="tooltip-icon">?</span>
    <div v-if="isTooltipVisible" class="tooltip-text" :class="tooltipPositionClass">
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
      default: 'top',
    },
  },
  setup() {
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
    };
  },
  computed: {
    tooltipPositionClass() {
      return `tooltip-text ${this.position}`;
    },
  },
});
</script>

<style scoped>
/* Tooltip container */
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-icon {
  cursor: pointer;
  background-color: yellow;
  border-radius: 50%;
  padding: 0.2rem 0.4rem;
  margin-right: 0.2rem;
}

.tooltip-text {
  position: absolute;
  background-color: yellow;
  border: 1px solid black; /* Black border around the tooltip */
  border-radius: 4px;
  padding: 0.5rem;
  z-index: 1;
  display: none;
}

/* Tooltip positions */
.tooltip-text.top {
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-text.bottom {
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-text.left {
  top: 50%;
  right: -150px;
  transform: translateY(-50%);
}

.tooltip-text.right {
  top: 50%;
  left: -150px;
  transform: translateY(-50%);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  z-index: 2;
}

.tooltip-text.bottom .tooltip-arrow {
  top: -10px;
  left: 50%;
  border-width: 0 5px 10px 5px;
  border-color: transparent transparent black transparent;
  transform: translateX(-50%);
}

.tooltip-text.top .tooltip-arrow {
  bottom: -10px;
  left: 50%;
  border-width: 10px 5px 0 5px;
  border-color: black transparent transparent transparent;
  transform: translateX(-50%);
}

.tooltip-text.left .tooltip-arrow {
  top: 50%;
  left: -10px;
  border-width: 5px 10px 5px 0;
  border-color: transparent black transparent transparent;
  transform: translateY(-50%);
}

.tooltip-text.right .tooltip-arrow {
  top: 50%;
  right: -10px;
  border-width: 5px 0 5px 10px;
  border-color: transparent transparent transparent black;
  transform: translateY(-50%);
}

.tooltip-container:hover .tooltip-text {
  display: block;
}
</style>
