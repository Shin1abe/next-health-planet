import React, { FC, useEffect, useRef } from 'react'
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

  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizeChart = () => {
      if (chartRef.current) {
        const chartWidth = chartRef.current.clientWidth
        const calculatedWidth = Math.max(chartWidth, data.length * 50)
        chartRef.current.style.width = `${calculatedWidth}px`
      }
    }

    resizeChart()

    const observer = new ResizeObserver(resizeChart)
    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current)
      }
    }
  }, [data])

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
          readOnly: false,
        },
        magicType: {
          type: ['line', 'bar'],
        },
        // restore: {},
        saveAsImage: {},
      },
    },
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
      axisLabel: {
        fontSize:11,
      },
  },
    yAxis: [
      {
        name: '体重',
        type: 'value',
        position: 'left',
        alignTicks: true,
        scale: true,
        offset: 45,
        min: sex === 'male' ? 69 : 53,
        interval: 0.5,
        axisLabel: {
          formatter: '{value}kg',
          fontSize:9,
        },
      },
      {
        name: '体脂肪率',
        type: 'value',
        position: 'left',
        offset: -5,
        alignTicks: true,
        min: sex === 'male' ? 20 : 30,
        interval: 1,
        axisLabel: {
          formatter: '{value}%',
          fontSize:9,
        },
      },
      {
        name: '歩数',
        type: 'value',
        offset: -5,
        min: 3,
        interval: 5,
        axisLabel: {
          formatter: '{value}ks',
          fontSize:9,
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
    // <div ref={chartRef} style={{ overflowX: 'auto' , display: 'flex', justifyContent: 'center' }}>
    <div >
      <ReactECharts 
        option={options} 
        style={{ height: '400px', minWidth: '100%' }}
      />
    </div>
  )
}

export default LineChart
