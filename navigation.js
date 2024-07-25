import {useState } from 'react';
import {NavigationContainer, NavigationScreen} from './_components/Navigation';
import MainScreen from './_pages/MainScreen';
import FailScreen from './_pages/FailScreen';
import QuestionModeScreen from './_pages/QuestionModeScreen';
import MistakeModeScreen from './_pages/MistakeModeScreen';


export default function AppNavigator() {

  const [historic, setHistoric] = useState(['MainScreen']);
  const navigation = {historic, setHistoric, push : (value) => {setHistoric([...historic,value])}};

  return ( 
          <NavigationContainer navigation={navigation}>
            <NavigationScreen navigation={navigation} name="MainScreen" component={MainScreen}></NavigationScreen>
            <NavigationScreen navigation={navigation} name="QuestionModeScreen" component={QuestionModeScreen}></NavigationScreen>
            <NavigationScreen navigation={navigation} name="MistakeModeScreen" component={MistakeModeScreen}></NavigationScreen>
            <NavigationScreen navigation={navigation} name="FailScreen" component={FailScreen}></NavigationScreen>
          </NavigationContainer>
  );
}