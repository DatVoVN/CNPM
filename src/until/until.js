import axios from 'axios'
import { getAccessToken, saveAccessToken, saveProfile, tokenBear } from '.'

class Http {
  instance
  accessToken
  constructor() {
    this.accessToken = getAccessToken()
    this.instance = axios.create({
      baseURL: 'https://lucifernsz.com/PBL6-BE/public/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = this.accessToken

          return config
        }
        if (config.data instanceof FormData) {
          config.headers['Content-Type'] = 'multipart/form-data'
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url == 'user/login') {
          const tokenBear = 'Bearer ' + response.data.data?.access_token
          this.accessToken = tokenBear
          saveAccessToken(response.data.data?.access_token)
          if (response.data.data) {
            saveProfile(response.data.data)
          }
        }
        return response
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance
export default http
