import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

export default class QuestionModeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: [],
      showRecordButton: true
    };
  }


  componentDidMount() {
    console.log(Voice.isAvailable())
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechResults = this.onSpeechResults;
  }


  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }


  onSpeechStart = (e) => {
    this.setState({ started: '√' });
  };

  onSpeechRecognized = (e) => {
    this.setState({ recognized: '√' });
  };

  onSpeechResults = (e) => {
    this.setState({ results: e.value });
  };

  startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      this.setState({
        recognized: '',
        started: '',
        results: []
      });
    } catch (e) {
      console.error(e);
    }
  };

  stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      this.setState({
        recognized: '',
        started: '',
        results: []
      });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { recognized, started, results } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Press the button and start speaking.
        </Text>
        {this.state.showRecordButton? 
              <Button
                onPress={this.startRecognizing}
                title="Start Recognizing"
              />
        
        : <View></View>}

        <Button
          onPress={this.stopRecognizing}
          title="Stop Recognizing"
        />
        <Button
          onPress={this.cancelRecognizing}
          title="Cancel"
        />
        <Button
          onPress={this.destroyRecognizer}
          title="Destroy"
        />
        <Text style={styles.stat}>{`Started: ${started}`}</Text>
        <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
        <Text style={styles.stat}>{`Results: ${results.join(', ')}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
});