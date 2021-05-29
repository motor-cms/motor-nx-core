<template>
  <div>
    <ul class="tree" :id="id">
      <tree-item
        class="item"
        :item="treeData"
        :record="record"
        @make-folder="makeFolder"
        @add-item="addItem"
      ></tree-item>
    </ul>
  </div>
</template>
<script lang="ts">
import TreeItem from './TreeItem.vue'

// demo data
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'tree',
    },
    record: {
      type: Number,
      default: 0,
    },
    treeData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  components: { TreeItem },
  methods: {
    makeFolder: function (item: any) {
      item.children = []
      this.addItem(item)
    },
    addItem: function (item: any) {
      item.children.push({
        name: 'new stuff',
      })
    },
  },
})
</script>
<style lang="scss">
.item {
  cursor: pointer;
  &.active {
    font-style: italic;
  }
}
.tree ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>
