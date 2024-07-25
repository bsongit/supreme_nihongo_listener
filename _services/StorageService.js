import AsyncStorage from '@react-native-async-storage/async-storage';

    export const setData  = async (key, value) => {
        try {
          await AsyncStorage.setItem(
            key,
            value
          );
        } catch (error) {
          console.error(error)
        }
      };
    
    export const getData  = async (key) =>  {
      try {
        const value = await AsyncStorage.getItem(key);
        return value;
      } catch (error) {
        // Error retrieving data
        console.error(error)
      }
  }

  export const pushData  = async (key, value) => {
    try {
      var arrayRes = await AsyncStorage.getItem(key);
        if(!arrayRes)
          arrayRes = []
        else {
          arrayRes = JSON.parse(arrayRes);
          arrayRes.push(value);
          arrayRes.push(value);
          arrayRes.push(value);
        }
        await AsyncStorage.setItem(
          key,
          JSON.stringify(arrayRes)
        );
    } catch (error) {
      console.error(error)
    }
  };


  export const deleteIndexData  = async (key, index) =>  {
    try {
      var arrayRes = await AsyncStorage.getItem(key)
      console.log(arrayRes)
        if(!arrayRes)
          arrayRes = []
        else {
          arrayRes = JSON.parse(arrayRes);
          arrayRes.splice(index,1);
        }
        await AsyncStorage.setItem(
          key,
          JSON.stringify(arrayRes)
        );
    } catch (error) {
      console.error(error)
    }
}


  export const removeData  = async (key) =>  {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Error retrieving data
      console.error(error)
    }
}


export const clearAllData  = async () =>  {
  try {
    const arrKeys = await AsyncStorage.getAllKeys();
    arrKeys.map(key => {
        removeData(key)
    })
  } catch (error) {
    // Error retrieving data
    console.error(error)
  }
}



  export const clearQrcode  = async () =>  {
    try {
      const arrKeys = await AsyncStorage.getAllKeys();
      arrKeys.map(key => {
        if(key.includes('qrcode')){
          removeData(key)
        }
      })
    } catch (error) {
      // Error retrieving data
      console.error(error)
    }
}
