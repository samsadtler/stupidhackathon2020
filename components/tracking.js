import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Sensors from 'react-native-sensors';
import Pie from 'react-native-pie';
import Geolocation from 'react-native-geolocation-service';
import {map, filter} from 'rxjs/operators';

export default function(sensorName, values) {
  const sensor$ = Sensors[sensorName];
  return class Tracking extends Component {
    constructor(props) {
      super(props);

      const initialValue = values.reduce(
        (carry, val) => ({...carry, [val]: 0}),
        {},
      );
      this.state = {
        initialValue,
        dataValue: 0,
        percentageValue: 2,
      };
    }

    componentDidMount() {
      const subscription = sensor$.subscribe(values => {
        var newData = this.state.dataValue,
          newPrecentage = this.state.percentageValue;
        if (Object.keys(values).length === 1) {
          if (Math.abs(values.pressure - this.state.pressure) > 0.001) {
            newData = this.state.dataValue + 1;
            newPrecentage = this.state.percentageValue + 1;
          }
        }
        if (Object.keys(values).length === 4) {
          if (
            Math.abs(values.x - this.state.x) > 0.02 ||
            Math.abs(values.y - this.state.y) > 0.02 ||
            Math.abs(values.z - this.state.z) > 0.02
          ) {
            newData = this.state.dataValue + 1;
            newPrecentage = this.state.percentageValue + newData / 10000;
            console.log(newPrecentage);
          }
        }
        this.setState({
          ...values,
          dataValue: newData,
          percentageValue: newPrecentage,
        });
      });
      this.setState({subscription});
    }

    componentWillUnmount() {
      this.state.subscription.unsubscribe();
      this.setState({subscription: null});
    }

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.circleContainer}>
            <Pie
              radius={175}
              innerRadius={130}
              sections={[
                {
                  percentage: this.state.percentageValue,
                  color: '#44CD40',
                },
              ]}
              dividerSize={4}
              strokeCap={'round'}
            />
            <Text style={styles.circle}>{this.state.dataValue}</Text>
            <Text style={{fontSize: 20, top: '30%', zIndex: 30}}>Data</Text>
          </View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    height: 350,
  },
  circle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 100,
    color: 'blue',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 200,
    fontSize: 20,
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
