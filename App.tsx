import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import formatTime from 'minutes-seconds-milliseconds';

interface State {
  timeElapsed: number | null;
  running: boolean;
  startTime: number | null; 
  laps: number[];
  lapButtonState: 'lap' | 'reset';
}

export default class App extends Component<{}, State> {
  interval: NodeJS.Timeout | undefined;

  constructor(props: {}) {
    super(props);
    this.state = {
      timeElapsed: null,
      running: false,
      startTime: null,
      laps: [],
      lapButtonState: 'lap',
    };
    this.handleStartPress = this.handleStartPress.bind(this);
    this.handleLapPress = this.handleLapPress.bind(this);
    this.handleResetPress = this.handleResetPress.bind(this);
  }

  handleStartPress() {
    if (this.state.running) {
      clearInterval(this.interval);
      this.setState({ 
        running: false,
        lapButtonState: 'reset' 
      });
    } else {
      const now = new Date().getTime(); 
      const startTime = now - (this.state.timeElapsed || 0);
      
      this.setState({ 
        startTime,
        lapButtonState: 'lap' 
      });
      
      this.interval = setInterval(() => {
        this.setState({
          timeElapsed: new Date().getTime() - startTime,
          running: true,
        });
      }, 30);
    }
  }

  handleLapPress() {
    if (this.state.running) {
      const lapTime = this.state.timeElapsed || 0;
      const lastLapTime = this.state.laps.length > 0 ? this.state.laps[this.state.laps.length - 1] : 0;
      const lapInterval = lapTime - lastLapTime;
      
      this.setState({
        laps: [...this.state.laps, lapInterval],
      });
    } else {
      this.resetLaps();
    }
  }
  

  resetLaps() {
    this.setState({
      timeElapsed: null,
      laps: [],
      lapButtonState: 'lap'
    });
  }

  handleResetPress() {
    this.resetLaps();
  }

  startStopButton() {
    const buttonStyle = this.state.running ? styles.stopButton : styles.startButton;
    const textStyle = this.state.running ? styles.stopButtonText : styles.startButtonText;
    
    return (
      <TouchableHighlight
        underlayColor="gray"
        onPress={this.handleStartPress}
        style={[styles.button, buttonStyle]}
      >
        <Text style={textStyle}>{this.state.running ? 'Stop' : 'Start'}</Text>
      </TouchableHighlight>
    );
  }

  lapButton() {
    const buttonLabel = this.state.lapButtonState === 'lap' ? 'Lap' : 'Reset';
    const buttonAction = this.state.lapButtonState === 'lap' ? this.handleLapPress : this.handleResetPress;
    return (
      <TouchableHighlight
        style={styles.lapButton}
        underlayColor="gray"
        onPress={buttonAction}
      >
        <Text style={styles.lapButtonText}>{buttonLabel}</Text>
      </TouchableHighlight>
    );
  }

  laps() {
    const { laps, timeElapsed } = this.state;
    const maxTime = Math.max(...laps);
    const minTime = Math.min(...laps);
  
    return laps.map((time, index) => {
      const lapIndex = laps.length - index;
      const lapTextStyle =
        time === maxTime ? styles.slowestLapText : time === minTime ? styles.fastestLapText : null;
  
      return (
        <View key={index} style={styles.lap}>
          <Text style={[styles.lapText, lapTextStyle]}>Lap {lapIndex}</Text>
          <Text style={[styles.lapText, lapTextStyle]}>{formatTime(time)}</Text>
        </View>
      );
    });
  }
  
  

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.timerWrapper}>
              <Text style={styles.timer}>
                {formatTime(this.state.timeElapsed || 0)}
              </Text>
            </View>
            <View style={styles.buttonWrapper}>
              {this.lapButton()}
              {this.startStopButton()}
            </View>
          </View>
          <View style={styles.footer}>{this.laps()}</View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black', 
    paddingHorizontal: 10, 
  },
  container: {
    flex: 1,
    backgroundColor: 'black', 
  },
  header: {
    flex: 1,
  },
  footer: {
    flex: 1,
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  lapButton: {
    borderWidth: 2,
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#696969', 
  },
  lapButtonText: {
    color: 'white', 
  },
  timer: {
    fontSize: 60,
    color: 'white'
  },
  lapText: {
    fontSize: 30,
    color: 'white'
  },
  button: {
    borderWidth: 2,
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  startButton: {
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderColor: 'rgba(0, 200, 0, 0.5)', 
  },
  startButtonText: {
    color: 'rgba(0, 200, 0, 0.5)', 
  },  
  stopButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)', 
    borderColor: 'rgba(255, 0, 0, 0.5)', 
  },
  stopButtonText: {
    color: 'red', 
  },
  slowestLapText: {
    color: 'red',
  },
  fastestLapText: {
    color: 'green',
  },    
});
