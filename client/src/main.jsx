import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  ApolloLink,
  concat,
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { getAccessToken } from './authStore'

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const accessToken = getAccessToken()
    return {
      headers: {
        ...headers,
        authorization: `bearer ${accessToken}`,
      },
    }
  })

  return forward(operation)
})

const uploadlink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
})

const client = new ApolloClient({
  link: concat(authLink, uploadlink),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
)
