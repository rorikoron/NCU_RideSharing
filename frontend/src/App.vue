<script setup lang="ts">
import Toolbar from "./layouts/ToolBar.vue";
</script>

<template>
  <q-layout class="row">
    <Toolbar class="col-2" />
    <q-page-container class="col-grow">
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
