import React from 'react';
import { StyleSheet, View, ART, Dimensions, TouchableWithoutFeedback, AppState } from 'react-native';

const {
  Surface,
  Group,
  Rectangle,
  ClippingRectangle,
  LinearGradient,
  Shape,
  Text,
  Path,
  Transform
} = ART;

import {
  max,
  ticks
} from 'd3-array'

import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import {format as d3Format} from 'd3-format';
import * as axis from 'd3-axis';
import * as path from 'd3-path';

const d3 = {
  scale,
  shape,
  axis,
  path,
};

import {
  scaleLinear,
  scaleBand,
  scaleTime
} from 'd3-scale';

const colours = {
  black: 'black',
  blue: 'steelblue',
  brown: 'brown'
}

// const data = [
//   {frequency: 5, letter: 'a'},
//   {frequency: 6, letter: 'b'},
//   {frequency: 4, letter: 'c'},
//   {frequency: 1, letter: 'd'},
//   {frequency: 2, letter: 'e'},
//   {frequency: 3, letter: 'f'}
// ];


export default class WardChart extends React.Component {

  constructor(props) {
    super(props);
    this.drawBar = this.drawBar.bind(this);
    this.drawCircle = this.drawCircle.bind(this);
    this.drawLine = this.drawLine.bind(this);            
    this.formatValue = this.formatValue.bind(this);
  };

          
  drawLine(startPoint, endPoint) {
    var path = d3.path.path();
    path.lineTo(startPoint, endPoint);
    return path;
  }

  drawBar(x, y, w, h) {
    var path = d3.path.path();
    path.rect(x, y, w, h);
    return path;
  }

  drawCircle(r) {
    var circleGenerator = d3.shape.symbol().size(r*2);
    var path = circleGenerator();
    return path;
  }

  formatValue(name,value,unit) {
    if (unit==='%') {
      f = d3Format(".0%");
      return f(value)
    }
    else if (name==='hh_surveyed') {
      f = d3Format("d");
      return f(value);
    }
    else {
      f = d3Format(".1f");
      return f(value)
    }
  }

  formatLabel(name,value,unit) {
    if (unit==='%') {
      f = d3Format(".1%");
      return f(value)
    }
    else if (name==='hh_surveyed') {
      f = d3Format("d");
      return f(value);
    }
    else {
      f = d3Format(".1f");
      return f(value)
    }
  }

  getCiColor(vc_code, diff_from_others) {
    if (vc_code === 0 || diff_from_others === 0) {
      return 'rgb(200,200,200)';
    }

    else if ( diff_from_others === 1) {
      return '#4088d5';
    }
  }

