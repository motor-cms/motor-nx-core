<template>
  <div class="input-group mb-3">
    <span id="tagError" v-if="data.error">{{ data.error }}</span>
    <input ref="tagsInput" :disabled="disableForms" class="form-control" :placeholder="$t('global.type_to_add_tags')"
           v-model="data.addTag">
    <button ref="addTagButton" :disabled="disableForms" class="btn btn-outline-primary mb-0" id="button-addon2"
            @click.prevent="pushTag" icon="plus">Tag hinzufügen
    </button>
  </div>
  <div id="tag" v-for="tag in taggings">
    {{ tag }} <span style="cursor:pointer;" @click="deleteTag(tag)">x</span>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";

import {storeToRefs} from "pinia";

const props = defineProps({
  placeholder: String,
  data: Array<String>,
  modelValue: {
    type: Array<String>,
    default: []
  }
});

const data = reactive({
  addTag: '',
  error: false
});

const tagsInput = ref<HTMLInputElement>();
const addTagButton = ref<HTMLButtonElement>();

onMounted(() => {
  if (tagsInput.value && addTagButton.value) {
    // Execute a function when the user presses a key on the keyboard
    tagsInput.value.addEventListener("keypress", function (event) {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addTagButton.value.click();
      }
    });
  }
})

const taggings = ref<Array<String>>(props.modelValue);

const appStore = useAppStore();
const {disableForms} = storeToRefs(appStore);

watch(() => props.modelValue, (val) => {
  taggings.value = val;
});

const emit = defineEmits(['update:modelValue']);

const deleteTag = (tag) => {
  const index = taggings.value.indexOf(tag);
  taggings.value.splice(index, 1);
  emit("update:modelValue", taggings.value);
};

const pushTag = () => {
  if (data.addTag.length > 2) {
    console.log("data", taggings)
    taggings.value.push(data.addTag);
    data.addTag = '';
    emit("update:modelValue", taggings.value);
    data.error = false;
  } else {
    data.error = "Die Eingabe muss 3 zeichen lang sein";
  }
};

</script>
<style scoped lang="scss">
#tag {
  margin: 15px 5px 0px 0px;
  padding: 2px 5px 2px 5px;
  float: left;
  background-color: #fda238;
  border-radius: 10px;
}

#tag span {
  cursor: pointer;
}

#tagError {
  color: #b41414;
  font-size: 0.9rem;
}
</style>
