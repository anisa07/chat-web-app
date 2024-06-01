<script lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import { io } from 'socket.io-client'
// import {
//   getUser,
//   findUsers,
//   submitMessage,
//   loadUserConversations,
//   loadConversationMessages
// } from './services/userService'
// import { useChatStore } from './stores/chat'
import { RouterLink, RouterView } from 'vue-router'

// const { register } = useChatStore()

export default {
  data() {
    return {
      message: '',
      messages: [
        // {
        //   user1: '',
        //   user2: '',
        //   message: ''
        // }
      ],
      socket: null,
      chats: [],
      users: [
        // { name: 'Test1' }
      ],
      owner: {
        name: '',
        userId: ''
      },
      otherUser: { name: '', userId: '' },
      currentConversation: { conversationId: '', participants: [] },
      search: ''
    }
  },
  mounted() {
    // if (!this.socket) {
    //   this.socket = io('http://localhost:3000', {
    //     query: { userId: 'c21ae8f6-76dd-4cbb-9ff7-9e96f48f5aa9' }
    //   })
    // }
    // this.socket.id = 'c21ae8f6-76dd-4cbb-9ff7-9e96f48f5aa9'
    // this.socket = new WebSocket('ws://localhost:3000')
    // this.socket.onmessage = (event) => {
    //   console.log(event.data)
    //   // this.messages.push(event.data)
    // }
    // this.socket.on('message', (data) => {
    //   console.log('Received message:', data)
    // })
    // this.socket.on('connect', () => {
    //   // console.log('Successfully connected to the server')
    //   // console.log('Client socket ID is', this.socket.id)
    // })
    // this.socket.on('message', (message) => {
    // const msgAsObject = JSON.parse(message)
    // console.log(
    //   'Message received from server:',
    //   msgAsObject,
    //   msgAsObject.conversationId,
    //   this.currentConversation.conversationId
    // )
    // if (msgAsObject.conversationId == this.currentConversation.conversationId) {
    //   this.messages = [
    //     ...this.messages,
    // {
    //   messageId: msgAsObject.messageId,
    //   message: msgAsObject.message,
    //   createdAt: msgAsObject.createdAt,
    //   messageId: msgAsObject.messageId,
    //   author: {
    //     name: msgAsObject.from.name,
    //     userId: msgAsObject.from.userId
    //   }
    // }
    //   ]
    //   return
    // }
    // const chatIndex = this.chats.findIndex(
    //   (chat) => chat.conversationId === msgAsObject.conversationId
    // )
    // // TODO think how to notify user when new cht comes or chat has update
    // if (chatIndex === -1) {
    //   this.chats = [
    //     ...this.chats,
    //     {
    //       conversationId: msgAsObject.conversationId,
    //       participants: [
    //         {
    //           name: msgAsObject.from.name,
    //           userId: msgAsObject.from.userId
    //         }
    //       ],
    //       newMessage: true
    //     }
    //   ]
    // } else {
    //   this.chats[chatIndex] = { ...this.chats[chatIndex], newMessage: true }
    // }
    // })
    // this.socket.on('disconnect', () => {
    //   // console.log('Socket is disconnected', this.socket.id)
    // })
    // this.socket.on('connect_error', () => {
    //   // setTimeout(() => {
    //   //   socket.connect();
    //   // }, 1000);
    //   // console.log('error with connection ....')
    // })
  },
  methods: {
    // test: () => {
    //   register({
    //     email: 'test@test.com',
    //     password: 'test',
    //     name: 'test'
    //   })
    // },
    // getUser(userId: string) {
    //   getUser(userId).then((response) => {
    //     this.owner = response.data
    //   })
    // },
    // searchUsers() {
    //   findUsers(this.search).then((response) => {
    //     this.users = response.data ?? []
    //   })
    // },
    // async selectUserToChat(userId: string) {
    //   const conversation = this.chats.find(
    //     (chat) => chat.participants.length === 1 && chat.participants[0].userId === userId
    //   )
    //   if (conversation) {
    //     this.currentConversation = conversation
    //   }
    //   if (!conversation) {
    //     const user = this.users.find((user) => user.userId === userId)
    //     if (user) {
    //       this.currentConversation = { conversationId: '', participants: [user] }
    //     }
    //   }
    //   this.getConversationHistory(conversation.conversationId)
    //   this.search = ''
    //   this.users = []
    // },
    // selectChat(conversationId: string) {
    //   const conversationIndex = this.chats.findIndex(
    //     (chat) => chat.conversationId === conversationId
    //   )
    //   if (conversationIndex > -1) {
    //     this.chats[conversationIndex] = { ...this.chats[conversationIndex], newMessage: false }
    //     this.currentConversation = this.chats[conversationIndex]
    //     this.getConversationHistory(this.currentConversation.conversationId)
    //   }
    // },
    // sendMessage(message: string) {
    //   console.log('this.currentConversation', this.currentConversation)
    //   submitMessage({
    //     fromId: this.owner.userId,
    //     toIds: this.currentConversation.participants.map((p) => p.userId),
    //     message,
    //     conversationId: this.currentConversation.conversationId ?? ''
    //   }).then(() => {
    //     this.message = ''
    //   })
    //   // this.socket.emit("ping", );
    //   // createItem(label) {
    //   // const item = {
    //   //   id: Date.now(), // temporary ID for v-for key
    //   //   label
    //   // };
    //   // this.items.push(item);
    //   // if (this.socket) {
    //   // this.socket.emit(
    //   //   'message',
    //   //   { message: this.message, userId1: this.owner.userId, userId2: this.otherUser.userId },
    //   //   () => {
    //   //     this.message = ''
    //   //     // // item.id = res.data;
    //   //     // if (message.trim() !== '') {
    //   //     //   this.socket.send(
    //   //     //     JSON.stringify({
    //   // userId1: this.owner.userId,
    //   // userId2: this.otherUser.userId,
    //   // message
    //   //     //     })
    //   //     //   )
    //   //     //   this.message = ''
    //   //     // }
    //   //   }
    //   // )
    //   // }
    //   // },
    //   //   if (this.message.trim() !== '') {
    //   //     this.socket.send(this.message)
    //   //     this.message = ''
    //   //   }
    // },
    // getUserConversations(userId: string) {
    //   loadUserConversations(userId).then((response) => {
    //     console.log('loadUserConversations', response.data)
    //     this.chats = response.data
    //   })
    // },
    // getConversationHistory(conversationId: string) {
    //   conversationId &&
    //     loadConversationMessages(conversationId).then((response) => {
    //       console.log('loadHistory', response.data)
    //       this.messages = response.data.sort(function (a, b) {
    //         // Turn your strings into dates, and then subtract them
    //         // to get a value that is either negative, positive, or zero.
    //         return new Date(a.createdAt) - new Date(b.createdAt)
    //       })
    //     })
    // }
  },

  created() {
    // TODO get userId from logged in account
    // this.getUser('c21ae8f6-76dd-4cbb-9ff7-9e96f48f5aa9')
    // this.getUserConversations('c21ae8f6-76dd-4cbb-9ff7-9e96f48f5aa9')
  },
  beforeDestroy() {
    // if (this.socket) {
    //   this.socket.disconnect()
    // }
  }
}
</script>

