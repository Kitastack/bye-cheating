<script setup lang="ts">
import {
  NA,
  NButton,
  NCard,
  NDrawer,
  NDrawerContent,
  NFlex,
  NH1,
  NSpace,
  NText,
  useMessage,
  useThemeVars,
  NTable,
} from 'naive-ui'
import { useBreakpoint } from '@/composables/breakpoint'
import { getCurrentInstance, onMounted } from 'vue'
import moment from 'moment'
import { IconArrowUpRight } from '@tabler/icons-vue'

const message = useMessage()
const theme = useThemeVars()
const breakpoint = useBreakpoint()
const utils = getCurrentInstance()?.proxy?.$utils
const emits = defineEmits<{
  (e: 'closed'): void
}>()
const props = withDefaults(
  defineProps<{
    data?: reportDataType
  }>(),
  {
    data: undefined,
  },
)
</script>
<template>
  <NDrawer
    :show="Boolean(props.data)"
    placement="bottom"
    height="80vh"
    @update:show="
      () => {
        emits('closed')
      }
    "
  >
    <NDrawerContent mask-closable closable>
      <template #header>
        <NText> Summary Report </NText>
      </template>
      <NCard
        :style="{
          background: theme.primaryColor,
        }"
      >
        <NSpace size="large" vertical justify="center">
          <NH1 style="color: black !important">
            <strong>{{ props.data?.title ?? '-' }}</strong></NH1
          >
          <NText style="color: black !important">
            {{ props.data?.description ?? '-' }}</NText
          ></NSpace
        >
      </NCard>
      <br />
      <NCard>
        <NFlex size="large">
          <video
            loop
            autoplay
            :width="breakpoint.mdAndDown ? '100%' : 'auto'"
            height="300px"
            style="background: black; border-radius: 15px"
          >
            <source :src="props.data?.recordUrl" type="video/mp4" />
            <!-- <a :href="props.data?.recordUrl">MP4</a> -->
          </video>
          <NSpace size="large" vertical justify="center">
            <NText
              ><strong>[Total Identifier/ID]: </strong>
              {{
                props.data?.calculatedClass
                  ? `${Object.keys(JSON.parse(props.data?.calculatedClass)).length} Person`
                  : '-'
              }}</NText
            >
            <NText
              ><strong>[Most Detected Classess]: </strong>
              {{
                props.data?.calculatedClass
                  ? [
                      ...new Set(
                        Object.values(JSON.parse(props.data?.calculatedClass))?.flatMap(
                          (itemClass: any) => itemClass?.mean ?? itemClass?.mode,
                        ),
                      ),
                    ].join(', ')
                  : '-'
              }}</NText
            >
            <NText style="text-transform: capitalize"
              ><strong>[Time Length/Duration]: </strong>
              {{
                props.data?.expiryTimeInMinutes
                  ? utils?.secondsToClock(
                      Math.round(
                        Math.abs(
                          new Date(props.data?.createdDate).getTime() -
                            Number(props.data.expiryTimeInMinutes * 1000),
                        ) / 1000,
                      ),
                    )
                  : '-'
              }}</NText
            >
            <NText style="text-transform: capitalize"
              ><strong>[Status]: </strong> {{ props.data?.status }}</NText
            >
            <NText
              ><strong>[Created Date]: </strong>
              {{ moment(props.data?.createdDate).format('DD MMMM YYYY, H:mm A') }}</NText
            >
            <NText
              ><strong>[Thumbnail URL]: </strong>
              <NA :href="props.data?.thumbnailUrl" target="_blank">{{
                props.data?.thumbnailUrl
              }}</NA></NText
            >
            <NText
              ><strong>[Record URL]: </strong>
              <NA :href="props.data?.recordUrl" target="_blank">{{
                props.data?.recordUrl
              }}</NA></NText
            >
            <NA
              :disabled="!props.data?.recordUrl"
              :href="`${props.data?.recordUrl}?response-content-disposition=attachment%3B%20filename%3Dvideo.mp4`"
              target="_blank"
              download
            >
              <NButton type="primary" icon-placement="right" :disabled="!props.data?.recordUrl"
                >Download Video <template #icon><IconArrowUpRight /></template
              ></NButton>
            </NA>
          </NSpace>
        </NFlex>
      </NCard>
      <br />
      <NSpace vertical>
        <NTable :single-line="true" size="small">
          <thead>
            <tr>
              <th>Identifier (ID)</th>
              <th>Class (Avg)</th>
              <th>Class (Most)</th>
            </tr>
          </thead>
          <tbody v-if="props.data?.calculatedClass">
            <tr
              v-for="(calculatedItem, calculatedItemIdx) in Object.entries(
                JSON.parse(props.data?.calculatedClass),
              ).map(([key, value]) => ({
                ...(value as any),
                id: key,
              }))"
              :key="calculatedItemIdx"
            >
              <td>{{ calculatedItem?.id }}</td>
              <td>{{ calculatedItem?.mean }}</td>
              <td>{{ calculatedItem?.mode }}</td>
            </tr>
          </tbody>
        </NTable>
      </NSpace>
    </NDrawerContent>
  </NDrawer>
</template>
