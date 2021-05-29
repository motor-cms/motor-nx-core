<template>
  <div>
    <AdminExampleInfoChart />
    <AdminExampleInfoCard1 />
    <AdminExampleInfoCard2 />
    <div class="row my-4">
      <AdminExampleTable />
      <AdminExampleOverview />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AdminExampleInfoChart from 'motor-core/components/admin/ExampleInfoChart.vue'
import AdminExampleInfoCard1 from 'motor-core/components/admin/ExampleInfoCard1.vue'
import AdminExampleInfoCard2 from 'motor-core/components/admin/ExampleInfoCard2.vue'
import AdminExampleTable from 'motor-core/components/admin/ExampleTable.vue'
import AdminExampleOverview from 'motor-core/components/admin/ExampleOverview.vue'

export default defineComponent({
  name: 'admin-dashboard',
  components: {
    AdminExampleInfoChart,
    AdminExampleInfoCard1,
    AdminExampleInfoCard2,
    AdminExampleTable,
    AdminExampleOverview,
  },
})
</script>
