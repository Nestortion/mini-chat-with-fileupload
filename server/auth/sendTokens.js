export const sendRefreshToken = (res, token) => {
  res.cookie('refresh-token', token, {
    expiresIn: 60 * 60 * 24 * 7,
    httpOnly: true,
  })
}

export const sendAccessToken = (res, token) => {
  res.cookie('refresh-token', token, { expiresIn: 60, httpOnly: true })
}
