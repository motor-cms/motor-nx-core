<template>
  <client-only>
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
          <fa v-if="element.id !== record" icon="folder" />
          <fa
            v-if="element.id === record"
            icon="file"
            style="color: #cb0c9f"
          />
          {{ element.name }}
          <nested-draggable :tree="element.children" :record="record" />
        </li>
      </template>
    </draggable>
  </client-only>
</template>
<script lang="ts">
export default {
  name: 'nested-draggable',
}
</script>
<script setup lang="ts">
import draggable from 'vuedraggable/src/vuedraggable'
import type DraggableContent from "@zrm/motor-nx-core/types/draggable-content";

const props =defineProps({
  tree: {
    required: true,
    type: Object as PropType<DraggableContent>
  },
  record: {
    type: Number,
  },
});
//  components: {
//    draggable,
//  },
const checkMove = (event: any) => {
  if (
    event.draggedContext &&
    event.draggedContext.element.id !== props.record
  ) {
    return false
  }
}
</script>
<style scoped>
.dragArea {
  list-style-type: none; /* Remove bullets */
  min-height: 5px;
  /*min-height: 50px;*/
  /*outline: 1px dashed;*/
}
</style>
