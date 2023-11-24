<template>
  <div class="popover bs-popover-auto fade show top-100 left-50 rounded-right position-absolute" style="min-width: fit-content" role="tooltip" data-popper-placement="bottom">
    <div class="popover-body" style="border-top-left-radius: 0">
      <slot/>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>

<style lang="scss">
	.popover {
		.popover-body {
			.form-check {
				position: relative;

				svg {
					cursor: pointer;
					height: 14px;
					width: 14px;
					position: absolute;
					top: 4px;
					left: 0;
				}
			}
		}
	}
</style>
