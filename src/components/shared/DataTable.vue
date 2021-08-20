<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataNumbers"
      :rows-per-page-items="rowsPerPageItems"
      :search="search"
      :custom-filter="customFilter"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.calories }}</td>
        <td>{{ props.item.fat }}</td>
        <td>{{ props.item.carbs }}</td>
        <td>{{ props.item.protein }}</td>
        <td>{{ props.item.iron }}</td>
      </template>
    </v-data-table>
  </div>
</template>
