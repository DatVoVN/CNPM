export const getAccessToken = () => {
  const token = localStorage.getItem('accesstoken')
  return token ? `Bearer ${token}` : ''
}
export const saveAccessToken = (token) => {
  localStorage.setItem('accesstoken', token)
}
export const tokenBear = (token) => {
  return 'Bearer ' + token
}

export const getProfile = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const saveProfile = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const clearProfile = () => {
  localStorage.removeItem('profile')
}

export const BASE_URL = 'https://lucifernsz.com/PBL6-BE/public/api'
// SEO
const removeSpecialCharacter = (stri) => {
  return stri.replace(/[^\w\s]/gi, '')
}

export const generateNameId = (str, id) => {
  return removeSpecialCharacter(str).replace(/\s+/g, '-') + `-i,${id}`
}

export const getIdfromNameId = (nameId) => {
  var arr = nameId.split('-i,')
  return arr[arr.length - 1]
}
