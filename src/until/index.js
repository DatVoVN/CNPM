export const getAccessToken = () => {
  const token = localStorage.getItem('accesstoken')
  return token ? `Bearer ${token}` : ''
}
export const saveAccessToken = (token) => {
  // const tokenBear = token ? `Bearer ${token}` : ''
  localStorage.setItem('accesstoken', token)
}
export const tokenBear = (token) => {
  return 'Bearer ' + token
}

export const getProfile = () => {
  const result = localStorage.getItem('profile')
  return  result ? JSON.parse(result) : null
}

export const saveProfile = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const clearProfile = () => {
  localStorage.removeItem('profile')
}
