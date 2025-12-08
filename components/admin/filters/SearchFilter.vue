<template>
  <div class="col-md-3">
    <div class="position-relative">
      <input
        id="motor-grid-search"
        v-model="term"
        @input="debouncedSearch"
        @keyup.enter="debouncedSearch"
        :placeholder="$t('global.press_enter_to_serach')"
        class="form-control form-control-alternative"
        :style="{ paddingRight: term ? '35px' : '' }"
      />
      <button
        v-if="term"
        type="button"
        class="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
        style="border: none; background: none; color: #6c757d; z-index: 10;"
        @click="clearSearch"
      >
        <fa icon="xmark" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">

const term = ref("");
const router = useRouter();
const route = useRoute();
const emits = defineEmits(['submit'])

watch(() => route.query, () => {
  term.value = route.query.search || ''
}, { immediate: true })

const submitSearch = async () => {
  const gridStore = useGridStore();
  gridStore.selectedItems = [];
  emits('submit', { parameter: 'search', value: term.value })
}

const debouncedSearch = useDebounceFn(submitSearch, 500)

const clearSearch = () => {
  term.value = ''
  submitSearch()
}
</script>
