<template>
  <div class="dropzone"
       v-if="fullScreenDragAndDrop"
       v-on:dragenter.prevent="preventDefaultDropEvent"
       v-on:dragover.prevent="preventDefaultDropEvent"
       v-on:drop.prevent="handleDrop"
       v-on:dragleave.prevent="hideDropZone"
       ref="dropzone"
  >
    <div class="dropzone-text">
      {{ dropzoneText }}
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
    <div v-if="fullScreenDragAndDrop && (multiple || (!multiple && !files.length))"
         class="col-md-4 drop-zone"
         :class="{ over: status.over }"
    >
      <span> {{ dropzoneText }} </span>
    </div>

    <!-- Display drop zone for non-fullscreen drag and drop -->
    <div v-if="!fullScreenDragAndDrop && (multiple || (!multiple && !files.length))"
         class="col-md-4 drop-zone"
         v-on:dragover.prevent="handleDragOver"
         v-on:drop.prevent="handleDrop"
         v-on:dragleave.prevent="handleDragLeave"
         :class="{ over: status.over }"
    >
      <span> {{ dropzoneText }} </span>
    </div>

    <div v-for="(file, index) in files"
         :key="index"
         class="row"
         style="padding-left: 0.75rem"
    >
      <div
        class="col-md-4 drop-zone"
        :style=" isImage(file.mime_type)
            ? 'background-image:url(' + (file.url) + ');'
            : ''
        "
      >
        <span v-if="file.url === ''"> {{ dropzoneText }} </span>
        <span v-if="!isImage(file.mime_type)" style="overflow-wrap: anywhere">
          {{ file.mime_type }}
        </span>
      </div>
      <div v-if="file.name !== ''" class="col-md-4">
        <button
          v-if="allowDelete"
          @click="deleteFile(file.name)"
          class="btn btn-danger btn-sm align-content-end"
          type="button"
        >
          <fa icon="trash-alt"/>
        </button>
        <p><strong>{{ $t('motor-media.global.file') }}:</strong> {{ file.name }} </p>
        <p><strong>{{ $t('motor-media.global.type') }}:</strong> {{ file.mime_type }} </p>
        <p><strong>{{ $t('motor-media.global.size') }}:</strong> {{ filesize(file.size) }} </p>
      </div>
      <div v-if="metadata.length > 1" class="col-4">

        <div class="form-group">
          <label :for="id">
            {{ $t('motor-media.files.description') }}
          </label>
          <input
              type="text"
              class="form-control"
              :id="`description_${index}`"
              :name="`metadata[${index}].description`"
              v-model="metadata[index].description"
          />
        </div>
        <div class="form-group">
          <label :for="id">
            {{ $t('motor-media.files.alt_text') }}
          </label>
          <input
              type="text"
              class="form-control"
              :id="`alt_text_${index}`"
              :name="`metadata[${index}].alt_text`"
              v-model="metadata[index].alt_text"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, watch, defineEmits} from 'vue'
import {useField} from "vee-validate";
import {useI18n} from 'vue-i18n';
import {filesize} from "filesize";

