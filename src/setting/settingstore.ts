import { defineStore } from 'pinia'
import DebugLog from '../utils/debuglog'
import { getResourcesPath, getUserDataPath } from '../utils/electronhelper'
import { ITokenInfo, useAppStore, useUserStore } from '../store'
import PanDAL from '../pan/pandal'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import UserDAL from "../user/userdal"
import message from "../utils/message"
import { isEmpty } from 'lodash'

declare type ProxyType = 'none' | 'http' | 'https' | 'socks4' | 'socks4a' | 'socks5' | 'socks5h'

export interface SettingState {


  uiTheme: string

  uiImageMode: string

  uiVideoMode: string
  uiVideoPlayer: string
  uiVideoPlayerExit: boolean
  uiVideoPlayerHistory: boolean
  uiVideoSubtitleMode: string
  uiVideoPlayerPath: string
  uiAutoPlaycursorVideo: boolean

  uiAutoColorVideo: boolean

  uiShowPanPath: boolean

  uiShowPanMedia: boolean

  uiExitOnClose: boolean

  uiLaunchAutoCheckUpdate: boolean

  uiLaunchAutoSign: boolean

  uiLaunchStart: boolean

  uiLaunchStartShow: boolean

  uiEnableOpenApi: boolean

  uiOpenApi: string

  uiOpenApiClientId: string

  uiOpenApiClientSecret: string

  uiOpenApiOauthUrl: string

  uiOpenApiAccessToken: string

  uiOpenApiRefreshToken: string

  uiFolderSize: boolean

  uiFileOrderDuli: string

  uiTimeFolderFormate: string

  uiTimeFolderIndex: number

  uiShareDays: string

  uiSharePassword: string

  uiShareFormate: string

  uiXBTNumber: number

  uiXBTWidth: number

  uiFileListOrder: string

  uiFileListMode: string

  uiFileColorArray: { key: string; title: string }[]



  downSavePath: string

  downSavePathDefault: boolean

  downSavePathFull: boolean

  downSaveBreakWeiGui: boolean

  uploadFileMax: number

  downFileMax: number

  downThreadMax: number

  uploadGlobalSpeed: number

  uploadGlobalSpeedM: string

  downGlobalSpeed: number

  downGlobalSpeedM: string

  downAutoShutDown: number

  downSaveShowPro: boolean

  downSmallFileFirst: boolean

  downUploadBreakFile: boolean

  downUploadWhatExist: string

  downIngoredList: string[]



  ariaSavePath: string

  ariaUrl: string

  ariaPwd: string

  ariaHttps: boolean

  ariaState: string

  ariaLoading: boolean

  downFinishAudio: boolean

  downAutoStart: boolean



  debugCacheSize: string

  debugFileListMax: number

  debugFavorListMax: number

  debugDowningListMax: number

  debugDownedListMax: number

  debugFolderSizeCacheHour: number



  yinsiLinkPassword: boolean

  yinsiZipPassword: boolean

  proxyUseProxy: boolean

  proxyType: ProxyType

  proxyHost: string

  proxyPort: number

  proxyUserName: string

