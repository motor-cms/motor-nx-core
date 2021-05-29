<template>
  <div class="form-group" :class="{ 'has-danger': errorMessage }">
    <label :for="id">
      {{ label }}
    </label>
    <div class="d-none">
      <input :id="id" type="file" :name="name" />
    </div>
    <div
      class="row"
      style="padding-left: 0.75rem"
      v-for="(file, index) in files"
      :key="index"
    >
      <div
        v-if="index === 0"
        class="col-md-4 drop-zone"
        :style="
          isImage(file.type)
            ? 'background-image:url(' +
              (file.dataUrl || inputValue?.conversions?.preview) +
              ');'
            : ''
        "
        v-on:dragover.prevent="handleDragOver"
        v-on:drop.prevent="handleDrop"
        v-on:dragleave.prevent="handleDragLeave"
        :class="{
          over: status.over,
        }"
      >
        <span v-if="file.dataUrl === '' && !inputValue?.conversions">
          <template v-if="multiple">
            {{ $t('motor-media.global.drop_files_here') }}
          </template>
          <template v-else>
            {{ $t('motor-media.global.drop_file_here') }}
          </template>
        </span>
        <span v-if="!isImage(file.type)" style="overflow-wrap: anywhere">
          {{ file.type }}
        </span>
      </div>

      <div
        v-if="index > 0"
        class="col-md-4 drop-zone"
        :style="
          isImage(file.type)
            ? 'background-image:url(' +
              (file.dataUrl || inputValue?.conversions?.preview) +
              ');'
            : ''
        "
      >
        <span v-if="file.dataUrl === '' && !inputValue?.conversions">
          <template v-if="multiple">
            {{ $t('motor-media.global.drop_files_here') }}
          </template>
          <template v-else>
            {{ $t('motor-media.global.drop_file_here') }}
          </template>
        </span>
        <span v-if="!isImage(file.type)" style="overflow-wrap: anywhere">
          {{ file.type }}
        </span>
      </div>
      <div
        class="col-md-8"
        v-if="(status.dropped || inputValue?.conversions) && file.name !== ''"
      >
        <button
          v-if="allowDelete"
          @click="deleteImage"
          class="btn btn-danger btn-sm align-content-end"
          type="button"
        >
          <fa icon="trash-alt" />
        </button>
        <p><strong>File:</strong> {{ file.name }}</p>
        <p>
          <strong>Type:</strong>
          {{ file.type }}
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
import { defineComponent, ref, watch } from 'vue'
import { useField } from 'vee-validate'

export default defineComponent({
  name: 'FileField',
  props: {
    id: String,
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: Object,
      default: () => {},
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
  setup(props) {
    const fileTemplate = {
      name: '',
      size: 0,
      dataUrl: <any>'',
      type: '',
    }

    // Create a property that holds the file information
    const files = ref([fileTemplate])

    const file = ref(fileTemplate)
    // Add the drag and drop status as an object
    const status = ref({
      over: false,
      dropped: false,
    })

    const fileCount = ref(0)

    const handleDragOver = () => {
      status.value.over = true
    }

    const handleDragLeave = () => {
      status.value.over = false
    }

    const handleDrop = (event: any) => {
      status.value.dropped = true
      status.value.over = false

      // reset file count and clear files
      fileCount.value = 0
      if (props.multiple) {
        files.value = [fileTemplate]
      } else {
        files.value = []
      }

      const fileInput = <HTMLInputElement>(
        document.getElementById(props.id.toString())
      )
      // if (!props.multiple) {
      //   fileInput.files = <any[]>event.dataTransfer.files[0]
      // } else {
      fileInput.files = event.dataTransfer.files
      // }

      for (let i = 0; i < fileInput.files.length; i++) {
        const fileItem = event.dataTransfer.items[i].getAsFile()
        let tempFile = {
          name: fileItem.name,
          size: parseFloat((fileItem.size / 1000).toFixed(2)),
          dataUrl: '',
          type: fileItem.type,
        }

        const reader = new FileReader()
        // Read the file's content as base64 encoded string, represented by a url
        reader.readAsDataURL(fileItem)

        // Wait for the browser to finish reading and fire the onloaded-event:
        reader.onloadend = (event) => {
          fileCount.value++
          // Take the reader's result and use it for the next method
          const fileResult = event.target.result
          tempFile.dataUrl = <string>fileResult
          files.value.push(tempFile)
        }
      }
    }

    watch(fileCount, (value) => {
      if (props.multiple) {
        if (<number>value === files.value.length - 1) {
          console.log('change approved (multi)')
          handleChange(files)
        }
      } else {
        if (files.value.length === 0) {
          return
        }
        if (<number>value === files.value.length) {
          console.log('change approved (single)')
          handleChange(files.value[0])
        }
      }
    })

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

    const deleteImage = () => {
      console.log('HIER')
      handleChange(false)
    }

    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(<string>props.name, undefined, {
      initialValue: props.value,
    })

    const initialWatcher = watch(inputValue, (value) => {
      if (value && !value.file) {
        files.value = [
          {
            name: value.file_name,
            size: parseFloat((value.size / 1000).toFixed(2)),
            dataUrl: '',
            type: value.mime_type,
          },
        ]
        // Unwatch it again after it has been set once
        initialWatcher()
      }
    })

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
      file,
      files,
      status,
      deleteImage,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      isImage,
    }
  },
})
</script>
