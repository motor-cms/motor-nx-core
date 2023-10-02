<template>
    <span class="tooltip-container" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <span v-if="props.type == 'questionmark'" class="tooltip-icon" :style="{'background-color': props.iconColor}"><b>?</b></span>
    <span v-else class="tooltip-icon" :style="{'background-color': props.iconColor}"><b>i</b></span>
    <div v-if="isTooltipVisible" class="tooltip-text" :class="tooltipPositionClass" ref="el" :style="{'background-color': props.hintColor}">
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
    },
    iconColor: {
      type: String,
      default: '#F49B01',
    },
    hintColor: {
      type: String,
      default: '#FFF8EF',
    },
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

<style scoped>
/* Tooltip container */
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-icon {
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
}

.tooltip-text {
  position: absolute;
  border: 1px solid black;
  border-radius: 4px;
  padding: 0.5rem;
  z-index: 1;
  display: none;
  min-width: 200px;
}

/* Tooltip positions */
.tooltip-text.top {
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-text.bottom {
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-text.left {
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-text.right {
  left: 35px;
  top: 50%;
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
  right: -10px;
  border-width: 5px 0px 5px 10px;
  border-color: transparent transparent transparent black;
  transform: translateY(-50%);
}

.tooltip-text.right .tooltip-arrow {
  top: 50%;
  left: -10px;
  border-width: 5px 10px 5px 0px;
  border-color: transparent black transparent transparent;
  transform: translateY(-50%);
}

.tooltip-container:hover .tooltip-text {
  display: block;
}
</style>
