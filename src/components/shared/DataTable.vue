<template>
  <v-data-table
    :headers="headers"
    :pagination.sync="pagination"
    :rows-per-page-items="pagination.rowsPerPageItems"
    :total-items="pagination.totalItems"
    :loading="loading"
    :items="items"
    class="elevation-1"
    >
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.name }}</td>
      <td class="text-xs-center">{{ props.item.calories }}</td>
      <td class="text-xs-center">{{ props.item.fat }}</td>
      <td class="text-xs-center">{{ props.item.carbs }}</td>
      <td class="text-xs-center">{{ props.item.protein }}</td>
      <td class="text-xs-center">{{ props.item.iron }}</td>
    </template>
  </v-data-table>
</template>