  proxyPassword: string
}
const setting: SettingState = {

  uiTheme: 'system',
  uiImageMode: 'fill',
  uiVideoMode: 'web',
  uiVideoPlayer: 'web',
  uiVideoPlayerExit: false,
  uiVideoPlayerHistory: false,
  uiVideoSubtitleMode: 'auto',
  uiVideoPlayerPath: '',
  uiAutoPlaycursorVideo: true,
  uiAutoColorVideo: true,
  uiShowPanPath: true,
  uiShowPanMedia: false,
  uiExitOnClose: false,
  uiLaunchAutoCheckUpdate: false,
  uiLaunchAutoSign: false,
  uiLaunchStart: false,
  uiLaunchStartShow: false,
  uiEnableOpenApi: false,
  uiOpenApi: 'inputToken',
  uiOpenApiClientId: '',
  uiOpenApiClientSecret: '',
  uiOpenApiOauthUrl: 'https://api.nn.ci/alist/ali_open/token',
  uiOpenApiAccessToken: '',
  uiOpenApiRefreshToken: '',
  uiFolderSize: true,
  uiFileOrderDuli: 'null',
  uiTimeFolderFormate: 'yyyy-MM-dd HH-mm-ss',
  uiTimeFolderIndex: 1,
  uiShareDays: 'always',
  uiSharePassword: 'random',
  uiShareFormate: '「NAME」URL\n提取码: PWD',
  uiXBTNumber: 36,
  uiXBTWidth: 960,
  uiFileListOrder: 'name asc',
  uiFileListMode: 'list',
  uiFileColorArray: [
    { key: '#df5659', title: '鹅冠红' },
    { key: '#9c27b0', title: '兰花紫' },
    { key: '#42a5f5', title: '晴空蓝' },
    { key: '#00bc99', title: '竹叶青' },
    { key: '#4caf50', title: '宝石绿' },
    { key: '#ff9800', title: '金盏黄' }
  ],

  downSavePath: '',
  downSavePathDefault: true,
  downSavePathFull: true,
  downSaveBreakWeiGui: true,
  uploadFileMax: 5,
  downFileMax: 5,
  downThreadMax: 4,
  uploadGlobalSpeed: 0,
  uploadGlobalSpeedM: 'MB',
  downGlobalSpeed: 0,
  downGlobalSpeedM: 'MB',
  downAutoShutDown: 0,
  downSaveShowPro: true,
  downSmallFileFirst: false,
  downUploadBreakFile: false,
  downUploadWhatExist: 'refuse',
  downIngoredList: ['thumbs.db', 'desktop.ini', '.ds_store', '.td', '~', '.downloading'],

  ariaSavePath: '',
  ariaUrl: '',
  ariaPwd: '',
  ariaHttps: false,
  ariaState: 'local',
  ariaLoading: false,
  downFinishAudio: true,
  downAutoStart: true,

  debugCacheSize: '',
  debugFileListMax: 3000,
  debugFavorListMax: 1000,
  debugDowningListMax: 1000,
  debugDownedListMax: 5000,
  debugFolderSizeCacheHour: 72,

  yinsiLinkPassword: false,
  yinsiZipPassword: false,

  proxyUseProxy: false,
  proxyType: 'none',
  proxyHost: '',
  proxyPort: 0,
  proxyUserName: '',
  proxyPassword: ''
}
function _loadSetting(val: any) {

  setting.uiTheme = defaultValue(val.uiTheme, ['system', 'light', 'dark'])
  console.log('_loadSetting', val)
  setting.uiImageMode = defaultValue(val.uiImageMode, ['fill', 'width', 'web'])
  setting.uiVideoMode = defaultValue(val.uiVideoMode, ['web', 'online'])
  setting.uiVideoPlayer = defaultValue(val.uiVideoPlayer, ['web', 'other'])
  setting.uiVideoPlayerExit = defaultBool(val.uiVideoPlayerExit, false)
  setting.uiVideoPlayerHistory = defaultBool(val.uiVideoPlayerHistory, false)
  setting.uiVideoSubtitleMode = defaultValue(val.uiVideoSubtitleMode, ['close', 'auto', 'select'])
  setting.uiVideoPlayerPath = defaultString(val.uiVideoPlayerPath, '')
  setting.uiAutoPlaycursorVideo = defaultBool(val.uiAutoPlaycursorVideo, true)
  setting.uiAutoColorVideo = defaultBool(val.uiAutoColorVideo, true)
  setting.uiShowPanPath = defaultBool(val.uiShowPanPath, true)
  setting.uiShowPanMedia = defaultBool(val.uiShowPanMedia, false)
  setting.uiExitOnClose = defaultBool(val.uiExitOnClose, false)
  setting.uiLaunchAutoCheckUpdate = defaultBool(val.uiLaunchAutoCheckUpdate, false)
  setting.uiLaunchAutoSign = defaultBool(val.uiLaunchAutoSign, false)
  setting.uiLaunchStart = defaultBool(val.uiLaunchStart, false)
  setting.uiLaunchStartShow = defaultBool(val.uiLaunchStartShow, false)

  setting.uiEnableOpenApi = defaultBool(val.uiEnableOpenApi, false)
  setting.uiOpenApi = defaultValue(val.uiOpenApi, ['inputToken', 'qrCode'])
  setting.uiOpenApiOauthUrl = defaultString(val.uiOpenApiOauthUrl, 'https://api.nn.ci/alist/ali_open/token')
  setting.uiOpenApiAccessToken = defaultString(val.uiOpenApiAccessToken, '')
  setting.uiOpenApiRefreshToken = defaultString(val.uiOpenApiRefreshToken, '')
  setting.uiOpenApiClientId = defaultString(val.uiOpenApiClientId, '')
  setting.uiOpenApiClientSecret = defaultString(val.uiOpenApiClientSecret, '')

  setting.uiFolderSize = defaultBool(val.uiFolderSize, true)
  setting.uiFileOrderDuli = defaultString(val.uiFileOrderDuli, 'null')
  setting.uiTimeFolderFormate = defaultString(val.uiTimeFolderFormate, 'yyyy-MM-dd HH-mm-ss').replace('mm-dd', 'MM-dd').replace('HH-MM', 'HH-mm')
  setting.uiTimeFolderIndex = defaultNumber(val.uiTimeFolderIndex, 1)
  setting.uiShareDays = defaultValue(val.uiShareDays, ['always', 'week', 'month'])
  setting.uiSharePassword = defaultValue(val.uiSharePassword, ['random', 'last', 'nopassword'])
  setting.uiShareFormate = defaultString(val.uiShareFormate, 'NAME URL 提取码：PWD')

  setting.uiXBTNumber = defaultValue(val.uiXBTNumber, [36, 24, 36, 48, 60, 72])
  setting.uiXBTWidth = defaultValue(val.uiXBTWidth, [960, 720, 960, 1080, 1280])
  setting.uiFileListOrder = defaultValue(val.uiFileListOrder, ['updated_at desc', 'name asc', 'name desc', 'updated_at asc', 'updated_at desc', 'size asc', 'size desc'])
  setting.uiFileListMode = defaultValue(val.uiFileListMode, ['list', 'image', 'bigimage'])
  if (val.uiFileColorArray && val.uiFileColorArray.length >= 6) setting.uiFileColorArray = val.uiFileColorArray


  setting.downSavePath = defaultString(val.downSavePath, '')
  setting.downSavePathDefault = defaultBool(val.downSavePathDefault, true)
  setting.downSavePathFull = defaultBool(val.downSavePathFull, true)
  setting.downSaveBreakWeiGui = defaultBool(val.downSaveBreakWeiGui, true)
  setting.uploadFileMax = defaultValue(val.uploadFileMax, [5, 1, 3, 5, 10, 20, 30, 50])
  setting.downFileMax = defaultValue(val.downFileMax, [5, 1, 3, 5, 10, 20, 30])
  setting.downThreadMax = defaultValue(val.downThreadMax, [4, 1, 2, 4, 8, 16])
  setting.uploadGlobalSpeed = defaultNumberSub(val.uploadGlobalSpeed, 0, 0, 999)
  setting.uploadGlobalSpeedM = defaultValue(val.uploadGlobalSpeedM, ['MB', 'KB'])
  setting.downGlobalSpeed = defaultNumberSub(val.downGlobalSpeed, 0, 0, 999)
  setting.downGlobalSpeedM = defaultValue(val.downGlobalSpeedM, ['MB', 'KB'])
  setting.downAutoShutDown = 0
  setting.downSaveShowPro = defaultBool(val.downSaveShowPro, true)
  setting.downSmallFileFirst = defaultBool(val.downSmallFileFirst, false)
  setting.downUploadBreakFile = defaultBool(val.downUploadBreakFile, false)
  setting.downUploadWhatExist = defaultValue(val.downUploadWhatExist, ['ignore', 'overwrite', 'auto_rename', 'refuse'])
  setting.downIngoredList = val.downIngoredList && val.downIngoredList.length > 0 ? val.downIngoredList : ['thumbs.db', 'desktop.ini', '.ds_store', '.td', '~', '.downloading']

  setting.ariaSavePath = defaultString(val.ariaSavePath, '')
  if (setting.ariaSavePath.indexOf('/') < 0 && setting.ariaSavePath.indexOf('\\') < 0) setting.ariaSavePath = ''
  setting.ariaUrl = defaultString(val.ariaUrl, '')
  if (setting.ariaUrl.indexOf(':') < 0) setting.ariaUrl = ''
  setting.ariaPwd = defaultString(val.ariaPwd, '')
  setting.ariaHttps = defaultBool(val.ariaHttps, false)
  setting.ariaState = defaultValue(val.ariaState, ['local', 'remote'])
  setting.ariaLoading = false
  setting.downFinishAudio = defaultBool(val.downFinishAudio, true)
  setting.downAutoStart = defaultBool(val.downAutoStart, true)

  setting.debugCacheSize = defaultString(val.debugCacheSize, '')
  setting.debugFileListMax = defaultNumberSub(val.debugFileListMax, 3000, 3000, 10000)
  setting.debugFavorListMax = defaultNumberSub(val.debugFavorListMax, 1000, 100, 3000)
  setting.debugDowningListMax = 1000
  setting.debugDownedListMax = defaultNumberSub(val.debugDownedListMax, 5000, 1000, 50000)
  setting.debugFolderSizeCacheHour = defaultValue(val.debugFolderSizeCacheHour, [72, 2, 8, 24, 48, 72])

  setting.yinsiLinkPassword = defaultBool(val.yinsiLinkPassword, false)
  setting.yinsiZipPassword = defaultBool(val.yinsiZipPassword, false)

  setting.proxyUseProxy = defaultBool(val.proxyUseProxy, false)
  setting.proxyType = defaultValue(val.proxyType, ['none', 'http', 'https', 'socks5', 'socks5h'])
  setting.proxyHost = defaultString(val.proxyHost, '')
  setting.proxyPort = defaultNumber(val.proxyPort, 0)
  setting.proxyUserName = defaultString(val.proxyUserName, '')
  setting.proxyPassword = defaultString(val.proxyPassword, '')
}
let settingstr = ''


