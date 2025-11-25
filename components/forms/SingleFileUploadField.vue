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
      <div
        class="col-md-4 drop-zone"
        :style=" isImage(file.mime_type)
            ? 'background-image:url(' + (file.url) + ');'
            : ''
        "
      >
        <span v-if="file.url === ''"> {{ $t('motor-media.global.drop_file_here') }} </span>
        <span v-if="!isImage(file.mime_type)" style="overflow-wrap: anywhere">
          {{ file.mime_type }}
        </span>
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

interface FileTemplate {
  name: string,
  size: number,
  dataUrl: string,
  type: string,
  mime_type: string,
  url: string,
  file?: string,
  uuid?: string
}

export default defineComponent({
  name: 'SingleFileUploadField',
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
  setup(props, ctx) {
    const {t} = useI18n()
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

    const status = ref({
      over: false,
      dropped: false,
    })

    const validationError = ref(false)
    const validationErrorMessage = ref("");

    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      if (newValue && typeof newValue === 'object' && Object.keys(newValue).length > 0) {
        file.value = {...newValue} as FileTemplate;
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
      filesize
    }
  },
})
</script>

