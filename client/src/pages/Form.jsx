import { useMutation, gql } from '@apollo/client'
import styles from '../styles/Form.module.css'
import { useState } from 'react'

const addUserChat = gql`
  mutation AddUserChat(
    $file: Upload
    $message: String
    $receiver: Int
    $userId: Int
  ) {
    addUserChat(
      file: $file
      message: $message
      receiver: $receiver
      userId: $userId
    ) {
      id
      message
      receiver
      userId
    }
  }
`

export default function Form() {
  const [mutate] = useMutation(addUserChat)

  const [fileInput, setFileInput] = useState(null)

  const [userMessage, setMessage] = useState('')

  const sendMessage = () => {
    if (fileInput && userMessage) {
      mutate({ variables: { file: fileInput, userId: 21, receiver: 1 } })
      console.log(userMessage)
      mutate({ variables: { message: userMessage, userId: 21, receiver: 1 } })
    } else if (fileInput != null) {
      mutate({ variables: { file: fileInput, userId: 21, receiver: 1 } })
    } else {
      if (userMessage !== '') {
        mutate({ variables: { message: userMessage, userId: 21, receiver: 1 } })
      }
    }
  }

  const fileChangeHandle = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) setFileInput(file)
  }

  const messageChangeHandle = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div>
      <div className={styles.cringe}>
        <div className={styles.messageConstructor}>
          <input type="file" onChange={fileChangeHandle} id="file" />
          <textarea onChange={messageChangeHandle}></textarea>
        </div>
        <button onClick={sendMessage}>Submit</button>
      </div>
    </div>
  )
}
