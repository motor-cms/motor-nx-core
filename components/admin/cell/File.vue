<template>
  <div class="flex-column">
    <vue-easy-lightbox
      v-if="record.exists && isImage(record[prop].mime_type)"
      scrollDisabled
      moveDisabled
      :visible="visible"
      :imgs="[record[prop].conversions.thumb]"
      :index="0"
      @hide="visible = false"
    >
    </vue-easy-lightbox>

    <img
      v-if="record.exists && isImage(record[prop].mime_type)"
      :src="record[prop].conversions.thumb"
      class="img-fluid border-radius-lg"
      alt="Responsive image"
      @click="visible = true"
    />
    <a
      :href="record[prop].url"
      v-if="record.exists"
      type="button"
      class="btn btn-sm btn-secondary"
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
import VueEasyLightbox from 'vue-easy-lightbox'

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
    // Check mimetype before displaying an image
    const isImage = (type: string) => {
      const mimeTypes = [
        'image/apng',
        'image/avif',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/webp',
      ]

      return mimeTypes.indexOf(type) > -1
    }

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
