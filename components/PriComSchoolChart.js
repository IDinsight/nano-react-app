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


export default class PriComSchoolChart extends React.Component {

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
    else if (name==='hh_surveyed' || name==='cap_payment' || name==='cap_space' || name==='teach_count_check' || name==='inf_blocks' || name==='num_improved_floors' || name==='num_improved_walls' || name==='num_roofs_weather_res') {
      f = d3Format("d");
      return f(value);
    }
    else if (name==='room_elec') {
      if (value===0) {
        return 'No';
      }
      else if (value===1) {
        return 'Yes';
      }
    }
    else {
      f = d3Format(".1f");
      return f(value)
    }
  }

  formatLabel(name,value,unit, total_blocks) {
    if (unit==='%') {
      f = d3Format(".1%");
      return f(value)
    }
    else if (name==='hh_surveyed' || name==='cap_payment' || name==='cap_space' || name==='teach_count_check' || name==='inf_blocks') {
      f = d3Format("d");
      return f(value);
    }
    else if (name==='room_elec') {
      return ''
    }
    else if (name==='num_improved_floors' || name==='num_improved_walls' || name==='num_roofs_weather_res') {
      f = d3Format("d");
      return f(value) + ' (total blocks: ' + f(total_blocks) + ')';
    }
    else {
      f = d3Format(".1f");
      return f(value)
    }
  }

  render() {
    const screen = Dimensions.get('window');
    const indic_name = this.props.data.indic_name;
    let margin = {top: 140, right: 25, bottom: 320, left: 350}

    if (indic_name==='per_room_board' || indic_name==='per_room_desks' || indic_name==='per_room_sit' || indic_name==='per_washing_nearby' || indic_name==='per_washing_nearby_soap' || indic_name==='per_washing_nearby_water' || indic_name==='vip_flush_per') {

        margin = {top: 140, right: 50, bottom: 320, left: 350}
    }

    const width = screen.width - margin.left - margin.right
    const height = screen.height - margin.top - margin.bottom
    const data = this.props.data.values.school.values.filter(function(d) { return d.school_type==='Community: Primary'});
    const unit = this.props.data.values.school.unit;
    let xAxisLabel;

    if (indic_name==='enrolled_per_f') {
      xAxisLabel = 'Percent girls';
    }
    else if (indic_name==='vip_flush_per') {
      xAxisLabel = 'Percent of facilities';
    }
    else if (indic_name==='cap_payment' || indic_name==='cap_space' || indic_name==='r1_sec_dry_time_hr_w1' || indic_name==='r1_sec_rainy_time_hr_w1' || indic_name==='r1_high_dry_time_hr_w1' || indic_name==='r1_high_rainy_time_hr_w1' || indic_name==='r1_hea_dry_time_hr_w1' || indic_name==='r1_hea_rainy_time_hr_w1') {
      xAxisLabel = 'Total children';
    }
    else if (indic_name==='housing_cap_per') {
      xAxisLabel = 'Percent of teachers';
    }
    else if (indic_name==='teach_count_check') {
      xAxisLabel = 'Total teachers';
    }
    else if (indic_name==='teacher_student_ratio') {
      xAxisLabel = 'Average students per teacher';
    }
    else if (indic_name==='room_elec') {
      xAxisLabel = '';
    }
    else if (indic_name==='inf_blocks' || indic_name==='num_improved_floors' || indic_name==='num_improved_walls' || indic_name==='num_roofs_weather_res') {
      xAxisLabel = 'Total blocks';
    }
    else if (indic_name==='per_room_board' || indic_name==='per_room_desks' || indic_name==='per_room_sit') {
      xAxisLabel = 'Percent of classrooms';
    }
    else if (indic_name==='per_washing_nearby') {
      xAxisLabel = 'Percent of toilet facilities';
    }
    else if (indic_name==='per_washing_nearby_soap' || indic_name==='per_washing_nearby_water') {
      xAxisLabel = 'Percent of handwashing facilities';
    }
    else if (indic_name==='student_toilet_ratio') {
      xAxisLabel = 'Average students'
    }

    const y = d3.scale.scaleBand()
      .rangeRound([0, height])
      .padding(0.1)
      .domain(data.map(d => d.school_code))

    let maxX = max(data, d => d.estimate*1.2)

    if (indic_name==='room_elec') {
      maxX = 1;
    }

    if (unit==='%' && maxX>1) {
      maxX=1;
    }

    const x = d3.scale.scaleLinear()
      .rangeRound([0, width])
      .domain([0, maxX])


    const firstLetterY = y(data[0].school_code)
    const secondLetterY = y(data[1].school_code)
    const lastLetterY = y(data[data.length - 1].school_code)
    const labelDy = (secondLetterY - firstLetterY) / 2

    const leftAxis = [lastLetterY + labelDy, firstLetterY - labelDy]

    const leftAxisD = d3.shape.line()
      .y(d => d)
      .x(() => 0)
      (leftAxis)

    let bottomAxis = ticks(0, maxX, 5)

    if (indic_name==='room_elec') {
      bottomAxis = ticks(0, 1, 2)
    }
    else if (indic_name==='inf_blocks' || indic_name==='num_improved_floors' || 'num_improved_walls' || 'num_roofs_weather_res') {
      bottomAxis = ticks(0, maxX, 3)
    }

    let bottomAxisD = d3.shape.line()
      .y(() => height - labelDy - 2)
      .x(d => x(d))
      (bottomAxis)



    const notch = 5;
    const labelDistance = 6;
    const emptySpace = "";

    const xFormat = d3Format(".1f");

    let xAxisLabeldy = 5;

    return(
      <View>
      <Surface width={screen.width} height={screen.height}>
      <Group x={50} y={35}>
          <Text
              y={0}
              x={0}
              fill={colours.black}
              font="22px Arial"
              alignment="left"
            >
            Note: "Com" used in school names is short for "Community"
          </Text>
      </Group>
      <Group x={margin.left} y={margin.top}>
        <Group x={0} y={0}>
          <Group key={-1}>
            <Shape d={leftAxisD} stroke={colours.black} key="-1"/>
            {
            data.map((d, i) =>(
              <Group
                y={y(d.school_code)}
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
                  {d.school_name + emptySpace}
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
                  y={0-xAxisLabeldy}
                  font="24px Arial"
                  alignment='center'
                >
                {xAxisLabel}
                </Text>
            </Group>
          </Group>
          

          {
          data.map((d, i) => (
            
            <Group x={x(d.estimate)} y={y(d.school_code)} key={i} >
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
                {this.formatLabel(indic_name,d.estimate,unit,d.block_total)}

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
