import { useEffect } from 'react'
import querystring from 'query-string'

const HPOAuth = () => {
  console.log('OAuth')

  // HealthPlanetアクセス許可画面表示
  useEffect(() => {
    const queryParameters = {
      client_id: process.env.NEXT_PUBLIC_HEALTHPLANET_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_HEALTHPLANET_REDIRECT_URI,
      response_type: 'code',
      scope: 'innerscan,pedometer',
    }
    const url = `https://www.healthplanet.jp/oauth/auth?${querystring.stringify(
      queryParameters
    )}`
    window.location.href = url
  }, [])
  return null
}

export default HPOAuth
