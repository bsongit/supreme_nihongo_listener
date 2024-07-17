import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform , TextInput, Pressable, Image} from 'react-native';
import Voice from '@react-native-voice/voice';
import * as Speech from '../_services/Speech';
import { getDataBaseQuestions } from '../_services/DatabaseService';
import closeIcon from '../assets/icons/close.png';
import { IconButton, MD3Colors } from 'react-native-paper';
import speech_icon from '../assets/icons/mic_external.png';

export default  class QuestionModeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      error: '',
      isRecording: false,
      isRunning: false,
      tagList: ["todos"],
      currentTag: '',
      voices: [],
      allQuestions: [],
      filteredQuestions: [],
      japaneseVoices: [],
      portugueseVoices: [],
      currentQuestionIndex: 0,
      isSpeaking: false,
      iswaiting: false,
      stepCounter: 0,
      wordFilter: '', 
      stopAll: false,
      questionVisible: false,
      answerVisible: false
    };

    Voice.onSpeechStart = this.onRecordingStart;
    Voice.onSpeechEnd = this.onRecordingEnd;
    Voice.onSpeechError = this.onRecordingError;
    Voice.onSpeechResults = this.onRecordingResult;

  }

  componentDidMount(){
    this.updateTagPanel(this.state.tagList);
    this.onGetVoices();
  }

  shuffleComparator() {
    return Math.random() - 0.5;
  }

  stopAll(){
    this.stopRecording().then(res => {
      Voice.destroy().then(Voice.removeAllListeners);
      Speech.stop();
      this.setState({isSpeaking: false, currentQuestionIndex: 0})
    })
  }

  async onGetVoices(){
    try {
      const res = await Speech.voices();
      this.setState({ voices: res });
      this.searchForVoices(res);  
        
    } catch (error) {
      console.log(error)
    }
  }

  updateTagPanel(tagList) {
    this.setState({ tagList });
    this.getQuestions(tagList);
  }

  handleTagChange(e) {
    const currentTag = Platform.OS === 'android' ? e : e.target.value;
    this.setState({ currentTag });
  }

  handleWordFilterChange(e) {
    const wordFilter = Platform.OS === 'android' ? e : e.target.value;
    this.setState({ wordFilter });
    if (wordFilter === "") {
        this.setState({ filteredQuestions: this.state.allQuestions.sort(this.shuffleComparator) });
    }
  }

  addTag() {
    const { tagList, currentTag } = this.state;
    tagList.push(currentTag);
    this.updateTagPanel(tagList);
    this.setState({ currentTag: "" });
}

  filterPhrasesByWord() {
    const { wordFilter, allQuestions } = this.state;
    const filteredQuestions = allQuestions.filter(question => {
        const questionText = `${question.question + question.answer}`.toLowerCase();
        if (wordFilter.includes(' ') && !wordFilter.includes('|')) {
            const [word1, word2] = wordFilter.split(' ');
            return questionText.includes(word1.toLowerCase()) && questionText.includes(word2.toLowerCase());
        } else if (wordFilter.includes('|')) {
            const [word1, word2] = wordFilter.replace(/\s/g, '').split('|');
            return questionText.includes(word1.toLowerCase()) || questionText.includes(word2.toLowerCase());
        } else {
            return questionText.includes(wordFilter.toLowerCase());
        }
    });
    this.setState({ filteredQuestions: filteredQuestions.sort(this.shuffleComparator) });
  }

  getQuestions(tagList) {
    const questions = getDataBaseQuestions(tagList);
    this.setState({ allQuestions: questions, filteredQuestions: questions.sort(this.shuffleComparator) });
  }


  
  searchForVoices(voices) {
    const japaneseVoices = voices.filter(voice => voice.language === 'ja-JP').map(voice => voice.identifier);
    const portugueseVoices = voices.filter(voice => voice.language === 'pt-BR').map(voice => voice.identifier);
    this.setState({ japaneseVoices, portugueseVoices });
  }


  startSpeakers() {
    this.setState({stepCounter: 0, isSpeaking: true})
    if (Platform.OS === 'web' || Platform.OS === 'windows') {
       
    } else if (Platform.OS === 'android') {
        this.speakOnAndroid().then(() => {

          this.waitRecording();
        });
    }
  }

  waitRecording(){
    Speech.isSpeakingAsync().then(res => {
      if(!res){
        this.startRecording().then(res => {
          this.setState({answerVisible: false});
        });
      }
      else{
        this.waitRecording();
      }
    })
  }


  async speakOnAndroid() {
    if(this.state.currentQuestionIndex >= this.state.filteredQuestions.length){
      this.stopAll();
    }
    else{
      try {
          const filteredQuestions = this.state.filteredQuestions;
          const japaneseVoice = this.state.japaneseVoices[Math.floor(Math.random() * this.state.japaneseVoices.length)];
          const portugueseVoice = this.state.portugueseVoices [Math.floor(Math.random() * this.state.portugueseVoices.length)];
          const question = filteredQuestions[this.state.currentQuestionIndex].question.split(filteredQuestions[this.state.currentQuestionIndex].phrase);
          Speech.speak(question[0], { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
          Speech.speak( filteredQuestions[this.state.currentQuestionIndex].phrase, { _voiceIndex: 2, language : filteredQuestions[this.state.currentQuestionIndex].languagePhrase , voice: filteredQuestions[this.state.currentQuestionIndex].languagePhrase === 'pt'? portugueseVoice : japaneseVoice});
          Speech.speak(question[1], { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
      
      } catch (error) {
          console.log(error);
          this.stopAll();
      }
    }
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onRecordingStart = () => {
    this.setState({ isRecording: true });
  };

  onRecordingEnd = () => {
    this.setState({ isRecording: false });
  };

  onRecordingError = (err) => {
    this.setState({ error: err.error });
    this.speechResults('');
  };

  onRecordingResult = (result) => {
    this.setState({ result: result.value[0] });
    this.speechResults(result.value[0]);
  };

  startRecording = async () => {
    try {
      await Voice.start(this.state.filteredQuestions[this.state.currentQuestionIndex].languageAnswer);
    } catch (error) {
      this.setState({ error });
      console.log(error)
    }
  };

  stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      this.setState({ error });
      console.log(error)
    }
  };

  speechResults(result){
      if(result != '' && this.state.filteredQuestions[this.state.currentQuestionIndex].answer.toLowerCase().includes(result)){
          Speech.speak("Parabéns, a resposta está correta. ", { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
          this.setState({currentQuestionIndex: this.state.currentQuestionIndex + 1, answerVisible: true});
          this.startSpeakers();
        }
        // else if(!this.state.filteredQuestions[this.state.currentQuestionIndex].answer.toLowerCase().includes(result) || result == ''){
        //   Speech.speak("Errado, a resposta correta é: ", { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
        //   Speech.speak( this.state.filteredQuestions[this.state.currentQuestionIndex].answer, { _voiceIndex: 2, language : this.state.filteredQuestions[this.state.currentQuestionIndex].languageAnswer, voice: this.state.filteredQuestions[this.state.currentQuestionIndex].languageAnswer === 'pt'? this.state.portugueseVoices[0] : this.state.japaneseVoices[0]});
        //   this.setState({currentQuestionIndex: this.state.currentQuestionIndex + 1})
        //   this.startSpeakers();
        // }
        else{
          Speech.speak("Errado, a resposta correta é: ", { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
          Speech.speak( this.state.filteredQuestions[this.state.currentQuestionIndex].answer.split(',')[0], { _voiceIndex: 2, language : this.state.filteredQuestions[this.state.currentQuestionIndex].languageAnswer, voice: this.state.filteredQuestions[this.state.currentQuestionIndex].languageAnswer === 'pt'? this.state.portugueseVoices[0] : this.state.japaneseVoices[0]});
          this.setState({currentQuestionIndex: this.state.currentQuestionIndex + 1,  answerVisible: true})
          this.startSpeakers();
        }
  }

  render() {
    const { result, error, isRecording } = this.state;


    return !this.state.isSpeaking?

    <View style={styles.container}>
        <Image style={styles.imageIcon} source={speech_icon}></Image>
    <View style={styles.studyContainer}>
        <View style={styles.header}>
            <Text style={styles.headerText}>Configurar estudo de perguntas e respostas</Text>
        </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        onBlur={this.filterPhrasesByWord.bind(this)}
                        style={styles.input}
                        placeholder='Palavra inclusa'
                        onChange={this.handleWordFilterChange.bind(this)}
                        onChangeText={this.handleWordFilterChange.bind(this)}
                        value={this.state.wordFilter}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        onBlur={this.addTag.bind(this)}
                        onChange={this.handleTagChange.bind(this)}
                        onChangeText={this.handleTagChange.bind(this)}
                        style={styles.input}
                        placeholder='Incluir tag'
                        value={this.state.currentTag}
                    />
                </View>
                <View style={styles.tagContainer}>
                    {this.state.tagList.map((tag, index) =>
                        <Pressable
                            key={index}
                            onPress={() => {this.state.tagList.splice(index, 1); this.updateTagPanel(this.state.tagList) }}
                            style={styles.tag}
                        >
                            <Text style={styles.tagText}>{tag}</Text>
                            <Image style={styles.closeIcon} source={closeIcon} />
                        </Pressable>
                    )}
                </View>

    </View>


        <View style={styles.speakerControl}>
            <IconButton
                disabled={this.state.filteredQuestions.length < 1}
                icon={this.state.filteredQuestions.length < 1? 'close' : 'play'}
                mode= "contained"
                iconColor={MD3Colors.error50}
                size={32}
                onPress={() => {this.startSpeakers();}}
            /> 
        </View>
    </View>
    :
      <View style={{ alignItems: 'center', margin: 20 }}>
        <Text style={{ fontSize: 20, color: 'green', fontWeight: '500' }}>
            {this.state.questionVisible? this.state.filteredQuestions[this.state.currentQuestionIndex > 0? this.state.currentQuestionIndex - 1 : 0].question :  this.state.answerVisible? this.state.filteredQuestions[this.state.currentQuestionIndex > 0? this.state.currentQuestionIndex - 1 : 0].answer : '- - - - - - - - - - - - - - - - - -'}
        </Text>
        <Text>{`${result}`}</Text>
        <TouchableOpacity
          disabled={!this.state.isRecording}
          style={{ marginTop: 30 }}
          onPress={() => { this. stopAll()}}
        >
          <Text style={{ color: 'red', fontWeight: 'bold' }}>
            PARAR TUDO
          </Text>
        </TouchableOpacity>
      </View>
  }
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#1f1e1e', 
      flex: 1, 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: 12
  },
  studyContainer:{
      marginTop: 64,
      padding: 12,
      with: '100%',
      borderWidth: 1, 
      borderRadius: 2, 
      borderColor: '#acb8bd'
  },
  imageIcon: {
    position: 'absolute',
    top: 10,
    left: '43%',
    width: 48,
    height: 48
},
  playerContairnerControl: {
      with: '100%',
      borderWidth: 1, 
      borderRadius: 2, 
      borderColor: '#acb8bd',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'

  },
  sidebar: {
      zIndex: 4000, 
      backgroundColor: '#1f1e1e', 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'row'
  },
  sidebarContent: {
      padding: 32, 
      width: '70%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column'
  },
  header: {
      width: '100%', 
      height: 64, 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderWidth: 1, 
      borderRadius: 2, 
      borderColor: '#acb8bd'
  },
  headerText: {
      fontSize: 22, 
      color: '#acb8bd', 
      fontWeight: 'bold'
  },
  inputContainer: {
      marginTop: 32, 
      display: 'flex', 
      flexDirection: 'row', 
      width: '100%', 
      alignItems: 'center'
  },
  input: {
      backgroundColor: '#acb8bd', 
      fontWeight: '400', 
      color: '#1f1e1e', 
      borderWidth: 1, 
      borderRadius: 2, 
      paddingLeft: 12, 
      width: '100%', 
      height: 32, 
      fontSize: 20
  },
  tagContainer: {
      width: '100%', 
      padding: 12,
      marginTop: 0, 
      display: 'flex', 
      flexWrap: 'wrap', 
      flexDirection: 'row'
  },
  tag: {
      marginLeft: 4, 
      marginTop: 12, 
      padding: 12, 
      width: 'auto', 
      height: 48, 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderWidth: 1, 
      borderRadius: 2, 
      borderColor: '#acb8bd'
  },
  tagText: {
      marginLeft: 8, 
      fontSize: 20, 
      color: '#acb8bd', 
      fontWeight: 'bold'
  },
  closeIcon: {
      marginLeft: 12
  },
  checkboxContainer: {
      marginTop: 20, 
      padding: 8, 
      borderWidth: 1, 
      borderColor: '#acb8bd', 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%'
  },
  checkboxGroup: {
      display: 'flex', 
      flexDirection: 'row', 
      width: '100%', 
      alignItems: 'center'
  },
  checkbox: {
      marginLeft: 12, 
      width: 18, 
      height: 18
  },
  checkboxLabel: {
      marginLeft: 8, 
      fontSize: 16, 
      color: '#acb8bd'
  },
  overlay: {
      padding: 32, 
      width: '30%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'rgba(0,0,0,0.1)'
  },
  hamburgerIcon: {
      left: 12, 
      top: 32, 
      position: 'absolute', 
      zIndex: 6000
  },
  hamburgerIconImage: {
      width: 32, 
      height: 32, 
      color: '#acb8bd'
  },
  content: {
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column'
  },
  totalPhrases: {
      marginTop: 96, 
      display: 'flex', 
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  totalPhrasesText: {
      fontSize: 20, 
      color: '#acb8bd', 
      fontWeight: 'bold'
  },
  speakerControl: {
      marginTop: 32, 
      display: 'flex', 
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  stopButton: {
      backgroundColor: 'red', 
      padding: 8
  },
  startButton: {
      backgroundColor: 'blue', 
      padding: 8
  },
  buttonText: {
      fontSize: 24
  },
  phrasesList: {
      marginTop: 32, 
      padding: 12
  },
  phrase: {
      padding: 12, 
      marginTop: 4, 
      borderRadius: 2, 
      width: '100%', 
      height: 500,
      display: 'flex', 
      flexDirection: 'column', 
      borderWidth: 1, 
      borderColor: '#acb8bd',
      justifyContent: 'center',
      alignItems: 'center'
  },
  phraseTextContainer: {
      marginTop: 12
      // display: 'flex', 
      // width: '100%'
  },
  phraseText: {
      fontSize: 24, 
      color: '#acb8bd'
  },
  phraseTranslation: {
      marginTop: 24, 
      fontSize: 16, 
      color: '#acb8bd'
  }
});