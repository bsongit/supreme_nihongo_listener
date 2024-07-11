import * as React from 'react';
import Checkbox from 'expo-checkbox';
import { Platform, View, Pressable, Text, Image, TextInput } from 'react-native';
import * as Speech from '../_services/Speech';
import closeIcon from '../assets/icons/close.png';
import { getDataBase } from '../_services/DatabaseService';
import { IconButton, MD3Colors } from 'react-native-paper';

export default class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPhrase: {pt: "", jp: ""},
            isSpeaking: false,
            iswaiting: false,
            speechInterval: null,
            speechIntervalCounter: 0,
            wordFilter: "",
            allPhrases: [],
            filteredPhrases: [],
            voices: [],
            japaneseVoices: [],
            portugueseVoices: [],
            translateFirst: false,
            showAll: true,
            currentTag: "",
            tagList: ["todos"],
            tagPanel: []
        };
    }

    componentDidMount() {
        this.updateTagPanel(this.state.tagList);
        Speech.voices().then(res => {
            this.setState({ voices: res });
            this.searchForVoices(res);
        });
    }

    getPhrases(tagList) {
        const phrases = getDataBase(tagList);
        this.setState({ allPhrases: phrases, filteredPhrases: phrases });
    }

    searchForVoices(voices) {
        const japaneseVoices = voices.filter(voice => voice.language === 'ja-JP').map(voice => voice.identifier);
        const portugueseVoices = voices.filter(voice => voice.language === 'pt-BR').map(voice => voice.identifier);
        this.setState({ japaneseVoices, portugueseVoices });
    }

    startSpeakers() {
        this.setState({ isSpeaking: true, iswaiting: true, currentPhrase: this.state.filteredPhrases[0] });
        if (Platform.OS === 'web' || Platform.OS === 'windows') {
            this.speakOnWeb();
        } else if (Platform.OS === 'android') {
            this.speakOnAndroid();
        }
    }

    speakOnWeb() {
        Speech.speak('Começando estudo!');
        Speech.voices().then(res => {
            this.setState({ voices: res });
            this.searchForVoices(res);
        });

        this.setSpeechInterval(6000);
    }

    async speakOnAndroid() {
        try {
            const voices = await Speech.voices();
            this.setState({ voices });
            this.searchForVoices(voices);
            this.setSpeechInterval(6000);
        } catch (error) {
            console.log(error);
        }
    }

    setSpeechInterval(intervalTime) {
        this.setState({ speechInterval: setInterval(() => {
       
            if (this.state.speechIntervalCounter >= this.state.filteredPhrases.length) {
                clearInterval(this.state.speechInterval);
                this.setState({ isSpeaking: false, speechIntervalCounter: 0 });
            } else {
                const phrase = this.state.filteredPhrases[this.state.speechIntervalCounter];
                const japaneseVoice = this.state.japaneseVoices[Math.floor(Math.random() * this.state.japaneseVoices.length)];
                const portugueseVoice = this.state.portugueseVoices [Math.floor(Math.random() * this.state.portugueseVoices.length)];
                if(this.state.translateFirst === true){
                    Speech.speak(phrase.pt, { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
                }
                else{
                    Speech.speak(phrase.jp, { _voiceIndex: Math.floor(1 + Math.random() * 4), language : "ja", voice: japaneseVoice });
                }
                const tempInterval = setInterval(() => {
                    if(this.state.translateFirst === false){
                        Speech.speak(phrase.pt, { _voiceIndex: 2, language : "pt", voice: 'pt-br-x-ptd-local' });
                    }
                    else{
                        Speech.speak(phrase.jp, { _voiceIndex: Math.floor(1 + Math.random() * 4), language : "ja", voice: japaneseVoice });
                    }
                    this.setState({ speechIntervalCounter: this.state.speechIntervalCounter + 1, iswaiting: false , currentPhrase: phrase});
                    clearInterval(tempInterval);
                },1000)


            }
        }, intervalTime) });
    }

    stopSpeakers() {
        Speech.stop();
        clearInterval(this.state.speechInterval);
        this.setState({ isSpeaking: false, speechIntervalCounter: 0 });
    }

    handleWordFilterChange(e) {
        const wordFilter = Platform.OS === 'android' ? e : e.target.value;
        this.setState({ wordFilter });
        if (wordFilter === "") {
            this.setState({ filteredPhrases: this.state.allPhrases });
        }
    }

    filterPhrasesByWord() {
        const { wordFilter, allPhrases } = this.state;
        const filteredPhrases = allPhrases.filter(phrase => {
            const phraseText = `${phrase.jp + phrase.pt}`.toLowerCase();
            if (wordFilter.includes(' ') && !wordFilter.includes('|')) {
                const [word1, word2] = wordFilter.split(' ');
                return phraseText.includes(word1.toLowerCase()) && phraseText.includes(word2.toLowerCase());
            } else if (wordFilter.includes('|')) {
                const [word1, word2] = wordFilter.replace(/\s/g, '').split('|');
                return phraseText.includes(word1.toLowerCase()) || phraseText.includes(word2.toLowerCase());
            } else {
                return phraseText.includes(wordFilter.toLowerCase());
            }
        });
        this.setState({ filteredPhrases: filteredPhrases });
    }

    handleCheckboxTranslateFirstChange(value) {
        this.setState({ translateFirst: value });
    }

    handleTagChange(e) {
        const currentTag = Platform.OS === 'android' ? e : e.target.value;
        this.setState({ currentTag });
    }

    addTag() {
        const { tagList, currentTag } = this.state;
        tagList.push(currentTag);
        this.updateTagPanel(tagList);
        this.setState({ currentTag: "" });
    }

    updateTagPanel(tagList) {
        this.setState({ tagList });
        this.getPhrases(tagList);
    }

    render() {
        return !this.state.isSpeaking?
                <View style={styles.container}>
                <View style={styles.studyContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Configurar estudo de escuta</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                                <View style={styles.checkboxGroup}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={this.state.translateFirst}
                                        onValueChange={this.handleCheckboxTranslateFirstChange.bind(this)}
                                    />
                                    <Text style={styles.checkboxLabel}>Tradução primeiro</Text>
                                </View>
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
                                        onPress={() => { this.state.tagList.splice(index, 1); this.updateTagPanel(this.state.tagList) }}
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
                            disabled={this.state.filteredPhrases.length < 1}
                            icon={this.state.filteredPhrases.length < 1? 'close' : 'play'}
                            mode= "contained"
                            iconColor={MD3Colors.error50}
                            size={32}
                            onPress={() => { this.startSpeakers() }}
                        /> 
                    </View>
                </View>
                : 
                <View style={styles.container}>

                    <View style={styles.studyContainer}>
                            <View key={this.state.speechIntervalCounter} style={styles.phrase}>
                                <View >
                                    <Text style={styles.phraseText}>{this.state.currentPhrase.jp}</Text>
                                </View>
                                <View >
                                    <Text style={styles.phraseTranslation}>{this.state.currentPhrase.pt}</Text>
                                </View>
                            </View>
                    </View>

                    <View style={styles.playerContairnerControl}>
                        {this.iswaiting? 
                            <IconButton
                                 icon="loading"
                                 mode= "contained"
                                 iconColor={MD3Colors.error50}
                                 size={32}
                                 onPress={() => this.stopSpeakers()}
                             />
                        :
                        <IconButton
                            icon="stop"
                            mode= "contained"
                            iconColor={MD3Colors.error50}
                            size={32}
                            onPress={() => this.stopSpeakers()}
                        />}
                    </View>
                    <View style={styles.phraseTextContainer}>
                        <Text style={styles.phraseText}>{this.state.speechIntervalCounter} / {this.state.filteredPhrases.length}</Text>
                    </View>

                </View>
                
    }
}

const styles = {
    container: {
        backgroundColor: '#1f1e1e', 
        flex: 1, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: 12
    },
    studyContainer:{
        marginTop: 32,
        padding: 12,
        with: '100%',
        borderWidth: 1, 
        borderRadius: 2, 
        borderColor: '#acb8bd'
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
};