import { atom } from 'recoil'

//user
export const accessTokenState = atom({
  key: 'accessToken',
  default: '',
})
