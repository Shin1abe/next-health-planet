import React, { FC } from 'react'
import ReactECharts from 'echarts-for-react'
import moment from 'moment'
import { InnerScanOutData } from './InnerScanTable'

// propsの型を定義
type Props = {
  sex?: string
  data?: InnerScanOutData[]
}

//参考
// https://echarts.apache.org/examples/en/index.html#chart-type-bar

const LineChart: FC<Props> = (props) => {
  const { data, sex } = props
  if (data) {
    data.sort((a, b) => a.date.localeCompare(b.date))
  }

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    toolbox: {
      show: true,
      feature: {
        // dataZoom: {
        //   yAxisIndex: "none"
        // },
        dataView: {
          readOnly: false
        },
        magicType: {
          type: ["line", "bar"]
        },
        // restore: {},
        saveAsImage: {}
      }
    },
    // toolbox: {
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     magicType: { show: true, type: ['line', 'bar'] },
    //     // restore: {  },
    //     saveAsImage: { show: true },
    //   },
    // },
    // title: {
    //   text: 'Weight / Body Fat Percentage / Step',
    // },
    legend: {
      data: ['体重', '体脂肪率', '歩数'],
      left: 'auto',
    },
    xAxis: {
      type: 'category',
      data:
        data &&
        data.map((data) =>
          moment(data.date, 'YYYYMMDDHHmm').format('MM/DD ddd')
        ),
      axisTick: {
        alignWithLabel: true,
      },
      // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: [
      {
        name: '体重',
        type: 'value',
        position: 'left',
        alignTicks: true,
        scale: true,
        min: sex === 'male' ? 69 : 53,
        interval: 0.5,
        axisLabel: {
          formatter: '{value} kg',
        },
      },
      {
        name: '体脂肪率',
        type: 'value',
        position: 'left',
        offset: 50,
        alignTicks: true,
        min: sex === 'male' ? 20 : 30,
        interval: 1,
        axisLabel: {
          formatter: '{value} %',
        },
      },
      {
        name: '歩数',
        type: 'value',
        offset: 30,
        min: 3,
        interval: 5,
        axisLabel: {
          formatter: '{value} ks',
        },
      },
    ],
    series: [
      {
        type: 'line',
        name: '体重',
        data: data && data.map((item) => item.weight),
        smooth: true,
        xAxisIndex: 0,
        yAxisIndex: 0,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' },
          ],
        },
      },
      {
        type: 'line',
        name: '体脂肪率',
        data: data && data.map((item) => item.bodyFatPct),
        smooth: true,
        xAxisIndex: 0,
        yAxisIndex: 1,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' },
          ],
        },
        // markLine: {
        //   data: [
        //     { type: 'average', name: 'Avg' },
        //     [
        //       {
        //         symbol: 'none',
        //         x: '80%',
        //         yAxis: 'min',
        //       },
        //       {
        //         symbol: 'circle',
        //         label: {
        //           position: 'start',
        //           formatter: 'min',
        //         },
        //         type: 'min',
        //         name: '最低点',
        //       },
        //     ],
        //   ],
        // },
      },
      {
        type: 'bar',
        name: '歩数',
        data: data && data.map((item) => item.steps / 1000),
        smooth: true,
        xAxisIndex: 0,
        yAxisIndex: 2,
        markLine: {
          data: [
            { type: 'average', name: 'Avg' },
            [
              {
                symbol: 'none',
                x: 'max',
                yAxis: 'min',
              },
              {
                symbol: 'circle',
                label: {
                  position: 'start',
                  formatter: 'min',
                },
                type: 'min',
                name: '最低点',
              },
            ],
          ],
        },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        realtime: true,
        start: 60,
        end: 100,
        xAxisIndex: [0],
        filterMode: 'filter',
      },
    ],
  }

  return (
    <>
      <ReactECharts 
      option={options} 
      style={{height: '400px', width: '100%'}}
      className='echarts-for-echarts'/>
    </>
  )
}

export default LineChart
