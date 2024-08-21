<template>
  <div class="form-group">
    <label :for="props.id">{{ props.label }}</label>
    <div class="multiselect">
      <div class="multiselect-wrapper">
        <AdminPartialsSpinnerSmall v-if="isLoading && !currentValueDisplayName.length" />
        <input
          :id="props.id"
          v-model="debouncedSearch"
          type="text"
          class="multiselect-search"
          :placeholder="currentValueDisplayName"
          :title="currentValueDisplayName"
          :name="props.name"
          @focus="setSearchDisplayStatus(true)"
          @blur="setSearchDisplayStatus(false)"
        >
        <span
          v-if="debouncedSearch.length || currentValueDisplayName.length"
          class="multiselect-clear"
          @click="clearSelectedElement()"
        >
          <span class="multiselect-clear-icon" />
        </span>
        <span
          class="multiselect-caret"
          :class="{'is-open': isSearchDisplayed}"
          aria-hidden="true"
        />
      </div>
      <div
        id="link_type-dropdown"
        class="multiselect-dropdown"
        :class="{'is-hidden': !isSearchDisplayed}"
        tabindex="-1"
      >
        <ul
          id="link_type-multiselect-options"
          class="multiselect-options"
          role="listbox"
        >
          <li
            v-if="!debouncedSearch.length && searchResults.length === 0"
            class="no-result multiselect-info"
          >
            Bitte geben Sie etwas ein, um die Suche zu starten.
          </li>
          <li
            v-if="isLoading"
            style="scale: 0.6"
            class="spinner-grow"
          />
          <li
            v-else-if="searchResults.length === 0 && debouncedSearch.length"
            class="multiselect-error"
          >
            Keine
            Ergebnisse gefunden.
          </li>
          <li
            v-for="item in searchResults"
            v-else
            :id="'link_type-multiselect-option-' + item[props.keyForDisplayedName]"
            :key="item.id + '' + item.uuid"
            class="multiselect-option"
            :class="{'is-selected': model && (item.id == model || item.uuid == model)}"
            data-selected="true"
            aria-selected="true"
            role="option"
            @mousedown="selectItem(item)"
          >
            <span>{{ item[props.keyForDisplayedName] }}</span>
            <span
              v-show="props.keyForDisplayedNameSecondary"
              class="secondary-display-value"
            >
              &nbsp;{{ item[props.keyForDisplayedNameSecondary] }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useDebounce} from "@zrm/motor-nx-core/composables/ui/debounce";

const searchContent = ref('');

const {debouncedInput: debouncedSearch} = useDebounce(500, searchContent);

const searchResults = ref([]);
const isLoading = ref(false);
const isLoadingDisplayName = ref(false);
const isSearchDisplayed = ref(false);

const currentValueDisplayName = ref('');

const model = defineModel();

const props = defineProps({
  id: {
    type: String,
    default: 'search',
  },
  name: {
    type: String,
    default: 'search',
  },
  label: {
    type: String,
    default: 'Search',
  },
  repository: {
    type: Object,
    default: () => {},
  },
  uuid: Boolean,
  keyForValue: {
    type: String,
    default (props) {
      return props.uuid ? 'uuid' : 'id';
    }
  },
  keyForDisplayedName: {
    type: String,
    default: 'name',
  },
  keyForDisplayedNameSecondary: {
    type: String,
    default: ''
  },
  filters: {
    type: Object,
    default() {
      return {};
    }
  },
});

const clearSelectedElement = () => {
  model.value = null;
  currentValueDisplayName.value = '';
}

const setSearchDisplayStatus = (status: boolean) => {
  isSearchDisplayed.value = status;
  if (!status) {
    searchContent.value = '';
  }
}

const setDisplayName = (item: object) =>
  currentValueDisplayName.value = item[props.keyForDisplayedName] + (props.keyForDisplayedNameSecondary? (" - " + item[props.keyForDisplayedNameSecondary]): "");

const selectItem = (item: object) => {
  //To clear the selected element when we click on the same element in the list
  if (model.value === item[props.keyForValue]) {
    clearSelectedElement();
    return;
  }
  model.value = item[props.keyForValue];
  setDisplayName(item);
  //Change debounceSearch immediately (we clear the search input)
  searchContent.value = '';
}

watchEffect(async () => {
  isLoading.value = true;
  await props.repository().index({
    ...props.filters,
    ts: new Date().getTime(),
    per_page: 200,
    reduced: true,
    page: 1,
    search: JSON.parse(JSON.stringify(debouncedSearch.value))
  }).then((response) => {
    searchResults.value = response.data.value.data;
    isLoading.value = false;
  });
})

watchEffect(() => {
  if (model.value) {
    isLoadingDisplayName.value = true;
    if (props.uuid) {
      props.repository().getByUuid(model.value).then((response) => {
        setDisplayName(response.data.value.data);
        isLoadingDisplayName.value = false;
      });
    } else {
      props.repository().get(model.value).then((response) => {
        setDisplayName(response.data.value.data);
        isLoadingDisplayName.value = false;
      });
    }
  }
})

</script>
<style lang="scss" scoped>
.secondary-display-value {
  text-align: right;
}

.multiselect-option:hover:not(.is-selected) {
  background: var(--ms-option-bg-pointed, #F3F4F6);
  color: var(--ms-option-color-pointed, #1F2937);
}
.multiselect-option {
  display: flex;
  justify-content: space-between;
}

.multiselect-search {
  color: black;

  &::placeholder {
    color: black;
    opacity: 1;
  }

  &::-ms-input-placeholder {
    color: black;
  }
}

.multiselect-info {
  padding: var(--ms-option-py, 0.5rem) var(--ms-option-px, 0.75rem);
  margin: 4px;
  border-radius: 4px;
  //Write in italic
  font-style: italic;
  background: #f7f7ff;
  border: 1px solid #c0bde0;
}

.multiselect-error {
  padding: var(--ms-option-py, 0.5rem) var(--ms-option-px, 0.75rem);
  margin: 4px;
  border-radius: 4px;
  //Write in italic
  font-style: italic;
  background: #ffdbdb;
  border: 1px solid #f08c8c;
}

.spinner-grow {
  //Center the spinner
  margin: 0 auto;
}
</style>
