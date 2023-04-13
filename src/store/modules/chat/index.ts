import { defineStore } from 'pinia';
import { createChat, getChatList, deleteChat, updateChat } from '@/api/chat/';

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => {
    return {
      active: 0,
      usingContext: true,
      history: [],
      chat: [{ uuid: 0, data: [] }],
    };
  },

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex((item) => item.uuid === state.active);
      if (index !== -1) return state.history[index];
      return null;
    },

    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid) return state.chat.find((item) => item.uuid === uuid)?.data ?? [];
        return state.chat.find((item) => item.uuid === state.active)?.data ?? [];
      };
    },
  },

  actions: {
    async getChatList() {
      const { list } = await getChatList();
      this.history = list.map((item) => {
        return {
          uuid: item.id,
          name: item.name,
        };
      });
    },

    async addHistory(name: string) {
      try {
        await createChat({ name });
        await this.getChatList();
        if (this.history.length) {
          this.active = this.history[0].uuid;
        }
      } catch (error) {}
    },

    async updateHistory(uuid: number, name: string) {
      try {
        await updateChat(uuid, name);
        await this.getChatList();
      } catch (error) {}
    },

    async deleteHistory(id: number) {
      try {
        await deleteChat(id);
        await this.getChatList();
        if (this.history.length) {
          this.active = this.history[0].uuid;
        }
      } catch (err) {}
    },

    setUsingContext(context: boolean) {
      this.usingContext = context;
      // this.recordState();
    },

    setActive(uuid: number) {
      this.active = uuid;
      // return await this.reloadRoute(uuid);
    },

    getChatByUuidAndIndex(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) return this.chat[0].data[index];
        return null;
      }
      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) return this.chat[chatIndex].data[index];
      return null;
    },

    addChatByUuid(uuid: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now();
          this.history.push({ uuid, name: chat.text });
          this.chat.push({ uuid, data: [chat] });
          this.active = uuid;
          // this.recordState();
        } else {
          this.chat[0].data.push(chat);
          if (this.history[0].name === 'New Chat') this.history[0].name = chat.text;
          // this.recordState();
        }
      }

      const index = this.chat.findIndex((item) => item.uuid === uuid);
      if (index !== -1) {
        this.chat[index].data.push(chat);
        if (this.history[index].name === 'New Chat') this.history[index].name = chat.text;
        // this.recordState();
      }
    },

    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat;
          // this.recordState();
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat;
        // this.recordState();
      }
    },

    updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat };
          // this.recordState();
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat };
        // this.recordState();
      }
    },

    deleteChatByUuid(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1);
          // this.recordState();
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.uuid === uuid);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1);
        // this.recordState();
      }
    },

    clearChatByUuid(uuid: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = [];
          // this.recordState();
        }
        return;
      }

      const index = this.chat.findIndex((item) => item.uuid === uuid);
      if (index !== -1) {
        this.chat[index].data = [];
        // this.recordState();
      }
    },

    // recordState() {
    //   setLocalState(this.$state);
    // },
  },
});
