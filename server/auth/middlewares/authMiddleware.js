import jwt from 'jsonwebtoken'

const authMiddleware = (context) => {
  const { req, res } = context

  const authorization = req.headers.authorization
  let data

  console.log(authorization)
  if (!authorization) {
    data = null
    throw new Error('not authenticated')
  }

  try {
    const token = authorization.split(' ')[1]
    const tokendata = jwt.verify(token, process.env.ACCESS_SECRET)
    data = tokendata
  } catch (err) {
    data = null
    throw new Error('not authenticated')
  }

  return { req, res, data }
}

export { authMiddleware }