<template>
  <main class="h-full">
    <RouterView />
  </main>

  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
  <!-- <button v-on:click="sendMessage('test')">Send</button> -->

  <!-- <div class="container">
    <div class="panel">
      <div class="search-block">
        <input type="text" placeholder="Search a user..." class="search" v-model="search" />
        <button class="search" v-on:click="searchUsers">Search</button>
      </div>
      <ul class="users">
        <li v-for="user in users" v-on:click="selectUserToChat(user.userId)">{{ user.name }}</li>
      </ul>-->

  <!-- List of users -->
  <!-- <p v-if="chats.length > 0">Existing chats</p>
      <ul class="chats">
        <li
          v-for="chat in chats"
          v-on:click="selectChat(chat.conversationId)"
          v-bind:style="[chat.newMessage ? { fontWeight: 'bold' } : { fontWeight: 'normal' }]"
        >
          {{
            chat.participants
              // .filter((participant) => participant.userId !== owner.userId)
              .map((participant) => participant.name)
              .join(' ')
          }}
        </li>
      </ul>
    </div>
    <div class="chat">
      <div class="">
        To
        {{
          currentConversation.participants
            // .filter((participant) => participant.userId !== owner.userId)
            .map((participant) => participant.name)
            .join(' ') ?? ''
        }}
      </div> -->
  <!-- History prev chat -->
  <!-- <div class="messages">
        <ul>
          <li v-for="msg in messages">
            <div>{{ msg.author.name }} - {{ new Date(msg.createdAt).toLocaleDateString() }}</div>
            <div>
              {{ msg.message }}
            </div>
          </li>
        </ul>
      </div> -->
  <!-- Our user name and status -->
  <!-- <div class="owner">From {{ owner.name }}</div> -->
  <!-- Typing area -->
  <!-- <div class="message">
        <textarea class="message-text" rows="5" v-model="message" />
        <button
          class="send"
          :disabled="currentConversation.participants.length === 0"
          v-on:click="sendMessage(message)"
        >
          Send
        </button>
      </div> -->
  <!-- </div> -->
  <!-- </div> -->
</template>

<style scoped>
.search-block {
  display: flex;
}

.search-block input {
  flex: 1;
}
.search {
  padding: 0.5rem;
}
.container {
  display: flex;
  height: inherit;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-right: 0.5rem;
  border-right: 1px solid gray;
}

.chat {
  padding: 1rem;
  flex: 3;
  display: flex;
  flex-direction: column;
}

.users {
  margin-bottom: 2.5rem;
}

.message {
  /* align-self: flex-end; */
  display: flex;
  flex-direction: column;
}

.message-text {
  display: block;
  resize: none;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
.send {
  padding: 0.5rem;
  width: 100px;
}

.search {
  padding: 0.5rem;
}

.messages {
  flex: 2;
}

.messages {
  border: 1px solid gray;
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  max-height: 70%;
  overflow: scroll;
}

ul li {
  cursor: pointer;
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } */
/* } */
</style>