export default defineComponent({
  emits: ['updateMetadata'],
  name: 'FileUploadField',
  props: {
    id: String,
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: Array || Object,
      default: () => [],
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    cssClass: {
      type: String,
      default: '',
    },
    allowDelete: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    //!Don't use multiple FullScreenDragAndDrop Upload Fields on the same Page. Will lead to unexpected behaviour!
    fullScreenDragAndDrop: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, ctx ) {
    const {t} = useI18n()
    const dropzone = ref<HTMLInputElement | null>(null);

      // Computed property for dropzone text based on props
    const dropzoneText = computed(() => {
      return props.multiple
        ? t('motor-media.global.drop_files_here')
        : t('motor-media.global.drop_file_here');
    });

    const {
      value: inputValue,
      handleChange,
    } = useField(<string>props.name, undefined, {
      initialValue: props.modelValue,
      syncVModel: true
    })

    const fileTemplate = {
      name: '',
      size: 0,
      dataUrl: <any>'',
      type: '',
    }

    interface FileTemplate {
      name: string,
      size: number,
      dataUrl: string,
      type: string
      alt_text: string,
      description: string
    }

    // Create a property that holds the file information
    const files = ref();
    const parsedFiles = ref<Array<FileTemplate>>([]);
    const fileInput = ref(null);
    const file = ref(fileTemplate)

    // Add the drag and drop status as an object
    const status = ref({
      over: false,
      dropped: false,
    })

    const validationError = ref(false)
    const validationErrorMessage = ref("");

    const handleDragOver = () => {
      status.value.over = true;
    }

    const handleDragLeave = () => {
      status.value.over = false;
    }

    const handleDrop = (event: any) => {
      event.preventDefault();
      hideDropZone();
      status.value.dropped = true
      status.value.over = false
      validationError.value = false;
      validationErrorMessage.value = '';

      console.log("Files", parsedFiles.value);

      if (!props.multiple) {
        if (event.dataTransfer.files.length > 1 || parsedFiles.value.length > 0) {
          validationError.value = true;
          validationErrorMessage.value = 'Dateiupload nur für eine Datei erlaubt.'
          return;
        }
      }

      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const fileItem = event.dataTransfer.items[i].getAsFile()
        let tempFile = {
          name: fileItem.name,
          size: fileItem.size,
          url: '',
          file: '',
          mime_type: fileItem.type,
          type: fileItem.type,
          description: '',
          alt_text: ''
        }

        const reader = new FileReader()
        // Read the file's content as base64 encoded string, represented by a url
        reader.readAsDataURL(fileItem)

        // Wait for the browser to finish reading and fire the onloaded-event:
        reader.onloadend = (event) => {

          console.log("Tempfile", tempFile);
          console.log("Parsed", JSON.stringify(parsedFiles.value));
          // Take the reader's result and use it for the next method
          const fileResult = event.target.result
          tempFile.url = <string>fileResult
          tempFile.file = <string>fileResult
          if (props.multiple) {
            parsedFiles.value.push(tempFile)
            metadata.value.push({description: '', alt_text: ''});
          } else {
            parsedFiles.value[0] = tempFile;
          }
          console.log("Parsed", JSON.stringify(parsedFiles.value));
          if (!props.multiple) {
            handleChange(parsedFiles.value[0], false)
          } else {
            handleChange(parsedFiles.value, false)
          }
        }
      }
    }

    function showDropZone() {
      if (!dropzone.value) {
        return;
      }
      dropzone.value.style.display = "flex";
      handleDragOver();
    }

    function hideDropZone() {
      if (!dropzone.value) {
        return;
      }
      dropzone.value.style.display = "none";
      status.value.over = false;
    }

    function preventDefaultDropEvent(e: DragEvent) {
      e.preventDefault();
    }

    function initFullScreenDragAndDrop() {
      if (!props.fullScreenDragAndDrop) {
        return;
      }

      window.addEventListener('dragenter', showDropZone);
    }

    onMounted(() => {
      initFullScreenDragAndDrop();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('dragenter', showDropZone);
    });

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

    const deleteFile = (fileName: string) => {
      if (props.multiple) {
        parsedFiles.value = parsedFiles.value.filter(file => file.name !== fileName);
        handleChange(parsedFiles.value, false);
      } else {
        parsedFiles.value = [];
        metadata.value = [];
        handleChange(null, false);
      }
    }

    // Take care of individual data for description and alt_text
    const metadata = ref([]);

    watch(() => props.modelValue, () => {
      if (!props.multiple) {
        if (inputValue.value && Object.keys(inputValue.value).length) {
          parsedFiles.value[0] = inputValue.value
        } else {
          parsedFiles.value = [];
        }
      } else {
        parsedFiles.value = inputValue.value;
      }
    }, {immediate: true})

    watch(() => metadata, () => {

      for (let i = 0; i < metadata.value.length; i++) {
        parsedFiles.value[i]["description"] = metadata.value[i].description;
        parsedFiles.value[i]["alt_text"] = metadata.value[i].alt_text;
      }

      handleChange(parsedFiles.value, false);

      // metadata.value.forEach((item, index) => {
      //   parsedFiles.value[index].description = item.description;
      //   parsedFiles.value[index].alt_text = item.alt_text;
      // });
      // ctx.emit('updateMetadata', JSON.parse(JSON.stringify(metadata.value)));
    }, {deep: true});

    onMounted(() => {
      files.value = new DataTransfer();
    })

    return {
      file,
      files: parsedFiles,
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
      dropzoneText,
      metadata,
      filesize
    }
  },
})
</script>