  render() {
    const screen = Dimensions.get('window');
    const margin = {top: 175, right: 25, bottom: 300, left: 220}
    const width = screen.width - margin.left - margin.right
    const height = screen.height - margin.top - margin.bottom
    const data = [{'ward_code':0,'ward_name':'Chiefdom','estimate':this.props.data.values.chiefdom.estimate,'lower_bound':this.props.data.values.chiefdom.lower_bound,'upper_bound':this.props.data.values.chiefdom.upper_bound}].concat(this.props.data.values.ward);
    const unit = this.props.data.values.chiefdom.unit;
    const indic_name = this.props.data.indic_name;
    let xAxisLabel;

    if (indic_name==='r1_literacy_test') {
      xAxisLabel = 'Percent of respondents';
    }
    else if (indic_name==='r1_pri_dry_time_hr_w1' || indic_name==='r1_pri_rainy_time_hr_w1' || indic_name==='r1_sec_dry_time_hr_w1' || indic_name==='r1_sec_rainy_time_hr_w1' || indic_name==='r1_high_dry_time_hr_w1' || indic_name==='r1_high_rainy_time_hr_w1' || indic_name==='r1_hea_dry_time_hr_w1' || indic_name==='r1_hea_rainy_time_hr_w1') {
      xAxisLabel = 'Travel time in hours';
    }
    else if (indic_name==='teacher_male' | indic_name==='contract_paid') {
      xAxisLabel = 'Percent of teachers'
    }
    else {
      xAxisLabel = 'Percent of households';
    }

    const y = d3.scale.scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .domain(data.map(d => d.ward_code))

    const maxX = max(data, d => d.upper_bound*1.2)

    const x = d3.scale.scaleLinear()
      .rangeRound([0, width])
      .domain([0, maxX])

    const firstLetterY = y(data[0].ward_code)
    const secondLetterY = y(data[1].ward_code)
    const lastLetterY = y(data[data.length - 1].ward_code)
    const labelDy = (secondLetterY - firstLetterY) / 2

    const leftAxis = [lastLetterY + labelDy, firstLetterY - labelDy]

    const leftAxisD = d3.shape.line()
      .y(d => d)
      .x(() => 0)
      (leftAxis)

    const chiefdomLineD = d3.shape.line()
      .y(d => d)
      .x(() => x(this.props.data.values.chiefdom.estimate))
      (leftAxis)

    const bottomAxis = ticks(0, maxX, 5)

    const bottomAxisD = d3.shape.line()
      .y(() => height - labelDy - 2)
      .x(d => x(d))
      (bottomAxis)

    const notch = 5;
    const labelDistance = 6;
    const emptySpace = "";

    const xFormat = d3Format(".1f");

    let xAxisLabeldy = 45;
    

    return(
      <View>
      <Surface width={screen.width} height={screen.height}>
      <Group x={50} y={35}>
          <Text
              y={0}
              x={0}
              fill={colours.black}
              font="18px Arial"
              alignment="left"
            >
            Note: Blue confidence interval bars mean the value is different from the chiefdom average
          </Text>
      </Group>
      <Group x={margin.left} y={margin.top}>

        <Group x={0} y={0}>
          <Group key={-1}>
            <Shape d={leftAxisD} stroke={colours.black} key="-1"/>
            <Shape d={chiefdomLineD} stroke={'rgb(200,200,200'} key="-2"/>
            {
            data.map((d, i) =>(
              <Group
                y={y(d.ward_code)}
                x={0}
                key={i + 1}
              >
                <Shape d={this.drawLine(-notch, 0)} stroke={colours.black}/>
                <Text
                  y={-12}
                  x={-9}
                  fill={colours.black}
                  font="24px Arial"
                  alignment="right"
                >
                  {d.ward_name + emptySpace}
                </Text>
              </Group>
            ))
            }
          </Group>
          <Group key={-2} >
            <Shape stroke={colours.black} d={bottomAxisD} key="-1"/>
            {
            bottomAxis.map((d, i) => (
              <Group y={height-labelDy-2} x={x(d)} key={i + 1}>
                <Shape d={this.drawLine(0, notch)} y2={notch} stroke={colours.black}/>
                <Text
                  fill={colours.black}
                  x={0}
                  y={labelDistance}
                  font="20px Arial"
                  alignment='center'
                >
                  {this.formatValue(indic_name,d,unit)}
                </Text>
              </Group>
            ))
            }
            <Group y={height} x={width/2}>
                <Text
                  fill={colours.black}
                  x={0}
                  y={0 - xAxisLabeldy}
                  font="24px Arial"
                  alignment='center'
                >
                {xAxisLabel}
                </Text>
            </Group>
          </Group>
          {
          data.map((d, i) => (
            
            <Group x={x(d.lower_bound < 0 ? 0 : d.lower_bound)} y={y(d.ward_code)} key={i} >
              <Shape
                d={this.drawLine(x(d.upper_bound - (d.lower_bound < 0 ? 0 : d.lower_bound)),0)}
                strokeWidth={3}
                stroke={this.getCiColor(d.vc_code,d.diff_from_others)}
              >
              </Shape>
            </Group>
          ))
          }

          {
          data.map((d, i) => (
            
            <Group x={x(d.estimate)} y={y(d.ward_code)} key={i} >
              <Shape
                d={this.drawCircle(y.bandwidth())}
                fill={'#4088d5'}
              >
              </Shape>
              <Text
                fill={colours.black}
                x={0}
                y={-35}
                font="20px Arial"
                alignment='center'
              >
                {this.formatLabel(indic_name,d.estimate,unit)}

              </Text>

            </Group>
          ))
          }
        </Group>
        </Group>
      </Surface>
      </View>
    )
  }
}

const styles = {
  container: {
    margin: 20,
  },
  label: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'normal',
  }
};
