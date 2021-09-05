import './App.css';
import {scaleLinear,  
  extent, 
  scaleTime, 
  timeFormat, 
  bin,
  timeMonths,
  sum,
  max} from 'd3';

import { useData } from './components/useData';
import { AxisBottom } from './components/AxisBottom';
import { AxisLeft } from './components/AxisLeft';
import { HistogramPlot } from './components/HistogramPlot';

const width = 960;
const height = 500;
const margin = {top:20, right:30, bottom:65, left:90} 

const xAxisLabelOffset = 50
const yAxisLabelOffset = 40

function App() {
  const data = useData()

  if(!data){
    return <pre>Loading ...</pre>
  }

  const xValue = d => d["Reported Date"] ;
  const xAxisLabel = 'Time'


  const yValue = d =>d["Total Dead and Missing"] ;
  const yAxisLabel = 'Total Dead and Missing'


  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right

  const xAxisTickFormat = timeFormat("%m/%d/%Y")

  const xScale = scaleTime()
                  .domain(extent(data, xValue))
                  .range([0, innerWidth])
                  .nice()


  const [start, stop] = xScale.domain()

  const binnedData = bin()
                  .value(xValue)
                  .domain(xScale.domain())
                  .thresholds(timeMonths(start, stop))
                  (data)
                  .map(array => ({
                    y : sum(array, yValue),
                    x0: array.x0,
                    x1: array.x1
                  }));

  console.log(binnedData)

  const yScale = scaleLinear()
                .domain([0, max(binnedData, d=> d.y)])
                .range([innerHeight, 0])
                .nice()

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
      
      <AxisBottom 
        xScale ={xScale}
        innerHeight = {innerHeight}
        tickFormat = {xAxisTickFormat}
        tickOffset = {5}
      />

      <text
        className='axis-label'
        x={innerWidth / 2}
        y={innerHeight + xAxisLabelOffset}
        textAnchor='middle'
      >{xAxisLabel}</text>

      <AxisLeft 
        yScale = {yScale}
        innerWidth={innerWidth}
        tickOffset = {5}
      />
      
      <text
        className='axis-label'       
        textAnchor='middle'
        transform={`translate(${-yAxisLabelOffset}, ${innerHeight / 2} )rotate(-90)`}
      >{yAxisLabel}</text>

      <HistogramPlot 
        binnedData={binnedData}
        xScale = {xScale}
        yScale = {yScale}
        tooltipFormat = {xAxisTickFormat}
        innerHeight={innerHeight}
      />
      </g>
    </svg>
  );

}

export default App;
 