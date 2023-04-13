<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { NInput, NPopconfirm, NScrollbar } from 'naive-ui';
  import { SvgIcon } from '@/components/common';
  import { useAppStore, useChatStore } from '@/store';
  import { useBasicLayout } from '@/hooks/useBasicLayout';
  import { debounce } from '@/utils/functions/debounce';

  const { isMobile } = useBasicLayout();

  const appStore = useAppStore();
  const chatStore = useChatStore();

  const inputValue = ref<string | undefined>(undefined);
  const isEdit = ref<boolean>(false);

  chatStore.getChatList().then(() => {
    if (chatStore.history.length) chatStore.setActive(chatStore.history[0].uuid);
  });

  const chatList = computed(() => chatStore.history);

  async function handleSelect(uuid: number, event?: MouseEvent) {
    event?.stopPropagation();
    if (chatStore.active === uuid) return;
    chatStore.setActive(uuid);
    isEdit.value = false;
    if (isMobile.value) appStore.setSiderCollapsed(true);
  }

  function handleEdit(event?: MouseEvent) {
    event?.stopPropagation();
    const target = chatList.value.find((item) => item.uuid === chatStore.active);
    if (target) {
      inputValue.value = target.name;
      isEdit.value = true;
    }
  }

  function handleDelete(id: number, event?: MouseEvent | TouchEvent) {
    event?.stopPropagation();
    chatStore.deleteHistory(id);
    if (isMobile.value) appStore.setSiderCollapsed(true);
  }

  const handleDeleteDebounce = debounce(handleDelete, 600);

  function handleSave(event?: MouseEvent) {
    event?.stopPropagation();
    if (chatStore.active && inputValue.value) {
      chatStore.updateHistory(chatStore.active, inputValue.value);
      isEdit.value = false;
    }
  }

  function handleEnter(event: KeyboardEvent) {
    event?.stopPropagation();
    if (event.key === 'Enter') {
      handleSave();
    }
  }

  function isActive(uuid: number) {
    return chatStore.active === uuid;
  }
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!chatList.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of chatList" :key="index">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="
              isActive(item.uuid) && [
                'border-[#2d8cf0]',
                'dark:bg-[#24272e]',
                'dark:border-[#ffffff]',
                'pr-14',
              ]
            "
            @click="handleSelect(item.uuid, $event)"
          >
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput
                v-if="isEdit && isActive(item.uuid)"
                v-model:value="inputValue"
                size="small"
                :maxlength="120"
                @keypress="handleEnter($event)"
              />
              <span v-else>{{ item.name }}</span>
            </div>
            <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
              <template v-if="isEdit">
                <button class="p-1" @click="handleSave($event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit($event)" />
                </button>
                <NPopconfirm
                  placement="bottom"
                  @positive-click="handleDeleteDebounce(item.uuid, $event)"
                >
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </button>
                  </template>
                  {{ $t('chat.deleteHistoryConfirm') }}
                </NPopconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>
