<template>
  <div class="form-group" :class="{ 'has-danger': validationError}">
    <label :for="id">
      {{ label }}
    </label>
    <div class="d-none">
      <input :id="id" type="file" ref="fileInput" :name="name"/>
    </div>
    <div v-if="validationError && validationErrorMessage.length" class="alert alert-danger" role="alert">
      {{ validationErrorMessage }}
    </div>
    <div
      v-if="multiple || (!multiple && !files.length)"
      class="col-md-4 drop-zone"
      v-on:dragover.prevent="handleDragOver"
      v-on:drop.prevent="handleDrop"
      v-on:dragleave.prevent="handleDragLeave"
      :class="{
          over: status.over,
        }"
    >
        <span>
          <template v-if="multiple">
            {{ $t('motor-media.global.drop_files_here') }}
          </template>
          <template v-else>
            {{ $t('motor-media.global.drop_file_here') }}
          </template>
        </span>
    </div>
    <div
      class="row"
      style="padding-left: 0.75rem"
      v-for="(file, index) in files"
      :key="index"
    >
      <div
        class="col-md-4 drop-zone"
        :style="
          isImage(file.mime_type)
            ? 'background-image:url(' +
              (file.url) +
              ');'
            : ''
        "
      >
        <span v-if="file.url === ''">
          <template v-if="multiple">
            {{ $t('motor-media.global.drop_files_here') }}
          </template>
          <template v-else>
            {{ $t('motor-media.global.drop_file_here') }}
          </template>
        </span>
        <span v-if="!isImage(file.mime_type)" style="overflow-wrap: anywhere">
          {{ file.mime_type }}
        </span>
      </div>
      <div
        class="col-md-8"
        v-if="file.name !== ''"
      >
        <button
          v-if="allowDelete"
          @click="deleteFile(file.name)"
          class="btn btn-danger btn-sm align-content-end"
          type="button"
        >
          <fa icon="trash-alt"/>
        </button>
        <p><strong>File:</strong> {{ file.name }}</p>
        <p>
          <strong>Type:</strong>
          {{ file.mime_type }}
        </p>
        <p>
          <strong>Size:</strong>
          {{ file.size }} kb
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from 'vue'
import {useField} from "vee-validate";

export default defineComponent({
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
  },
  setup(props, ctx) {

    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: props.modelValue,
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
    }

    // Create a property that holds the file information
    const files = ref(new DataTransfer());
    const parsedFiles = ref<Array<FileTemplate>>([]);
    const fileInput = ref(null);
    const file = ref(fileTemplate)

    // Add the drag and drop status as an object
    const status = ref({
      over: false,
      dropped: false,
    })

    const fileCount = ref(0)

    const validationError = ref(false)
    const validationErrorMessage = ref("");
    const handleDragOver = (event: any) => {
      status.value.over = true
    }

    const handleDragLeave = () => {
      status.value.over = false
    }

    const handleDrop = (event: any) => {
      status.value.dropped = true
      status.value.over = false
      validationError.value = false;
      validationErrorMessage.value = '';

      if (!props.multiple) {
        if (event.dataTransfer.files.length > 1 || parsedFiles.value.length > 0) {
          validationError.value = true;
          validationErrorMessage.value = 'Dateiupload nur für eine Datei erlaubt.'
          return;
        }
      }

      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        console.log("files",event.target.files)
        const fileItem = event.dataTransfer.items[i].getAsFile()
        let tempFile = {
          name: fileItem.name,
          size: parseFloat((fileItem.size / 1000).toFixed(2)),
          url: '',
          file: '',
          mime_type: fileItem.type,
          type: fileItem.type,
        }

        console.log('DEBUG: ', fileItem);

        const reader = new FileReader()
        // Read the file's content as base64 encoded string, represented by a url
        reader.readAsDataURL(fileItem)

        // Wait for the browser to finish reading and fire the onloaded-event:
        reader.onloadend = (event) => {
          fileCount.value++
          // Take the reader's result and use it for the next method
          const fileResult = event.target.result
          tempFile.url = <string>fileResult
          tempFile.file = <string>fileResult
          parsedFiles.value.push(tempFile)
          if (!props.multiple) {
            handleChange(parsedFiles.value[0], false)
          } else {
            handleChange(parsedFiles.value, false)
          }
        }
      }
    }


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
        handleChange({}, false);
      }
    }

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
    })


    return {
      file,
      files: parsedFiles,
      status,
      deleteFile,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      isImage,
      fileInput,
      validationError,
      validationErrorMessage,
      inputValue
    }
  },
})
</script>
