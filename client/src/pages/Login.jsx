import { useState } from 'react'
import styles from '../styles/Login.module.css'
import { gql, useMutation, useQuery } from '@apollo/client'
import { getAccessToken, setAccessToken } from '../authStore'
import { useNavigate } from 'react-router-dom'

const SEARCH_USER = gql`
  query Users {
    users {
      access_level
      id
      username
    }
  }
`

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`

const REFRESH_ACCES_TOKEN = gql`
  mutation RefreshAcessToken {
    refreshAccessToken {
      accessToken
    }
  }
`

const REVOKE_REFRESH_TOKEN = gql`
  mutation RevokeRefreshToken($userId: Int!) {
    revokeRefreshToken(userId: $userId)
  }
`

const IS_LOGGED_IN = gql`
  query Query {
    isLoggedIn
  }
`

export default function login() {
  const {
    data: loggedIn,
    loading,
    error,
  } = useQuery(IS_LOGGED_IN, { fetchPolicy: 'network-only' })
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN)
  // const [refreshAccessToken, { data: refreshdata, loading, error }] =
  //   useMutation(REFRESH_ACCES_TOKEN)
  // const [getUsers, { data, loading, error }] = useLazyQuery(SEARCH_USER)
  // const [revoke] = useMutation(REVOKE_REFRESH_TOKEN)

  const handleOnClick = async (e) => {
    const { data: userToken } = await login({
      variables: { username, password },
    })

    setAccessToken(userToken?.login?.accessToken)
    navigate('/home')
    // revoke({ variables: { userId: 21 } })
    // refreshAccessToken()
  }

  if (loading) return <div>loading...</div>

  if (loggedIn) {
    if (loggedIn.isLoggedIn === true) {
      console.log(getAccessToken())
      navigate('/home')
    }
  } else {
    return (
      <>
        <h1>Login</h1>
        <div className={styles.formContainer}>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button onClick={handleOnClick}>Submit</button>
        </div>
      </>
    )
  }
}
