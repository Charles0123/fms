<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" class="app-drawer" app permanent>
      <div class="brand-block">
        <div class="brand-mark">F</div>
        <div><div class="brand-name">FMS</div><div class="brand-caption">FINANCE DESK</div></div>
      </div>
      <div class="menu-label">工作區</div>
      <v-list class="navigation-list" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :title="item.title"
          :prepend-icon="item.icon"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="app-bar" app>
      <v-app-bar-title><span class="app-bar-kicker">FINANCE MANAGEMENT</span><span class="app-bar-title">財務管理系統</span></v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(true)

const menuItems = [
  { title: '儀表板', path: '/', icon: 'mdi-home' },
  { title: '收支明細', path: '/transactions', icon: 'mdi-format-list-bulleted' },
  { title: '分類設定', path: '/categories', icon: 'mdi-cog' },
]
</script>

<style scoped>
.app-drawer { background: #151d24 !important; border-right: 1px solid rgba(194, 208, 219, 0.1) !important; color: #d9e2e8; }
.brand-block { align-items: center; display: flex; gap: 11px; padding: 25px 22px 29px; }
.brand-mark { align-items: center; background: #3e806c; border-radius: 10px; color: #e7f4ef; display: flex; font-size: 1.05rem; font-weight: 700; height: 36px; justify-content: center; width: 36px; }
.brand-name { color: #e1eaee; font-size: 1.1rem; font-weight: 650; letter-spacing: 0.04em; line-height: 1.1; }
.brand-caption, .menu-label, .app-bar-kicker { color: #82939e; font-size: 0.62rem; letter-spacing: 0.13em; }
.menu-label { padding: 0 22px 9px; }
.navigation-list { padding: 0 11px; }
.navigation-list :deep(.v-list-item) { border-radius: 9px; color: #9eacb5; margin-bottom: 5px; min-height: 45px; transition: background 0.2s, color 0.2s; }
.navigation-list :deep(.v-list-item:hover) { background: rgba(127, 199, 189, 0.08); color: #d9e2e8; }
.navigation-list :deep(.v-list-item--active) { background: rgba(96, 168, 157, 0.18); color: #a6ddd3; }
.navigation-list :deep(.v-list-item--active::before) { background: #7fc7bd; opacity: 1; width: 3px; }
.navigation-list :deep(.v-list-item__prepend > .v-icon) { color: currentColor; opacity: 0.9; }
.app-bar { background: #171f27 !important; border-bottom: 1px solid rgba(194, 208, 219, 0.1) !important; color: #d9e2e8 !important; }
.app-bar :deep(.v-toolbar__content) { padding-left: 28px; }
.app-bar :deep(.v-toolbar-title__placeholder) { align-items: flex-start; display: flex; flex-direction: column; gap: 2px; }
.app-bar-kicker { color: #7fc7bd; font-size: 0.58rem; }
.app-bar-title { color: #d9e2e8; font-size: 1rem; font-weight: 550; }
:deep(.v-main) { background: #11171d; }
</style>