function LoadSetting() {
  try {
    const settingConfig = getUserDataPath('setting.config')
    if (settingConfig && existsSync(settingConfig)) {
      settingstr = readFileSync(settingConfig, 'utf-8')
      const val = JSON.parse(settingstr)
      _loadSetting(val)
      useAppStore().toggleTheme(setting.uiTheme)
    } else {
      SaveSetting()
    }
  } catch {
    SaveSetting()
  }
  return setting
}

function defaultValue(val: any, check: any[]) {
  if (val && check.includes(val)) return val
  return check[0]
}

function defaultString(val: any, check: string) {
  if (val && typeof val == 'string') return val
  return check
}

function defaultBool(val: any, check: boolean) {
  if (typeof val == 'boolean') return val
  return check
}

function defaultNumber(val: any, check: number) {
  if (typeof val == 'number') return val
  return check
}

function defaultNumberSub(val: any, check: number, min: number, max: number) {
  if (typeof val == 'number') {
    if (val < min) return min
    if (val > max) return max
    return val
  }
  return check
}


function SaveSetting() {
  try {
    const saveStr = JSON.stringify(setting)
    // console.log('SaveSetting', saveStr)
    if (saveStr != settingstr) {
      const settingConfig = getUserDataPath('setting.config')
      writeFileSync(settingConfig, saveStr, 'utf-8')
      settingstr = saveStr
    }
  } catch (err: any) {
    DebugLog.mSaveDanger('SaveSettingToJson', err)
  }
}

