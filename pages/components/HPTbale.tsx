import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { InnerScanOutData } from './InnerScanTable'
import moment from 'moment'

// propsの型を定義
type Props = {
  data?: InnerScanOutData[]
}

const HPTbale = (props: Props) => {
  const { data } = props
  const tdata: InnerScanOutData[] = data
    ? data.sort((a, b) => b.date.localeCompare(a.date))
    : []

  return (
    <>
      <TableContainer fontSize={13}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>測定日</Th>
              <Th>体重</Th>
              <Th>体脂肪率</Th>
              <Th>歩数</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tdata.map((item, index) => (
              <Tr key={index}>
                <Td>{moment(item.date, 'YYYYMMDDHHmm').format('MM/DD ddd')}</Td>
                <Td>{item.weight}</Td>
                <Td>{item.bodyFatPct}</Td>
                <Td>{item.steps}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

export default HPTbale
