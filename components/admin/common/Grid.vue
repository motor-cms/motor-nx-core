<template>
  <div class="col-lg-12 col-md-12 mb-md-0 mb-4">
    <div class="card">
      <div class="card-header pb-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="row">
              <div class="col-md-6">
                <div class="d-flex flex-row align-items-center">
                  <h6 class="m-0" v-if="!loading">{{ name }}</h6>
                  <SpinnerSmall v-if="updatingInBackground" />
                </div>
              </div>

              <div class="col-md-6 text-end">
                <component
                  v-for="component in headerActions"
                  :key="component.name"
                  :is="component.name"
                />
                <NuxtLink v-if="hasBackButton && backRoute?.length > 0" :to="goBackRoute">
                  <button
                    class="btn btn-outline-primary border-radius-sm text-capitalize text-base mb-4 me-1"
                  >
                    {{ $t("global.back") }}
                  </button>
                </NuxtLink>
                <NuxtLink
                  v-if="hasTriggerTableActionButton && triggerTableActionButtonLabel"
                >
                  <a
                    @click="$emit('triggerTableAction')"
                    class="btn bg-gradient-primary border-radius-sm text-capitalize text-base mb-4 me-1"
                  >
                    {{ triggerTableActionButtonLabel }}
                  </a>
                </NuxtLink>
                <NuxtLink
                  v-if="!withoutCreate && createRecordRoute"
                  :to="createRecordRoute"
                >
                  <a
                    class="btn bg-gradient-primary border-radius-sm text-capitalize text-base mb-4 me-1"
                  >
                    {{ createLabel }}
                  </a>
                </NuxtLink>
              </div>
            </div>
            <div class="row align-items-center">
              <component
                v-for="f in filters"
                :key="f.name"
                :is="f.name"
                :options="f.options"
                :name="f.name"
                :defaultValue="$route.query[f.options.parameter]"
                @submit="submitFilter"
              ></component>
              <div class="col" v-if="hasGridActions && selectedItemsLength">
                <div class="d-flex">
                  <select
                    class="form-control max-width-100 d-inline me-2"
                    name="per-page"
                    v-model="gridAction"
                  >
                    <option v-for="action in gridActions" :value="action">
                      {{ action.label }}
                    </option>
                  </select>
                  <button
                    type="button"
                    @click="processGridAction"
                    class="accordion-button"
                  >
                    <fa icon="play"></fa>
                  </button>
                </div>
              </div>
              <div class="col" v-if="!loading">
                <ul class="pagination float-end m-0">
                  <li class="page-item disabled" v-if="meta.current_page === 1">
                    <a class="page-link text-black">
                      <fa icon="chevron-left" />
                    </a>
                  </li>

                  <li class="page-item" @click="firstPage" v-if="meta.current_page > 1">
                    <a class="page-link text-black">
                      <fa icon="chevron-left" />
                      <fa icon="chevron-left" />
                    </a>
                  </li>
                  <li
                    class="page-item"
                    @click="previousPage"
                    v-if="meta.current_page > 1"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-left" />
                    </a>
                  </li>
                  <li>
                    <select
                      class="form-control"
                      name="per-page"
                      @change="goToPage"
                      v-model="filterValues.page"
                    >
                      <option v-for="option in pageOptions" :value="option">
                        Seite {{ option }} von
                        {{ meta.last_page }}
                      </option>
                    </select>
                  </li>
                  <li
                    class="page-item"
                    @click="nextPage()"
                    v-if="meta.current_page < meta.last_page"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right" />
                    </a>
                  </li>

                  <li
                    class="page-item"
                    @click="lastPage()"
                    v-if="meta.current_page < meta.last_page"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right" />
                      <fa icon="chevron-right" />
                    </a>
                  </li>

                  <li
                    class="page-item disabled"
                    v-if="meta.current_page === meta.last_page"
                  >
                    <a class="page-link text-black">
                      <fa icon="chevron-right" />
                    </a>
                  </li>
                </ul>
                <select
                  class="form-control max-width-100 d-inline float-end me-2"
                  name="per-page"
                  @change="submitFilter"
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
                <th v-if="hasGridActions">
                  <div style="position: relative">
                    <div
                      class="form-check d-flex align-items-center"
                      @click.prevent="selectPopoverActive = !selectPopoverActive"
                    >
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="allSelected || pageSelected"
                      />
                      <p
                        v-if="!allSelected"
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                      >
                        {{ selectedItemsLength }} {{ t("global.selected") }}
                      </p>
                      <p
                        v-else
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                      >
                        {{ meta.total }} {{ t("global.selected") }}
                      </p>
                    </div>
                    <Popover v-if="selectPopoverActive">
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :checked="pageSelected"
                          @input="setPageSelected"
                        />
                        <p
                          class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                        >
                          {{ t("global.select_this_page") }}
                        </p>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :checked="allSelected"
                          @input="setAllSelected"
                        />
                        <p
                          class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                        >
                          {{ t("global.select_all_pages") }}
                        </p>
                      </div>
                      <div
                        class="form-check"
                        @click="deselect"
                        v-if="selectedItemsLength"
                      >
                        <fa icon="xmark"></fa>
                        <p
                          class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 m-0 mx-1"
                        >
                          {{ t("global.unselect_all_pages") }}
                        </p>
                      </div>
                    </Popover>
                  </div>
                </th>
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
                    {{ $t("global.no_records_found") }}
                  </h3>
                </td>
              </tr>
              <template
                v-if="
                  (loading && rows.length === 0) ||
                  (updatingInBackground && rows.length === 0)
                "
              >
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
                    <div class="d-flex px-3 py-1" :class="column.rowWrapperClass">
                      <Skeletor height="30" :width="Math.random() * 20 + 80 + '%'" />
                    </div>
                  </td>
                </tr>
              </template>
              <tr
                v-for="(row, index) in rows"
                :key="row.id"
                :class="index % 2 === 0 ? 'bg-gray-100' : ''"
              >
                <td class="align-items-center text-sm" v-if="hasGridActions">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :disabled="allSelected"
                      :name="name"
                      :value="name"
                      :checked="gridStore.isSelected(row) || allSelected"
                      @input="gridStore.selectItem(row)"
                    />
                  </div>
                </td>
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
                    <template v-if="column.renderer">
                      <fa
                        v-if="
                          column.renderer.type === 'boolIcon' &&
                          getPropertyValue(row, column.prop) == true
                        "
                        class="text-success"
                        :icon="column.renderer.trueIcon"
                      ></fa>
                      <fa
                        v-else-if="
                          column.renderer.type === 'boolIcon' &&
                          getPropertyValue(row, column.prop) == false
                        "
                        class="text-danger"
                        :icon="column.renderer.falseIcon"
                      ></fa>
                      <div
                        v-else-if="column.renderer.type === 'linkLabelId'"
                        v-html="
                          renderer(column.renderer, {
                            label: getPropertyValue(row, column.label),
                            id: getPropertyValue(row, column.id),
                          })
                        "
                      />
                      <div
                        v-else
                        v-html="
                          renderer(column.renderer, getPropertyValue(row, column.prop))
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
import type {
  Component
} from 'vue'
import {
  computed,
  defineComponent,
  getCurrentInstance,
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
import {storeToRefs} from 'pinia';
import Button from "@zrm/motor-nx-core/components/admin/cell/Button.vue";
import StatusIcon from "@zrm/motor-nx-core/components/admin/cell/StatusIcon.vue";
import EditButton from "@zrm/motor-nx-core/components/admin/cell/EditButton.vue";
import ActionButton from "@zrm/motor-nx-core/components/admin/cell/ActionButton.vue";
import CustomActionButton from "@zrm/motor-nx-core/components/admin/cell/CustomActionButton.vue";
import DeleteButton from "@zrm/motor-nx-core/components/admin/cell/DeleteButton.vue";
import CellTree from "@zrm/motor-nx-core/components/admin/cell/Tree.vue";
import PageLink from "@zrm/motor-nx-builder/components/admin/cell/PageLink.vue";
import useRouteParser from "@zrm/motor-nx-core/composables/route/parse";
import SpinnerSmall from "@zrm/motor-nx-core/components/admin/partials/SpinnerSmall.vue";
import CheckboxField from "@zrm/motor-nx-core/components/forms/CheckboxField.vue";
import Popover from "@zrm/motor-nx-core/components/admin/cell/Popover.vue";
import {useFilterStore} from "@zrm/motor-nx-core/stores/filter";

interface GridAction {
  label: string,
  action: string,
  func: () => Promise<any>
}

export default defineComponent({
  components: {
    Popover,
    CheckboxField,
    SpinnerSmall,
    SearchFilter,
    SelectFilter,
    Skeletor,
    Button,
    EditButton,
    ActionButton,
    CustomActionButton,
    DeleteButton,
    StatusIcon,
    CellTree,
    PageLink
  },
  props: {
    name: {
      type: String,
      default: 'Grid',
    },
    columns: {
      type: Array<Record<string, any>>,
      default: ref([]),
    },
    rows: {
      type: Array<Record<string, any>>,
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
    },
    hasBackButton: {
      type: Boolean,
      default: false,
    },
    backRoute: {
      type: String,
      default: '',
    },
    withSelection: {
      type: Boolean,
      default: true,
    },
    gridActions: {
      type: Array<GridAction>,
      default: () => [],
    },
    hasTriggerTableActionButton:{
      type: Boolean,
      default: false
    },
    triggerTableActionButtonLabel:{
      type: String,
      default: ''
    }
  },
  emits: ['submit', 'submitCell', 'gridActionProcessed', 'triggerTableAction'],
  setup(props, ctx) {
    const appStore = useAppStore()
    const {loading, updatingInBackground} = storeToRefs(appStore)
    const gridStore = useGridStore();
    gridStore.init(props.meta);
    const router = useRouter();
    const route = useRoute();
    const filterStore = useFilterStore();

    const {selectedItemsLength, selectedPageMap, pageSelected, allSelected} = storeToRefs(gridStore);
    const {t} = useI18n()
    const filterValues = reactive({per_page: route.query.per_page ? route.query.per_page : 25, page: route.query.page ? route.query.page : 1})

    const createRecordRoute = ref(useRouteParser().routeDottedToSlash(props.createRoute))

    const goBackRoute = ref(useRouteParser().routeDottedToSlash(props.backRoute))

    Object.assign(filterValues, filterStore.getFilterValuesForGrid(route.name));

    const submitFilter = (data: { parameter: string; value: string }) => {

      if (data instanceof Event) {
        data = ref({
          parameter: 'per-page',
          value: filterValues.perPage
        });
      }
      // Add search filter
      filterValues[data.parameter] = data.value.value;

      // Reset page when filtering or searching
      filterValues.page = 1
      if (data.parameter) {
        filterValues[data.parameter] = data.value
      }

      // Save current filter values
      filterStore.setFilterValuesForGrid(route.name, filterValues);

      router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
      ctx.emit('submit', filterValues)
    }

    const previousPage = () => {
      filterValues.page--
      filterStore.setFilterValuesForGrid(route.name, filterValues);
      router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
      ctx.emit('submit', filterValues)
    }

    const nextPage = () => {
      filterValues.page++
      filterStore.setFilterValuesForGrid(route.name, filterValues);
      router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
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
          return value ? t('global.yes') : t('global.no');
        case 'array':
          if (!value.length) return '-'
          return value.map((object: Record<string, any>) => {
            if (object.name.length) {
              return ' ' + object.name
            }
            return ' ' + object.label
          })
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
        case 'links':
          if (value.length) {
            return value.map((object: Record<string, any>) => {
              return '<a href="' + renderer.route.replace('{id}', object.id).replace('{root_node}', object.root_node) + '">' + object.full_slug + '</a></br>'
            }).join('')
          } else
          {
            // Return fontawesome icon
            return '-'
          }
        case 'linkLabelId':
          if (value.label) {
            return '<a href="' + renderer.route.replace('{id}', value.id) + '">' + value.label + '</a>'
          } else
          {
            return '-'
          }
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
      property = property.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '') // convert indexes to properties and strip leading dot
      let a = property.split('.')
      for (let i = 0, n = a.length; i < n; ++i) {
        var k = a[i]
        if (object && k in object) {
          object = object[k]
        } else {
          return;
        }
      }
      return object
    }

    const instance = getCurrentInstance()

    // GridActions
    const hasGridActions = computed(() => props.gridActions.length)
    const gridAction = ref<GridAction>(null);

    const firstPage = () => {
      filterValues.page = 1;
      filterStore.setFilterValuesForGrid(route.name, filterValues);
      router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
      ctx.emit('submit', filterValues)
    }
    const lastPage = () => {
      filterValues.page = props.meta.last_page;
      filterStore.setFilterValuesForGrid(route.name, filterValues);
      router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
      ctx.emit('submit', filterValues)
    }

    const pageOptions = computed(() => Array(props.meta.last_page).fill(1).map((_, i) => i + 1))

    const goToPage = () => {
      filterStore.setFilterValuesForGrid(route.name, filterValues);
      router.replace({query: filterStore.getFilterValuesForGrid(route.name)})
      ctx.emit('submit', filterValues)
    }

    const selectPopoverActive = ref(false);
    const setPageSelected = () => {
      if (pageSelected.value) {
        props.rows.forEach(row => {
          gridStore.removeSelectedItem(row);
        })
      } else {
        props.rows.forEach(row => {
          if (!gridStore.isSelected(row)) {
            gridStore.addSelectedItem(row);
          }
        })
      }
      selectedPageMap.value.set(props.meta.current_page, !selectedPageMap.value.get(props.meta.current_page));
      selectPopoverActive.value = !selectPopoverActive.value;
    }

    const setAllSelected = () => {
      if (allSelected.value) {
        gridStore.setSelectedItems([]);
      } else {
        gridStore.setSelectedItems(JSON.parse(JSON.stringify(props.rows)))
      }
      allSelected.value = !allSelected.value;
      selectPopoverActive.value = !selectPopoverActive.value;
    }

    const deselect = () => {
      gridStore.deselectAll();
      selectPopoverActive.value = !selectPopoverActive.value;
    }

    watchEffect(() => {
      gridStore.init(props.meta);
    })

    const {$toast} = useNuxtApp();
    const processGridAction = async () => {
      try {
        appStore.isLoading(true)
        await gridAction.value.func();
        $toast.success(t('global.action_processed'))
      } catch (e) {
        console.error("Error occured while processing grid action: " + e)
        $toast.error(t('global.error_occurred'))
      } finally {
        appStore.isLoading(false)
        ctx.emit('gridActionProcessed')
      }
    }

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
      gridAction.value = hasGridActions.value ? props.gridActions[0] : null;
    })

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
      goToPage,
      goBackRoute,
      selectedItemsLength,
      setAllSelected,
      setPageSelected,
      allSelected,
      pageSelected,
      gridStore,
      selectPopoverActive,
      hasGridActions,
      gridAction,
      deselect,
      processGridAction,
      t
    }
  },
})
</script>

<style scoped lang="scss">
.pagination {
  gap: 8px;

  .page-item .page-link,
  .page-item span {
    margin: 0;
  }
}
</style>
