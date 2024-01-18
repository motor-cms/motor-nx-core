<template>
  <div class="flex-column">
    <vue-easy-lightbox
      v-if="record.exists && record[prop] && isImage(record[prop].mime_type)"
      scrollDisabled
      moveDisabled
      :visible="visible"
      :imgs="[record[prop].conversions.preview]"
      :index="0"
      @hide="visible = false"
    >
    </vue-easy-lightbox>

    <img
      v-if="record.exists && record[prop] && isImage(record[prop].mime_type)"
      :src="record[prop].conversions.thumb"
      class="img-fluid border-radius-lg"
      alt="Responsive image"
      @click="visible = true"
    />
    <a
      :href="record[prop].url"
      target="_blank"
      v-if="record.exists"
      type="button"
      class="btn btn-sm btn-secondary d-block"
    >
      {{ $t('motor-media.global.download') }}
    </a>
    <span v-if="!record.exists">{{
      $t('motor-media.global.file_not_found')
    }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
// Todo: check if is needed?
import VueEasyLightbox from 'vue-easy-lightbox'
import {useMimeType} from "@zrm/base-components/composables/shared/useMimeType";

export default defineComponent({
  name: 'File',
  props: {
    options: Object,
    record: Object,
    prop: String,
  },
  components: {
    VueEasyLightbox,
  },
  setup() {
    const visible = ref(false)

    const { isImage } = useMimeType();
    // Check mimetype before displaying an image

    return { isImage, visible }
  },
})
</script>
<style lang="scss">
.img-fluid {
  margin-bottom: 8px;
  cursor: pointer;
}
</style>
