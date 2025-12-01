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
      {{ $t('motor-media.global.drop_files_here') }}
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
    <div v-if="fullScreenDragAndDrop && files.length === 0"
         class="col-md-4 drop-zone"
         :class="{ over: status.over }"
    >
      <span> {{ $t('motor-media.global.drop_files_here') }} </span>
    </div>

    <!-- Display drop zone for non-fullscreen drag and drop -->
    <div v-if="!fullScreenDragAndDrop && files.length === 0"
         class="col-md-4 drop-zone"
         @dragover.prevent="handleDragOver"
         @drop.prevent="handleDrop"
         @dragleave.prevent="handleDragLeave"
         :class="{ over: status.over }"
    >
      <span> {{ $t('motor-media.global.drop_files_here') }} </span>
    </div>

    <div v-for="(file, index) in files"
         :key="`file-${index}-${file.name}`"
         class="row"
         style="padding-left: 0.75rem; margin-bottom: 1rem;"
    >
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
      <div v-if="file.name !== ''" class="col-md-4">
        <button
          v-if="allowDelete"
          @click="deleteFile(index)"
          class="btn btn-danger btn-sm align-content-end"
          type="button"
        >
          <fa icon="trash-alt"/>
        </button>
        <p><strong>{{ $t('motor-media.global.file') }}:</strong> {{ file.name }} </p>
        <p><strong>{{ $t('motor-media.global.type') }}:</strong> {{ file.mime_type }} </p>
        <p v-if="file.size"><strong>{{ $t('motor-media.global.size') }}:</strong> {{ filesize(file.size) }} </p>
      </div>
      <div class="col-4">
        <div class="form-group">
          <label :for="`description_${index}`">
            {{ $t('motor-media.files.description') }}
          </label>
          <input
              type="text"
              class="form-control"
              :id="`description_${index}`"
              :name="`metadata[${index}].description`"
              v-model="file.description"
              @input="syncToModel"
          />
        </div>
        <div class="form-group">
          <label :for="`alt_text_${index}`">
            {{ $t('motor-media.files.alt_text') }}
          </label>
          <input
              type="text"
              class="form-control"
              :id="`alt_text_${index}`"
              :name="`metadata[${index}].alt_text`"
              v-model="file.alt_text"
              @input="syncToModel"
          />
        </div>
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
  description: string,
  alt_text: string,
  uuid?: string
}

export default defineComponent({
  name: 'MultiFileUploadField',
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
      type: Array,
      default: () => [],
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    fullScreenDragAndDrop: {
      type: Boolean,
      default: false,
    },
    defaultDescription: {
      type: String,
      default: '',
    },
    defaultAltText: {
      type: String,
      default: '',
    }
  },
  setup(props, ctx) {
    const {t} = useI18n()
    const dropzone = ref<HTMLInputElement | null>(null);

    const {
      value: inputValue,
      handleChange,
    } = useField<FileTemplate[]>(props.name, undefined, {
      initialValue: props.modelValue,
      syncVModel: true
    })

    const files = ref<FileTemplate[]>([]);
    const fileInput = ref<HTMLInputElement | null>(null);

    const status = ref({
      over: false,
      dropped: false,
    })

    const validationError = ref(false)
    const validationErrorMessage = ref("");

    // Sync files array to model
    const syncToModel = () => {
      handleChange([...files.value], false);
    }

    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      if (Array.isArray(newValue)) {
        files.value = [...newValue];
      } else {
        files.value = [];
      }
    }, { immediate: true })

    // Watch for changes in default props and apply to ALL files (force update)
    watch(() => props.defaultDescription, (newDescription) => {
      let hasChanges = false;
      files.value.forEach((file) => {
        // Only update new files (no uuid)
        if (!file.uuid) {
          file.description = newDescription || '';
          hasChanges = true;
        }
      });
      if (hasChanges) {
        syncToModel();
      }
    });

    watch(() => props.defaultAltText, (newAltText) => {
      let hasChanges = false;
      files.value.forEach((file) => {
        // Only update new files (no uuid)
        if (!file.uuid) {
          file.alt_text = newAltText || '';
          hasChanges = true;
        }
      });
      if (hasChanges) {
        syncToModel();
      }
    });

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

      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const fileItem = event.dataTransfer.items[i].getAsFile()
        if (!fileItem) continue;

        const tempFile: FileTemplate = {
          name: fileItem.name,
          size: fileItem.size,
          url: '',
          file: '',
          mime_type: fileItem.type,
          type: fileItem.type,
          dataUrl: '',
          description: props.defaultDescription || '',
          alt_text: props.defaultAltText || ''
        }

        const reader = new FileReader()
        reader.readAsDataURL(fileItem)

        reader.onloadend = (event) => {
          if (!event.target) return;
          const fileResult = event.target.result as string
          tempFile.url = fileResult
          tempFile.file = fileResult
          tempFile.dataUrl = fileResult

          files.value.push(tempFile);
          syncToModel();
        }
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

    const deleteFile = (index: number) => {
      files.value.splice(index, 1);
      syncToModel();
    }

    onMounted(() => {
      initFullScreenDragAndDrop();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('dragenter', showDropZone);
    });

    return {
      files,
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
      syncToModel
    }
  },
})
</script>

