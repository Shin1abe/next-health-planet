import { NextApiHandler } from 'next'
import axios from 'axios'
import querystring from 'query-string'
import moment from 'moment'

const callbackHandler: NextApiHandler = async (req, res) => {
  console.log('getHPData')

  const accessToken = req.body.accessToken as string
  const today = moment().format('YYYYMMDDHHmmss')

  // innerscanデータ取得
  //apiへのリクエストパラメタ（6021 : 体重 (kg)、6022 : 体脂肪率 (%)）
  const insRequestBody = {
    access_token: accessToken,
    date: 1,
    to: today,
    tag: '6021,6022',
  }

  let innerscanRes: any
  if (accessToken) {
    try {
      const insResponse = await axios.post(
        'https://www.healthplanet.jp/status/innerscan.json',
        querystring.stringify(insRequestBody),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      innerscanRes = insResponse.data
    } catch (error) {
      console.error(error)
      res.status(500).end()
      return
    }
  }

  // pedometerデータ取得
  //apiへのリクエストパラメタ（6631 : 歩数（歩））
  const pedRequestBody = {
    access_token: accessToken,
    date: 1,
    to: today,
    tag: '6631',
  }
  try {
    let pedRes: any
    if (accessToken) {
      const pedResponse = await axios.post(
        'https://www.healthplanet.jp/status/pedometer.json',
        querystring.stringify(pedRequestBody),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      pedRes = pedResponse.data
    }

    const mergedArr = [...innerscanRes.data, ...pedRes.data]

    res.status(200).send({
      innerscanRes: innerscanRes,
      mergedArr: mergedArr,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}

export default callbackHandler
