import { GetServerSideProps } from 'next';
import axios from 'axios';
import querystring from 'query-string';
import moment from 'moment';
import { Props } from './components/InnerScanTable';

// getServerSidePropsの定義

export const getServerSideProps: GetServerSideProps = async (context) => {
  // データ取得処理...
    // APIやDBからのデータ取得処理などを記載
    const accessToken = context.query.access_token
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
      await axios
        .post(
          'https://www.healthplanet.jp/status/innerscan.json',
          querystring.stringify(insRequestBody),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((response) => {
          innerscanRes = response
        })
        .catch((error) => {
          console.error(error)
        })
    }
  
    // pedometerデータ取得
    //apiへのリクエストパラメタ（6631 : 歩数（歩））
    const pedRequestBody = {
      access_token: accessToken,
      date: 1,
      to: today,
      tag: '6631',
    }
  
    let pedRes: any
    if (accessToken) {
      await axios
        .post(
          'https://www.healthplanet.jp/status/pedometer.json',
          querystring.stringify(pedRequestBody),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((response) => {
          pedRes = response
        })
        .catch((error) => {
          console.error(error)
        })
    }
  
    // innerscanResとpemeterの結果をmerge
    const mergedArr = [...innerscanRes.data.data, ...pedRes.data.data].reduce(
      (acc, curr) => {
        acc.push(curr)
        return acc
      },
      []
    )
  
    const props: Props = {
      height: innerscanRes?.data?.height || null,
      sex: innerscanRes?.data?.sex || null,
      birth_date: innerscanRes?.data?.birth_date || null,
      datas: mergedArr || null,
    }
  
    return {
      props: props,
    }
  };
