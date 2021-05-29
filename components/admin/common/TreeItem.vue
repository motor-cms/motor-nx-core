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
<script lang="ts">
// demo data
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: <any>Object,
    record: {
      type: Number,
      default: 0,
    },
  },
  data: function () {
    return {
      isOpen: true,
    }
  },
  computed: {
    isFolder(): any {
      return this.item.children && this.item.children.length
    },
  },
  methods: {
    toggle(): void {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    // We don't need this currently
    makeFolder(): void {
      return
      // if (!this.isFolder) {
      //   this.$emit('make-folder', this.item)
      //   this.isOpen = true
      // }
    },
  },
})
</script>
