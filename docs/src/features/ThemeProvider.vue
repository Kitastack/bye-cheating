<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { NConfigProvider, darkTheme as darkThemeNaive, useThemeVars } from 'naive-ui'
import { useThemeStore } from '@/stores/theme.store'
import { storeToRefs } from 'pinia'
import { idID, dateIdID } from 'naive-ui'

const whiteColor = '#FFF'
const blackColor = '#000'
const primaryColor = '#89F336'
const primaryColorLight = '#97d964'
const primaryColorShade = '#71c92c'
const redColor = '#fc0303'
const themeStore = useThemeStore()
const theme = useThemeVars()
const { toggleTheme, isDarkTheme } = storeToRefs(themeStore)
const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function autoCheckMediaTheme(event: MediaQueryListEvent) {
  if (toggleTheme.value != 'device') return
  if (event.matches) {
    themeStore.isDarkTheme = true
    return
  }
  themeStore.isDarkTheme = false
}
function autoCheckToggleTheme() {
  if (toggleTheme.value == 'dark' || (toggleTheme.value == 'device' && darkMediaQuery.matches)) {
    themeStore.isDarkTheme = true
    return
  }
  themeStore.isDarkTheme = false
}

watch([toggleTheme, isDarkTheme], autoCheckToggleTheme, { immediate: true })
onMounted(() => {
  themeStore.loadCookieThemeAction()
  darkMediaQuery.addEventListener('change', autoCheckMediaTheme)
})
onBeforeUnmount(() => {
  darkMediaQuery.removeEventListener('change', autoCheckMediaTheme)
})
</script>

<template>
  <NConfigProvider
    :theme-overrides="{
      common: {
        primaryColor,
        primaryColorHover: primaryColorShade,
        primaryColorPressed: primaryColorLight,
        borderRadius: '15px',
      },
      Button: {
        textColorPrimary: blackColor,
        textColorPressedPrimary: blackColor,
        textColorHoverPrimary: blackColor,
        textColorFocusPrimary: blackColor,
        textColorDisabledPrimary: blackColor,
        textColorWarning: blackColor,
        textColorPressedWarning: blackColor,
        textColorHoverWarning: blackColor,
        textColorFocusWarning: blackColor,
        textColorDisabledWarning: blackColor,
      },
      Tabs: {
        tabColorSegment: primaryColor,
        tabTextColorActiveSegment: blackColor,
      },
      Form: {
        feedbackTextColor: redColor,
      },
    }"
    :theme="Boolean(isDarkTheme) ? darkThemeNaive : null"
  >
    <!-- :locale="idID" -->
    <!-- :date-locale="dateIdID" -->
    <slot />
  </NConfigProvider>
</template>
