<template>
  <div :style="'padding-left: ' + (record.level - 1) * 30 + 'px'">
    {{ record[prop] }}
  </div>
</template>
<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Tree',
  props: {
    prop: String,
    record: Object,
  },
  setup() {
    const router = useRouter()
    return { router }
  },
})
</script>
