/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    BleManager.start({showAlert: false});

    const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
    const subscription = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    BleManager.scan([], 5, true).then(() => console.log('Scanning...'));

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDiscoverPeripheral = (peripheral: any) => {
    console.log('Discovered new peripheral:', peripheral);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View
        style={{
          width: 500,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            backgroundColor: 'red',
            width: 300,
            height: 100,
          }}
          onPress={async () => {
            BleManager.scan([], 5, true).then(() => {
              console.log('Scanning...');
            });
          }}>
          <Text>Scan Bluetooth Dev ices </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
