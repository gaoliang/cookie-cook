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
      <v-text-field label="URL" placeholder="请输入URL" solo dense hide-details v-model="inputURL"></v-text-field>
      <v-btn icon @click="currentFilterURL=inputURL; searchCookies()">
        <v-icon>mdi-filter</v-icon>
      </v-btn>

      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>-->

      <!-- -->
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-expansion-panels>
          <v-expansion-panel v-for="(cookie,i) in cookies" :key="i">
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="4" class="text--secondary">{{ cookie.domain }}{{cookie.path}}</v-col>
                <v-col cols="8">{{cookie.name}}</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row no-gutters>
                <v-col cols="12" class="text--secondary">
                  <v-textarea label="Name" v-model="cookie.name" hide-details auto-grow rows="1"></v-textarea>
                </v-col>
                <v-col cols="12" class="text--secondary">
                  <v-textarea label="Value" v-model="cookie.value" hide-details auto-grow rows="1"></v-textarea>
                </v-col>
                <v-col cols="6" class="text--secondary">
                  <v-textarea label="Path" v-model="cookie.path" hide-details auto-grow rows="1"></v-textarea>
                </v-col>
                <v-col cols="6" class="text--secondary">
                  <v-select :items="sameSiteItems" label="SameSite" v-model="cookie.sameSite"></v-select>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="cookie.hostOnly" label="HostOnly"></v-switch>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="cookie.httpOnly" label="HttpOnly"></v-switch>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="cookie.secure" label="Secure"></v-switch>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="cookie.session" label="Session"></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-content>

    <v-footer app>
      <v-btn icon @click="openIndex">
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-select :items="copyStyles" v-model="copyStyle" hide-details dense style="max-width: 200px"></v-select>
      <v-btn icon @click="copy">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
      <v-btn icon color="error" @click="deleteCookies">
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
    </v-footer>
    <v-snackbar v-model="copySucessMessage">Copy Success</v-snackbar>
  </v-app>
</template>

<script>
import { cookiesToText } from '@/utils.js'
export default {
  data () {
    return {
      inputURL: '',
      currentFilterURL: '',
      copySucessMessage: false,
      copyStyle: 'json',
      copyStyles: [
        { value: 'json', text: 'JSON or Python Dict' },
        { value: 'http', text: 'Http Header Value' },
        { value: 'curl', text: 'Curl Template' }
      ],
      currentTabID: null,
      currentTabURL: '',
      currentTabCookiesStoreId: null,
      cookies: [],
      sameSiteItems: ['strict', 'lax', 'none', 'no_restriction', 'unspecified']
    }
  },
  mounted () {
    if (
      window.matchMedia('(prefers-color-scheme: light)').matches ||
      window.matchMedia('(prefers-color-scheme: no-preference)').matches
    ) {
      this.$vuetify.theme.dark = false
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.$vuetify.theme.dark = true
    }
    this.init()
  },
  methods: {
    copy () {
      let text = cookiesToText(this.copyStyle, this.cookies)
      let that = this
      console.log(text)
      this.$copyText(text).then(
        function (e) {
          that.copySucessMessage = true
          console.log(e)
        },
        function (e) {
          alert('Can not copy')
          console.log(e)
        }
      )
    },
    openIndex () {
      chrome.tabs.create({
        url: 'https://www.github.com/gaoliang/cookie-cook'
      })
    },
    searchCookies () {
      let that = this
      chrome.cookies.getAllCookieStores(function (cookieStores) {
        if (this.currentTabURL !== this.currentFilterURL) {
          for (let x = 0; x < cookieStores.length; x++) {
            if (cookieStores[x].tabIds.indexOf(that.currentTabID) !== -1) {
              that.currentTabCookiesStoreId = cookieStores[x].id
              break
            }
          }
          chrome.cookies.getAll(
            { storeId: that.currentTabCookiesStoreId, url: that.currentTabURL },
            cookies => {
              that.cookies = cookies
            }
          )
        } else {
          chrome.cookies.getAll({ url: that.currentFilterURL }, cookies => {
            that.cookies = cookies
          })
        }
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
          console.log(tabs)
          that.inputURL = tabs[0].url
          that.currentFilterURL = tabs[0].url
          that.currentTabURL = tabs[0].url
          that.currentTabID = tabs[0].id
          that.searchCookies()
        }
      )
    },
    deleteCookies () {
      let that = this
      this.cookies.forEach(function (cookie) {
        chrome.cookies.remove(
          {
            url: that.currentFilterURL,
            name: cookie.name,
            storeId: cookie.storeId
          },
          function () {
            that.init()
          }
        )
      })
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
