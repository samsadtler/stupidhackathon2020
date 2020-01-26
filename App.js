import React, {Component} from 'react';
import {StyleSheet, View, Text, Alert, ScrollView} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Tracking from './components/tracking.js';

const axis = ['x', 'y', 'z'];

const availableSensors = {
  accelerometer: axis,
  gyroscope: axis,
  magnetometer: axis,
  barometer: ['pressure'],
};
const viewComponents = Object.entries(availableSensors).map(([name, values]) =>
  Tracking(name, values),
);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataValue: 0,
    };
  }

  componentDidUpdate() {}

  render() {
    return (
      <>
        <ScrollView style={styles.scrollView}>
          {viewComponents.map((Comp, index) => (
            <Comp key={index} />
          ))}
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 40,
    height: 5000,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
