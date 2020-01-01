<template>
  <v-app>
    <v-app-bar app dense>
      <v-app-bar-nav-icon>
        <v-btn icon>
          <v-icon>mdi-cookie</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>

      <v-toolbar-title>Cookie Cook</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-data-table
          :headers="headers"
          :items="cookies"
          :items-per-page="5"
          class="elevation-1 cookies-table"
        >
          <template v-slot:item.hostOnly="{ item }">
            <v-checkbox v-model="item.hostOnly"></v-checkbox>
          </template>
          <template v-slot:item.secure="{ item }">
            <v-checkbox v-model="item.secure"></v-checkbox>
          </template>
          <template v-slot:item.httpOnly="{ item }">
            <v-checkbox v-model="item.httpOnly"></v-checkbox>
          </template>
          <template v-slot:item.session="{ item }">
            <v-checkbox v-model="item.session"></v-checkbox>
          </template>
          <template v-slot:item.value="{ item }">
            <v-text-field hide-details v-model="item.value"></v-text-field>
          </template>
        </v-data-table>
      </v-container>
    </v-content>

    <v-footer app>
      <v-btn icon>
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Value', value: 'value', sortable: false },
        { text: 'Domain', value: 'domain', sortable: false },
        { text: 'HostOnly', value: 'hostOnly', sortable: false },
        { text: 'HttpOnly', value: 'httpOnly', sortable: false },
        { text: 'Session', value: 'session', sortable: false },
        { text: 'Secure', value: 'secure', sortable: false }

      ],
      currentTabID: null,
      currentTabURL: '',
      currentTabCookiesStoreId: null,
      cookies: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    searchCookies () {
      let that = this
      chrome.cookies.getAllCookieStores(function (cookieStores) {
        for (let x = 0; x < cookieStores.length; x++) {
          if (cookieStores[x].tabIds.indexOf(that.currentTabID) !== -1) {
            that.currentTabCookiesStoreId = cookieStores[x].id
            break
          }
        }
        chrome.cookies.getAll({ storeId: that.currentTabCookiesStoreId, url: that.currentTabURL },
          cookies => {
            that.cookies = cookies
          })
      })
    },
    init () {
      let that = this
      chrome.tabs.query(
        {
          active: true,
          lastFocusedWindow: true
        },
        function (tabs) {
          that.currentTabURL = tabs[0].url
          that.currentTabID = tabs[0].id
          that.searchCookies()
        }
      )
    }
  },
  name: 'App'
}
</script>

<style>
html {
  width: 780px;
  height: 600px;
}

.cookies-table {
  table-layout: fixed;
}
</style>
