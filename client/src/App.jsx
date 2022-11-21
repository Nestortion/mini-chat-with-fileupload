import { gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { setAccessToken } from './authStore'
import Form from './pages/Form'
import Login from './pages/Login'
import Register from './pages/Register'

const REFRESH_TOKEN = gql`
  mutation RefreshAcessToken {
    refreshAccessToken {
      accessToken
    }
  }
`

function App() {
  const [refreshToken] = useMutation(REFRESH_TOKEN)

  useEffect(() => {
    refreshToken().then((x) => {
      const { data } = x
      setAccessToken(data.refreshAccessToken.accessToken)
    })
  }, [])

  return (
    <div className="App">
      <div>
        <Link to="/">Login</Link>
      </div>
      <div>
        <Link to="/home">Home</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Form />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
