import React from 'react'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import axios from 'axios'
import querystring from 'query-string'
import moment from 'moment'
import { Box, Button, Stack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import LineChart from './LineChart'
import Head from 'next/head'
// import HPTbale from './HPTbale'

// Helth Planet API 取得結果
type InnerScanData = {
  date: string
  keydata: string
  model: string
  tag: string
}
// Helth Planet API 取得結果を画面出力
export type InnerScanOutData = {
  date: string
  weight: number
  bodyFatPct: number
  steps: number
}
// propsの型を定義
type Props = {
  height?: string
  sex?: string
  birth_date?: string
  datas?: InnerScanData[]
}

const InnerScanTable = (props: Props) => {
  console.log('InnerScanTable')
  const { height, sex, birth_date, datas } = props
  const [Height, setHeight] = useState<string>()
  const [Sex, setSex] = useState<string>()
  const [Birth_date, setBirth_date] = useState<string>()
  const [data, setData] = useState<InnerScanOutData[]>([])
  const { colorMode, toggleColorMode } = useColorMode()
  const color = useColorModeValue("white", "gray.800")
  
  const formatDate = (yyyymmdd: string): string => {
    const year = yyyymmdd.slice(0, 4);
    const month = yyyymmdd.slice(4, 6);
    const day = yyyymmdd.slice(6, 8);
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    const outputData: InnerScanOutData[] = datas
      .filter(
        (data) =>
          data.tag === '6021' || data.tag === '6022' || data.tag === '6331'
      )
      // API結果⇒出力形式
      .map((data) => {
        const output: InnerScanOutData = {
          date: '',
          weight: 0,
          bodyFatPct: 0,
          steps: 0,
        }
        output.date = data.date
        if (data.tag === '6021') {
          output.weight = parseFloat(data.keydata)
        } else if (data.tag === '6022') {
          output.bodyFatPct = parseFloat(data.keydata)
        } else if (data.tag === '6331') {
          output.steps = parseFloat(data.keydata)
        }
        return output
      })
      // 同一の日付データはまとめる
      .reduce((acc, curr) => {
        const existingData = acc.find(
          (data) => data.date.substring(0, 8) === curr.date.substring(0, 8)
        )
        if (existingData) {
          existingData.weight =
            curr.weight !== 0 ? curr.weight : existingData.weight
          existingData.bodyFatPct =
            curr.bodyFatPct !== 0 ? curr.bodyFatPct : existingData.bodyFatPct
          existingData.steps =
            curr.steps !== 0 ? curr.steps : existingData.steps
        } else {
          acc.push(curr)
        }
        return acc
      }, [])
    // sort
    // .sort((a, b) => a.date.localeCompare(b.date))
    setData(outputData)
    setHeight(height)
    setSex(sex)
    setBirth_date(birth_date)
  }, [height, sex, birth_date, datas])

  return (
    <Stack direction="column"  padding={2} margin={1}>
     <Head>Health Planet Dashboard for abe</Head>
      <Button onClick={toggleColorMode} fontSize={13}  size='sm' colorScheme='blue'  color={color}>
        Health Planet Dashboard for abe
      </Button>
      <Box fontSize={11}>
        身長 ：{Height}cm、性別 ：{Sex === 'male' ? '男性' : '女性'}、誕生日：
        {formatDate(Birth_date)}
      </Box>
      <Box p="0" m="0">
        <LineChart data={data} sex={sex} />
        <Text fontSize={11}>
          体脂肪率基準（40-59歳）：
          {Sex === 'male'
            ? '男（標準：12-17、標準+：18-22）'
            : '女（標準：22-28、標準+：29-35）'}
        </Text>
      </Box>
      {/* <Box p="1" mt="1">
        <HPTbale data={data} />
      </Box> */}
    </Stack>
  )
}

export default InnerScanTable
//------------------------------------------------------------------------
// サーバサイドで実行する処理(getServerSideProps)を定義
export const getServerSideProps: GetServerSideProps = async (context) => {
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
}