const useSettingStore = defineStore('setting', {
  state: (): SettingState => LoadSetting(),
  getters: {
    AriaIsLocal(state: SettingState): boolean {
      return state.ariaState == 'local'
    }
  },
  actions: {
    async updateStore(partial: Partial<SettingState>) {
      if (partial.uiTimeFolderFormate) partial.uiTimeFolderFormate = partial.uiTimeFolderFormate.replace('mm-dd', 'MM-dd').replace('HH-MM', 'HH-mm')
      this.$patch(partial)
      if (Object.hasOwn(partial, 'uiLaunchStart')) {
        window.WebToElectron({ cmd: { launchStart: this.uiLaunchStart, launchStartShow: this.uiLaunchStartShow } })
      }
      if (Object.hasOwn(partial, 'uiEnableOpenApi')
          || Object.hasOwn(partial, 'uiOpenApiAccessToken')
          || Object.hasOwn(partial, 'uiOpenApiRefreshToken')) {
        await this.updateOpenApiToken()
      }
      if (Object.hasOwn(partial, 'uiShowPanMedia')
          || Object.hasOwn(partial, 'uiFolderSize')
          || Object.hasOwn(partial, 'uiFileOrderDuli')) {
        PanDAL.aReLoadOneDirToShow('', 'refresh', false)
      }
      if (Object.hasOwn(partial, 'proxyUseProxy')) {
        this.WebSetProxy()
      }
      SaveSetting()
      useAppStore().toggleTheme(setting.uiTheme)
      window.WinMsgToUpload({ cmd: 'SettingRefresh' })
      window.WinMsgToDownload({ cmd: 'SettingRefresh' })
    },
    updateFileColor(key: string, title: string) {
      if (!key) return
      const arr = setting.uiFileColorArray.concat()
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].key == key) arr[i].title = title
      }
      this.$patch({ uiFileColorArray: arr })
      SaveSetting()
    },
    getProxy() {
      if (!this.proxyType || this.proxyType == 'none') return undefined
      if (!this.proxyHost) return undefined

      if (this.proxyType.startsWith('http')) {
        const auth = this.proxyUserName && this.proxyPassword ? this.proxyUserName + ':' + this.proxyPassword : ''
        const proxy = this.proxyType + '://' + (auth ? auth + '@' : '') + this.proxyHost + ':' + this.proxyPort
        return proxy
      }
      return { hostname: this.proxyHost, port: this.proxyPort, protocol: this.proxyType, username: this.proxyUserName, password: this.proxyPassword }
    },
    WebSetProxy() {
      let proxy = ''
      if (this.proxyUseProxy) {
        if (this.proxyType && this.proxyType !== 'none' && this.proxyHost && this.proxyPort) {
          const auth = this.proxyUserName && this.proxyPassword ? this.proxyUserName + ':' + this.proxyPassword : ''
          proxy = this.proxyType + '://' + (auth ? auth + '@' : '') + this.proxyHost + ':' + this.proxyPort
        }
      }
      window.WebSetProxy({ proxyUrl: proxy })
    },
    async updateOpenApiToken() {
      const token = await UserDAL.GetUserTokenFromDB(useUserStore().user_id)
      if (!token) return
      Object.assign(token, {
        open_api_enable: this.uiEnableOpenApi,
        open_api_access_token: this.uiOpenApiAccessToken,
        open_api_refresh_token: this.uiOpenApiRefreshToken
      })
      window.WebUserToken({
        user_id: token.user_id,
        name: token.user_name,
        access_token: token.access_token,
        open_api_access_token: token.open_api_access_token,
        refresh: true
      })
      if (isEmpty(token.open_api_access_token)) {
        token.open_api_expires_in = 0
      }
      UserDAL.SaveUserToken(token)
    }
  }
})

export default useSettingStore
