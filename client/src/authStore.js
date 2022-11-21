// import { useAtom, atom } from 'jotai'

// const accessToken = atom('')

// const getAccessToken = atom((get) => get(accessToken))

// const setAccessToken = atom(null, (get, set, value) => {
//   set(accessToken, value)
// })

// export { getAccessToken, setAccessToken }

let accessToken = ''

const setAccessToken = (token) => {
  accessToken = token
}

const getAccessToken = () => {
  return accessToken
}

export { setAccessToken, getAccessToken }
