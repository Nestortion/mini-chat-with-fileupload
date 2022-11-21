import jwt from 'jsonwebtoken'

function signAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET, {
    expiresIn: '10s',
  })
}
function signRefreshToken(user) {
  return jwt.sign(
    { userId: user.id, refreshCount: user.tokenVersion },
    process.env.REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  )
}

export { signAccessToken, signRefreshToken }
