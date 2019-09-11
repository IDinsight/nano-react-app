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

  getCircleFill(name, subgroup_name) {
    if (subgroup_name==='girls') {
      return '#74a67a';
    }
    else if (subgroup_name==='boys') {
      return '#4088d5';
    }
  }
  
  render() {
    const screen = Dimensions.get('window');
    const cat_name = this.props.data.cat_name;
    let margin = {};

    if (cat_name==='educ_enroll_not') { 
      margin = {top: 130, right: 130, bottom: 45, left: 200};
    }
    else {
      margin = {top: 50, right: 70, bottom: 90, left: 135};
    }

    const width = screen.width - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const groups = this.props.data.groups;
    const subgroups = this.props.data.sub_groups;
    const data = this.props.data.sub_indicators;
    const unit = this.props.data.unit;
    let offsets = {};

    let xAxisLabel;

    if (cat_name==='r1_plan_del' || cat_name==='r1_pref_del') {
      xAxisLabel = 'Percent of pregnancies';
    }
    else {
      xAxisLabel = 'Percent of households';
    }


    const y = d3.scale.scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .domain(groups.map(d => d.group_label))

    let maxList = [];
    subgroups.forEach(function(e) {
      maxList.push(max(data[e.subgroup_name], d => d.upper_bound*1.2))
    });
    const maxX = max(maxList, d => d*1.2)

    const x = d3.scale.scaleLinear()
      .rangeRound([0, width])
      .domain([0, maxX])

    const firstLetterY = y(groups[0].group_label)
    const secondLetterY = y(groups[1].group_label)
    const lastLetterY = y(groups[groups.length - 1].group_label)
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

    let offsetList = []
    if (subgroups.length===2) {
      offsetList = [-25,25]
    }
    if (subgroups.length===3) {
      offsetList = [-40,0,40]
    }
    subgroups.forEach(function(d,i) {
      offsets[d.subgroup_name] = offsetList[i];
    })

    let xAxisLabeldy = 0;
    
    if (cat_name==='educ_enroll_not') {
      xAxisLabeldy = 40;
    }

    return(
      <View>
      <Surface width={screen.width} height={screen.height}>
      <Group x={25} y={35} key={0}>
        
        {
          subgroups.map((d, i) => (
            <Group x={125 + ((i-1)*120)} y={0} key={i}>
            <Shape
              d={this.drawCircle(y.bandwidth())}
              fill={this.getCircleFill(cat_name,d.subgroup_name)}
            >
            </Shape>
            <Text
              fill={colours.black}
              x={25}
              y={-12}
              font="20px Arial"
              alignment='left'
            >
              {d.subgroup_label}

            </Text>
            </Group>
            ))
        }
      </Group>

      <Group x={margin.left} y={margin.top}>
        <Group x={0} y={0}>
          <Group key={-1}>
            <Shape d={leftAxisD} stroke={colours.black} key="-1"/>
            {
            groups.map((d, i) =>(
              <Group
                y={y(d.group_label)}
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
                  {d.group_label + emptySpace}
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
            subgroups.map((e, j) => (

              data[e.subgroup_name].map((d, i) => (
                
                <Group x={x(d.lower_bound < 0 ? 0 : d.lower_bound)} y={y(d.indic_label)+offsets[e.subgroup_name]} key={i} >
                  <Shape
                    d={this.drawLine(x(d.upper_bound - (d.lower_bound < 0 ? 0 : d.lower_bound)),0)}
                    strokeWidth={3}
                    stroke={'rgb(200,200,200'}
                  >
                  </Shape>
                </Group>
              ))
            ))
          }

          {
            subgroups.map((e, j) => (

            data[e.subgroup_name].map((d, i) => (
              
              <Group x={x(d.estimate)} y={y(d.indic_label)+offsets[e.subgroup_name]} key={i} >
                <Shape
                  d={this.drawCircle(y.bandwidth())}
                  fill={this.getCircleFill(cat_name,e.subgroup_name)}
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
