import * as ExpoSpeech from 'expo-speech';
import {Platform} from 'react-native';

    export const voices = ExpoSpeech.getAvailableVoicesAsync;

    export function speak(text, options){
        if(Platform.OS == 'ios'){}
        else if(Platform.OS == 'android'){
            ExpoSpeech.speak(text, options,);
        }
        else if(Platform.OS == 'macos'){}
        else if(Platform.OS == 'windows'){
            ExpoSpeech.speak(text, options);
        }
        else if(Platform.OS == 'web'){
            ExpoSpeech.speak(text, options);
        }
    }

    
    export function stop(){
        if(Platform.OS == 'ios'){}
        else if(Platform.OS == 'android'){
            ExpoSpeech.stop();
        }
        else if(Platform.OS == 'macos'){}
        else if(Platform.OS == 'windows'){
            ExpoSpeech.stop();
        }
        else if(Platform.OS == 'web'){
            ExpoSpeech.stop();
        }
    }


    export async function isSpeakingAsync(){
        if(Platform.OS == 'ios'){}
        else if(Platform.OS == 'android'){
            try {
                return ExpoSpeech.isSpeakingAsync().then(result => result);
            } catch (error) {
                console.log(error)
            }
        }
        else if(Platform.OS == 'macos'){}
        else if(Platform.OS == 'windows'){
            try {
                return ExpoSpeech.isSpeakingAsync().then(result => result);
            } catch (error) {
                console.log(error)
            }
        }
        else if(Platform.OS == 'web'){
            try {
                return ExpoSpeech.isSpeakingAsync().then(result => result);
            } catch (error) {
                console.log(error)
            }

        }
    }
