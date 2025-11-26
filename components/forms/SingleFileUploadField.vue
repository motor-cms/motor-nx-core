<template>
  <div class="dropzone"
       v-if="fullScreenDragAndDrop"
       @dragenter.prevent="preventDefaultDropEvent"
       @dragover.prevent="preventDefaultDropEvent"
       @drop.prevent="handleDrop"
       @dragleave.prevent="hideDropZone"
       ref="dropzone"
  >
    <div class="dropzone-text">
      {{ $t('motor-media.global.drop_file_here') }}
    </div>
  </div>

  <div ref="form" class="form-group" :class="{ 'has-danger': validationError}">
    <label :for="id">
      {{ label }}
    </label>
    <div class="d-none">
      <input :id="id" type="file" ref="fileInput" :name="name"/>
    </div>
    <div v-if="validationError && validationErrorMessage.length" class="alert alert-danger" role="alert">
      {{ validationErrorMessage }}
    </div>

    <!-- Highlight small drop zone for Fullscreen drag and drop -->
    <div v-if="fullScreenDragAndDrop && !file"
         class="col-md-4 drop-zone"
         :class="{ over: status.over }"
    >
      <span> {{ $t('motor-media.global.drop_file_here') }} </span>
    </div>

    <!-- Display drop zone for non-fullscreen drag and drop -->
    <div v-if="!fullScreenDragAndDrop && !file"
         class="col-md-4 drop-zone"
         @dragover.prevent="handleDragOver"
         @drop.prevent="handleDrop"
         @dragleave.prevent="handleDragLeave"
         :class="{ over: status.over }"
    >
      <span> {{ $t('motor-media.global.drop_file_here') }} </span>
    </div>

    <div v-if="file" class="row" style="padding-left: 0.75rem">
      <div class="col-md-4">
        <!-- Lightbox for existing images -->
        <vue-easy-lightbox
          v-if="file.conversions && file.conversions.preview && isImage(file.mime_type)"
          scrollDisabled
          moveDisabled
          :visible="lightboxVisible"
          :imgs="[file.conversions.preview]"
          :index="0"
          @hide="lightboxVisible = false"
        >
        </vue-easy-lightbox>

        <!-- Thumbnail image for existing files -->
        <img
          v-if="file.conversions && file.conversions.thumb && isImage(file.mime_type)"
          :src="file.conversions.thumb"
          class="img-fluid border-radius-lg"
          alt="File preview"
          @click="lightboxVisible = true"
          style="cursor: pointer; margin-bottom: 8px; max-width: 100%;"
        />

        <!-- Preview for newly uploaded files (base64) -->
        <div
          v-else-if="file.url && isImage(file.mime_type)"
          class="drop-zone"
          :style="'background-image:url(' + file.url + ');'"
        >
        </div>

        <!-- Non-image file display -->
        <div v-else class="drop-zone">
          <span style="overflow-wrap: anywhere">
            {{ file.mime_type || 'File' }}
          </span>
        </div>
      </div>
      <div v-if="file.name !== ''" class="col-md-8">
        <button
          v-if="allowDelete"
          @click="deleteFile"
          class="btn btn-danger btn-sm align-content-end"
          type="button"
        >
          <fa icon="trash-alt"/>
        </button>
        <p><strong>{{ $t('motor-media.global.file') }}:</strong> {{ file.name }} </p>
        <p><strong>{{ $t('motor-media.global.type') }}:</strong> {{ file.mime_type }} </p>
        <p v-if="file.size"><strong>{{ $t('motor-media.global.size') }}:</strong> {{ filesize(file.size) }} </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, watch, onMounted, onBeforeUnmount} from 'vue'
import {useField} from "vee-validate";
import {useI18n} from 'vue-i18n';
import {filesize} from "filesize";
import VueEasyLightbox from 'vue-easy-lightbox'
import {useMimeType} from "@zrm/base-components/composables/shared/useMimeType";

interface FileConversions {
  thumb?: string,
  preview?: string
}

