<template>
  <li>
    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="makeFolder">
      {{ item.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul class="tree" v-show="isOpen" v-if="isFolder">
      <tree-item
        class="item"
        :class="{ active: record === child.id }"
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      ></tree-item>
      <!--      <li class="add" @click="$emit('add-item', item)">+</li>-->
    </ul>
  </li>
</template>
<script setup lang="ts">
// demo data
import { computed, defineComponent, ref } from 'vue'

const props = defineProps({
  item: <any>Object,
  record: {
    type: Number,
    default: 0,
  },
})
const isOpen = ref(true)
const toggle = () => {
  if (isFolder.value) {
    isOpen.value = !isOpen.value
  }
}

// We don't need this currently
const makeFolder = () => {
  return
  // if (!this.isFolder) {
  //   this.$emit('make-folder', this.item)
  //   this.isOpen = true
  // }
}

const isFolder = computed(() => {
  return props.item.children && props.item.children.length
})
</script>
