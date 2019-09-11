import React from 'react';
import { StyleSheet, View, ART, Dimensions, TouchableWithoutFeedback } from 'react-native';

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


export default class CatBarChart extends React.Component {

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
  
  render() {
    const screen = Dimensions.get('window');
    const cat_name = this.props.data.cat_name;
    let margin = {};

    if (cat_name==='r1_wat_loc') { 
      margin = {top: 50, right: 70, bottom: 90, left: 125};
    }
    else if (cat_name==='r1_wat_drink') { 
      margin = {top: 50, right: 100, bottom: 90, left: 165};
    }
    else if (cat_name==='r1_plan_del' || cat_name==='r1_pref_del') { 
      margin = {top: 60, right: 100, bottom: 90, left: 110};
    }
    else if (cat_name==='r1_wat_treat') {
      margin = {top: 50, right: 70, bottom: 90, left: 185};
    }
    else if (cat_name==='marr_age') {
      margin = {top: 50, right: 70, bottom: 60, left: 120};
    }
    else if (cat_name==='all_kids_enrolled_cons' || cat_name==='chronicmiss_dum') {
      margin = {top: 60, right: 70, bottom: 60, left: 100};
    }
    else if (cat_name==='marr_age_why') {
      margin = {top: 60, right: 60, bottom: 90, left: 270};
    }
    else if (cat_name==='marr_age_reasons') {
      margin = {top: 60, right: 70, bottom: 60, left: 240};
    }
    else if (cat_name==='marr_prop_rep_who') {
      margin = {top: 60, right: 60, bottom: 90, left: 195};
    }
    else if (cat_name==='marr_comm_local') {
      margin = {top: 60, right: 100, bottom: 100, left: 180};
    }
    else if (cat_name==='educ_miss_why_f') { 
      margin = {top: 60, right: 70, bottom: 60, left: 290};
    }
    else if (cat_name==='educ_miss_why_m') { 
      margin = {top: 60, right: 70, bottom: 60, left: 135};
    }
    else if (cat_name==='absentism_rate_10') {
      margin = {top: 70, right: 110, bottom: 90, left: 135};
    }
    else {
      margin = {top: 50, right: 70, bottom: 90, left: 135};
    }

    const width = screen.width - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const data = this.props.data.sub_indicators;
    const unit = this.props.data.unit;

    let xAxisLabel;

    if (cat_name==='r1_plan_del' || cat_name==='r1_pref_del') {
      xAxisLabel = 'Percent of pregnancies';
    }
    else if (cat_name==='chronicmiss_dum') {
      xAxisLabel = 'Percent of enrolled boys or girls';
    }
    else if (cat_name==='marr_age') {
      xAxisLabel = 'Age'
    }
    else if (cat_name==='absentism_rate_10') {
      xAxisLabel = 'Percent of teachers';
    }
    else if (cat_name==='educ_miss_why_f') {
      xAxisLabel = 'Percent of girls';
    }
    else if (cat_name==='educ_miss_why_m') {
      xAxisLabel = 'Percent of boys';
    }
    else {
      xAxisLabel = 'Percent of households';
    }

    let xAxisLabeldy = 0;
    
    if (cat_name==='marr_age') {
      xAxisLabeldy = 45;
    }
    else if (cat_name==='all_kids_enrolled_cons' || cat_name==='chronicmiss_dum') {
      xAxisLabeldy = 45;
    }
    else if (cat_name==='marr_age_why' || cat_name==='marr_age_reasons' || cat_name==='marr_prop_rep_who' || cat_name==='absentism_rate_10') {
      xAxisLabeldy = 10;
    }
    else if (cat_name==='educ_miss_why_m' || cat_name==='educ_miss_why_f') {
      xAxisLabeldy = 25;
    }


    const y = d3.scale.scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .domain(data.map(d => d.indic_name))

    const maxX = max(data, d => d.upper_bound*1.2)

    const x = d3.scale.scaleLinear()
      .rangeRound([0, width])
      .domain([0, maxX])


    const firstLetterY = y(data[0].indic_name)
    const secondLetterY = y(data[1].indic_name)
    const lastLetterY = y(data[data.length - 1].indic_name)
    const labelDy = (secondLetterY - firstLetterY) / 2

    const leftAxis = [lastLetterY + labelDy, firstLetterY - labelDy]

    const leftAxisD = d3.shape.line()
      .y(d => d)
      .x(() => 0)
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

    return(
      <View>
      <Surface width={screen.width} height={screen.height}>
      <Group x={margin.left} y={margin.top}>
        <Group x={0} y={0}>
          <Group key={-1}>
            <Shape d={leftAxisD} stroke={colours.black} key="-1"/>
            {
            data.map((d, i) =>(
              <Group
                y={y(d.indic_name)}
                x={0}
                key={i + 1}
              >
                <Shape d={this.drawLine(-notch, 0)} stroke={colours.black}/>
                <Text
                  y={-9}
                  x={-9}
                  fill={colours.black}
                  font="16px Arial"
                  alignment="right"
                >
                  {d.indic_label + emptySpace}
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
                  font="16px Arial"
                  alignment='center'
                >
                  {this.formatValue(cat_name,d,unit)}
                </Text>
              </Group>
            ))
            }
            <Group y={height} x={width/2}>
                <Text
                  fill={colours.black}
                  x={0}
                  y={0 - xAxisLabeldy}
                  font="18px Arial"
                  alignment='center'
                >
                {xAxisLabel}
                </Text>
            </Group>
          </Group>
          {
          data.map((d, i) => (
            
            <Group x={x(d.lower_bound < 0 ? 0 : d.lower_bound)} y={y(d.indic_name)} key={i} >
              <Shape
                d={this.drawLine(x(d.upper_bound - (d.lower_bound < 0 ? 0 : d.lower_bound)),0)}
                strokeWidth={3}
                stroke={'rgb(200,200,200'}
              >
              </Shape>
            </Group>
          ))
          }

          {
          data.map((d, i) => (
            
            <Group x={x(d.estimate)} y={y(d.indic_name)} key={i} >
              <Shape
                d={this.drawCircle(y.bandwidth())}
                fill={'#4088d5'}
              >
              </Shape>
              <Text
                fill={colours.black}
                x={0}
                y={-30}
                font="16px Arial"
                alignment='center'
              >
                {this.formatLabel(cat_name,d.estimate,unit)}

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
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'normal',
  }
};