interface FileTemplate {
  name: string,
  size: number,
  dataUrl: string,
  type: string,
  mime_type: string,
  url: string,
  file?: string,
  uuid?: string,
  conversions?: FileConversions
}

export default defineComponent({
  name: 'SingleFileUploadField',
  components: {
    VueEasyLightbox
  },
  props: {
    id: String,
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Object,
      default: null,
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    fullScreenDragAndDrop: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const {t} = useI18n()
    const { isImage: isImageMimeType } = useMimeType();
    const dropzone = ref<HTMLInputElement | null>(null);

    const {
      value: inputValue,
      handleChange,
    } = useField<FileTemplate | null>(props.name, undefined, {
      initialValue: props.modelValue,
      syncVModel: true
    })

    const file = ref<FileTemplate | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);
    const lightboxVisible = ref(false);

    const status = ref({
      over: false,
      dropped: false,
    })

    const validationError = ref(false)
    const validationErrorMessage = ref("");

    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      if (newValue && typeof newValue === 'object' && Object.keys(newValue).length > 0) {
        // Ensure all required properties exist
        const fileData = {
          name: (newValue as any).name || '',
          size: (newValue as any).size || 0,
          dataUrl: (newValue as any).dataUrl || '',
          type: (newValue as any).type || '',
          mime_type: (newValue as any).mime_type || (newValue as any).type || '',
          url: (newValue as any).url || '',
          file: (newValue as any).file,
          uuid: (newValue as any).uuid,
          conversions: (newValue as any).conversions
        } as FileTemplate;
        file.value = fileData;
      } else {
        file.value = null;
      }
    }, { immediate: true })

    const handleDragOver = () => {
      status.value.over = true;
    }

    const handleDragLeave = () => {
      status.value.over = false;
    }

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      hideDropZone();
      status.value.dropped = true
      status.value.over = false
      validationError.value = false;
      validationErrorMessage.value = '';

      if (!event.dataTransfer) return;

      if (event.dataTransfer.files.length > 1) {
        validationError.value = true;
        validationErrorMessage.value = t('motor-media.global.single_file_only') || 'Only one file allowed';
        return;
      }

      const fileItem = event.dataTransfer.files[0];
      if (!fileItem) return;

      const tempFile: FileTemplate = {
        name: fileItem.name,
        size: fileItem.size,
        url: '',
        file: '',
        mime_type: fileItem.type,
        type: fileItem.type,
        dataUrl: ''
      }

      const reader = new FileReader()
      reader.readAsDataURL(fileItem)

      reader.onloadend = (event) => {
        if (!event.target) return;
        const fileResult = event.target.result as string
        tempFile.url = fileResult
        tempFile.file = fileResult
        tempFile.dataUrl = fileResult

        file.value = tempFile;
        handleChange(tempFile, false);
      }
    }

    function showDropZone() {
      if (!dropzone.value) return;
      dropzone.value.style.display = "flex";
      handleDragOver();
    }

    function hideDropZone() {
      if (!dropzone.value) return;
      dropzone.value.style.display = "none";
      status.value.over = false;
    }

    function preventDefaultDropEvent(e: DragEvent) {
      e.preventDefault();
    }

    function initFullScreenDragAndDrop() {
      if (!props.fullScreenDragAndDrop) return;
      window.addEventListener('dragenter', showDropZone);
    }

    // Use the composable's isImage function
    const isImage = (type: string) => {
      return isImageMimeType(type);
    }

    const deleteFile = () => {
      file.value = null;
      handleChange(null, false);
    }

    onMounted(() => {
      initFullScreenDragAndDrop();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('dragenter', showDropZone);
    });

    return {
      file,
      status,
      deleteFile,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      hideDropZone,
      preventDefaultDropEvent,
      isImage,
      fileInput,
      validationError,
      validationErrorMessage,
      inputValue,
      dropzone,
      filesize,
      lightboxVisible
    }
  },
})
</script>

