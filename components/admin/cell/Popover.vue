<template>
  <div class="popover bs-popover-auto fade show" role="tooltip" data-popper-placement="bottom"
       style="position: absolute">
    <div class="popover-arrow" style="position: absolute; left: 0px; transform: translate3d(130px, 0px, 0px);"></div>
    <div class="popover-body">
      <slot/>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
