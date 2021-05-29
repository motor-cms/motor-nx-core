<template>
  <draggable
    class="dragArea"
    tag="ul"
    :list="tree"
    :group="{ name: 'g1' }"
    :move="checkMove"
    item-key="id"
  >
    <template #item="{ element }">
      <li>
        <fa v-if="element.id !== record" icon="folder"></fa>
        <fa
          v-if="element.id === record"
          icon="file"
          style="color: #cb0c9f"
        ></fa>
        {{ element.name }}
        <nested-draggable :tree="element.children" :record="record" />
      </li>
    </template>
  </draggable>
</template>
<script lang="ts">
import draggable from 'vuedraggable'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    tree: {
      required: true,
      type: Object,
    },
    record: {
      type: Number,
    },
  },
  components: {
    draggable,
  },
  name: 'nested-draggable',
  setup(props) {
    const checkMove = (event: any) => {
      if (
        event.draggedContext &&
        event.draggedContext.element.id !== props.record
      ) {
        return false
      }
    }
    return { checkMove }
  },
})
</script>
<style scoped>
.dragArea {
  list-style-type: none; /* Remove bullets */
  /*min-height: 50px;*/
  /*outline: 1px dashed;*/
}
</style>
