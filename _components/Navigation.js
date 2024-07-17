import React, { useEffect, useState } from 'react';
import Drawer from './Drawer';
import listen_icon from '../assets/icons/hearing_24.png';
import speech_icon from '../assets/icons/mic_external.png';

export function NavigationContainer(props) {
  const [currentComponent, setCurrentComponent] = useState(null);

  const navigationItems = [
    { title: 'Treino de escuta', icon: listen_icon, action: () => { props.navigation.push('MainScreen'); updateComponent(); }},
    { title: 'Treino de respostas', icon: speech_icon,  action: () => { props.navigation.push('QuestionModeScreen'); updateComponent(); }},
  ];

  const updateComponent = () => {
    const currentScreenName = props.navigation.historic[props.navigation.historic.length - 1];
    const screenComponent = props.children.find(child => child.props.name === currentScreenName);
    setCurrentComponent(screenComponent);
  };

  useEffect(() => {
    updateComponent();
  }, [props.navigation.historic]);

  return (
    <Drawer navigationItems={navigationItems}>
      {currentComponent && <NavigationScreen key={currentComponent.props.name} {...currentComponent.props} />}
    </Drawer>
  );
}

export function NavigationScreen(props) {
  useEffect(() => {

  }, [props.navigation.historic]);

  return React.createElement(props.component, props);
}