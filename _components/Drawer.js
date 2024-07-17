import React, { useRef, useState } from 'react';
import { View, Text, Button, Animated, PanResponder, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';
import logo from '../assets/icons/logo.png';

const { width } = Dimensions.get('window');

const Drawer = ({ navigationItems, children }) => {
  const drawerWidth = 300;
  const panX = useRef(new Animated.Value(-drawerWidth)).current;
  const [isOpen, setIsOpen] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: panX }], { useNativeDriver: false }),
      onPanResponderRelease: (e, { dx }) => {
        if (dx > 100) {
          openDrawer();
        } else {
          closeDrawer();
        }
      },
    })
  ).current;

  const openDrawer = () => {
    Animated.timing(panX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsOpen(true);
    });
  };

  const closeDrawer = () => {
 
    Animated.timing(panX, {
      toValue: -drawerWidth,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsOpen(false);
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: panX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.drawerHeader}>
          <Image style={styles.drawerHeaderImage} source={logo}></Image>
        </View>
        <View style={styles.drawerButtonsView}>
          {navigationItems.map((item, index) => (

          <TouchableOpacity key={index} style={styles.itemButton} onPress={() => {
            item.action();
            closeDrawer();
          }}>
            <Text style={styles.drawerButtonsText} >{item.title}</Text>
            <Image style={styles.drawerButtonsImage} source={item.icon}></Image>
          </TouchableOpacity>
          ))}
            
        </View>

      </Animated.View>
      <View style={styles.content}>
        {children}
        <IconButton
            style={styles.menuButton}
            icon="menu"
            mode= "outlined"
            iconColor={MD3Colors.tertiary99}
            size={32}
            onPress={openDrawer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    elevation: -1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 0,
    zIndex: 6000

  },
  drawerHeader: {
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerHeaderImage: {
    width: 96,
    height: 96
  },

  drawerButtonsView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  drawerButtonsImage: {
    width: 24,
    height: 24
  },

  drawerButtonsText: {
    fontSize: 20,
    color: '#1f1e1e'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  menuButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  itemButton: {
    padding: 6,
    marginTop: 6,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderRadius: 2,
    borderBlockColor: '#acb8bd',
    justifyContent: 'space-between'
  }
});

export default Drawer;