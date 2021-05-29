<template>
  <form @submit="submit">
    <div class="col-lg-12 col-md-12 mb-md-0 mb-4">
      <div class="card">
        <div class="card-header pb-0">
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-md-6">
                  <h6>{{ title }}</h6>
                </div>
                <div class="col-md-6 text-end">
                  <router-link :to="{ name: backRoute }">
                    <button class="btn btn-danger btn-sm">
                      {{ $t('global.back') }}
                    </button>
                  </router-link>
                  <button class="btn btn-sm btn-success ms-2" type="submit">
                    {{ $t('global.save') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body px-4 pb-2">
          <slot></slot>
        </div>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['submit'],
  props: {
    title: {
      type: String,
      default: 'Form',
    },
    backRoute: {
      type: String,
      default: '',
    },
  },
  methods: {
    submit(e: Event) {
      e.preventDefault()
      this.$emit('submit')
    },
  },
})
</script>
