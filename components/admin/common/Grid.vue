<template>
    <div class="col-lg-12 col-md-12 mb-md-0 mb-4">
      <div class="card">
        <div class="card-header pb-0">
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-md-6">
                  <div class="d-flex flex-row align-items-center">
                    <h6 class="m-0">{{ name }}</h6>
                    <SpinnerSmall  v-if="updatingInBackground"/>
                  </div>
                </div>

                <div class="col-md-6 text-end">
                  <component
                    v-for="component in headerActions"
                    :key="component.name"
                    :is="component.name"
                  />
                  <NuxtLink v-if="!withoutCreate && createRecordRoute" :to="createRecordRoute">
                    <a class="btn bg-gradient-primary border-radius-sm text-capitalize text-base mb-4 me-1">{{ createLabel }}</a>
                  </NuxtLink>
                </div>
              </div>
              <div class="row">
                <component
                  v-for="f in filters"
                  :key="f.name"
                  :is="f.name"
                  :options="f.options"
                  @submit="submitFilter"
                ></component>
                <div class="col" v-if="!loading">
                  <ul class="pagination float-end">
                    <li class="page-item disabled" v-if="meta.current_page === 1">
                      <a class="page-link text-black">
                        <fa icon="chevron-left"/>
                      </a>
                    </li>

                    <li
                      class="page-item"
                      @click="firstPage"
                      v-if="meta.current_page > 1"
                    >
                      <a class="page-link text-black">
                        <fa icon="chevron-left"/>
                        <fa icon="chevron-left"/>
                      </a>
                    </li>
                    <li
                      class="page-item"
                      @click="previousPage"
                      v-if="meta.current_page > 1"
                    >
                      <a class="page-link text-black">
                        <fa icon="chevron-left"/>
                      </a>
                    </li>
                    <li>
                      <select
                        class="form-control"
                        name="per-page"
                        @change="goToPage"
                        v-model="filterValues.page"
                      >
                        <option v-for="option in pageOptions" :value="option">Seite {{option}} von {{meta.last_page}}</option>
                      </select>
                    </li>
                    <li
                      class="page-item"
                      @click="nextPage()"
                      v-if="meta.current_page < meta.last_page"
                    >
                      <a class="page-link text-black">
                        <fa icon="chevron-right"/>
                      </a>
                    </li>

                    <li
                      class="page-item"
                      @click="lastPage()"
                      v-if="meta.current_page < meta.last_page"
                    >
                      <a class="page-link text-black">
                        <fa icon="chevron-right"/>
                        <fa icon="chevron-right"/>
                      </a>
                    </li>

                    <li
                      class="page-item disabled"
                      v-if="meta.current_page === meta.last_page"
                    >
                      <a class="page-link text-black">
                        <fa icon="chevron-right"/>
                      </a>
                    </li>
                  </ul>
                  <select
                    class="form-control max-width-100 d-inline float-end me-2"
                    name="per-page"
                    @change="submitFilter($event)"
                    v-model="filterValues.per_page"
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <div v-if="meta.total > 0" class="float-end mt-2 me-2">
                    {{ meta.from }} - {{ meta.to }} / {{ meta.total }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body px-0 pb-2">
          <div class="table-responsive">
            <table class="motor-nx-grid table align-items-center mb-0">
              <thead>
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.name"
                  class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                  :style="column.columnStyle"
                >
                  {{ column.name }}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="meta.total === 0">
                <td :colspan="columns.length">
                  <h3 class="p-8 text-lg font-bold text-center">
                    {{ $t('global.no_records_found') }}
                  </h3>
                </td>
              </tr>
              <template v-if="loading && rows.length === 0">
                <tr
                  v-for="index in 5"
                  :key="index"
                  :class="index % 2 === 1 ? 'bg-gray-100' : ''"
                >
                  <td
                    v-for="column in columns"
                    :key="column.name"
                    class="align-middle text-sm text-wrap"
                    :class="column.rowClass"
                  >
                    <div
                      class="d-flex px-3 py-1"
                      :class="column.rowWrapperClass"
                    >
                      <Skeletor
                        height="30"
                        :width="Math.random() * 20 + 80 + '%'"
                      />
                    </div>
                  </td>
                </tr>
              </template>
              <tr
                v-for="(row, index) in rows"
                :key="row.id"
                :class="index % 2 === 0 ? 'bg-gray-100' : ''"
              >
                <td
                  v-for="column in columns"
                  :key="column.name"
                  class="align-middle text-sm text-wrap"
                  :class="column.rowClass"
                >
                  <div class="d-flex px-3 py-1" :class="column.rowWrapperClass">
                    <component
                      v-for="component in column.components"
                      :key="component.name"
                      :is="component.name"
                      :options="component.options"
                      :record="row"
                      :prop="column.prop"
                      :resource="resource"
                      :index="index"
                      @submit="submitCell"
                    />
                    {{ column.renderer }}
                    <template v-if="column.renderer">
                      <div
                        v-html="
                          renderer(
                            column.renderer,
                            getPropertyValue(row, column.prop)
                          )
                        "
                      ></div>
                    </template>
                    <template v-if="!column.renderer && !column.components">
                      {{ getPropertyValue(row, column.prop) }}
                    </template>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import {
  Component,
  ComponentInternalInstance,
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
} from 'vue'
import SearchFilter from '../filters/SearchFilter.vue'
import SelectFilter from '../filters/SelectFilter.vue'
import moment from 'moment'
import {Skeletor} from 'vue-skeletor'
import 'vue-skeletor/dist/vue-skeletor.css'
import {useI18n} from 'vue-i18n'
import {useAppStore} from '@zrm/motor-nx-core/store/app';
import {storeToRefs} from 'pinia';
import Button from "@zrm/motor-nx-core/components/admin/cell/Button.vue";
import StatusIcon from "@zrm/motor-nx-core/components/admin/cell/StatusIcon.vue";
import EditButton from "@zrm/motor-nx-core/components/admin/cell/EditButton.vue";
import DeleteButton from "@zrm/motor-nx-core/components/admin/cell/DeleteButton.vue";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import SpinnerSmall from "~/packages/motor-nx-core/components/admin/partials/SpinnerSmall.vue";

export default defineComponent({
  components: {
    SpinnerSmall,
    SearchFilter,
    SelectFilter,
    Skeletor,
    Button,
    EditButton,
    DeleteButton,
    StatusIcon
  },
  props: {
    name: {
      type: String,
      default: 'Grid',
    },
    columns: {
      type: Array,
      default: ref([]),
    },
    rows: {
      type: Array,
      default: ref([]),
    },
    meta: {
      type: Object,
      default: () => {
        return {}
      },
    },
    resource: {
      type: String,
      default: '',
    },
    filters: {
      type: Array,
      default: ref([]),
    },
    loadComponents: {
      type: Array,
      default: () => [],
    },
    createLabel: {
      type: String,
      default: 'New record',
    },
    createRoute: {
      type: String,
      default: '',
    },
    headerActions: {
      type: Array,
      default: () => [],
    },
    withoutCreate: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const appStore = useAppStore()
    const {loading, updatingInBackground} = storeToRefs(appStore)

    const {t} = useI18n()
    const filterValues = reactive({per_page: 25, page: 1})

    const createRecordRoute = ref(useRouteParser().routeDottedToSlash(props.createRoute))

    const submitFilter = (data: { parameter: string; value: string }) => {
      // Reset page when filtering or searching
      filterValues.page = 1
      if (data.parameter) {
        filterValues[data.parameter] = data.value
      }
      ctx.emit('submit', filterValues)
    }

    const previousPage = () => {
      filterValues.page--
      ctx.emit('submit', filterValues)
    }

    const nextPage = () => {
      filterValues.page++
      ctx.emit('submit', filterValues)
    }

    const renderer = (
      renderer: {
        type: string
        path: string
        format: string
        property: string
      },
      value: any
    ): string => {
      switch (renderer.type) {
        case 'translation':
          return t(renderer.path + '.' + value)
        case 'boolean':
          return value ? t('global.yes') : t('global.no')
        case 'date':
          if (!value) {
            return
          }
          if (renderer.format) {
            return moment(value).format(renderer.format)
          }
          return moment(value).toString()
        case 'count':
          return value.length ? value.length.toString() : 'ß'
        case 'list':
          return value.map((object: any) => {
            return ' ' + object[renderer.property]
          })
        case 'currency':
          return value.toFixed(2) + ' ' + renderer.format
        default:
          return value
      }
    }
    const submitCell = (params: any) => {
      ctx.emit('submitCell', {
        componentParams: params,
        filterValues,
      })
    }

    const getPropertyValue = (object: any, property: string): string => {
      console.log(object, property)
      property = property.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '') // convert indexes to properties and strip leading dot
      let a = property.split('.')
      for (let i = 0, n = a.length; i < n; ++i) {
        var k = a[i]
        if (object && k in object) {
          object = object[k]
        } else {
          return
        }
      }
      return object
    }

    const instance = getCurrentInstance()

    onMounted(() => {
      const components = props.loadComponents as Array<{
        name: string
        object: Component
      }>

      if (components.length) {
        components.forEach((component) => {
          instance.components[component.name] = component.object
        })
      }
    })

    const firstPage = () => {
      filterValues.page = 1;
      ctx.emit('submit', filterValues)
    }
    const lastPage = () => {
      filterValues.page = props.meta.last_page;
      ctx.emit('submit', filterValues)
    }

    const pageOptions = computed(() => Array(props.meta.last_page).fill(1).map( (_, i) => i + 1 ))

    const goToPage = () => {
      ctx.emit('submit', filterValues)
    }

    return {
      filterValues,
      loading,
      nextPage,
      previousPage,
      submitFilter,
      renderer,
      submitCell,
      getPropertyValue,
      createRecordRoute,
      updatingInBackground,
      firstPage,
      lastPage,
      pageOptions,
      goToPage
    }
  },
})
</script>
