import {useEffect, useState } from 'react';
import {View} from 'react-native';

export function NavigationContainer(props) {
    const [componentChildren, setComponentChildren] = useState(<View></View>);

    useEffect(() => {
            props.children.map(children => {
                if(children.props.name == props.navigation.historic[props.navigation.historic.length -1]){
                    setComponentChildren(children)
                }
              
            })
      });

    return(componentChildren)
}

export function NavigationScreen(props) {
    return(new props.component(props))
}