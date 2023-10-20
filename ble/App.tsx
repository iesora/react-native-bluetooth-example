import React, {useEffect, useState} from 'react';
import {
  Button,
  Text,
  View,
  DeviceEventEmitter,
  PermissionsAndroid,
  FlatList,
  Alert,
} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import Sample from './component/sample';

const App = () => {
  const [manager] = useState(new BleManager());

  useEffect(() => {
    const deviceId = 'DC:0D:30:14:6C:BD';
    const serviceUUID = '00001801-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a05-0000-1000-8000-00805f9b34fb';

    let monitorSubscription;
    const setupConnection = async () => {
      try {
        // デバイスと接続
        const connectedDevice = await manager.connectToDevice(deviceId);
        console.log(
          'Connected to device:',
          connectedDevice.name,
          connectedDevice.id,
        );

        // サービスとキャラクタリスティックの発見
        await connectedDevice.discoverAllServicesAndCharacteristics();

        // キャラクタリスティックを監視
        monitorSubscription = manager.monitorCharacteristicForDevice(
          deviceId,
          serviceUUID,
          characteristicUUID,
          (error, characteristic) => {
            if (error) {
              console.error('Monitoring error:', error);
              return;
            }
            console.log('Received data:', characteristic?.value);
          },
        );
      } catch (error) {
        console.error('Connection or discovery error:', error);
      }
    };

    setupConnection();

    // コンポーネントがアンマウントされるとき、監視と接続を停止する
    return () => {
      manager.cancelDeviceConnection(deviceId);
    };
  }, [manager]);

  /**
  const connectToDevice = async () => {
    try {
      const connectedDevice = await manager.connectToDevice(device);
      console.log(
        'Connected to device:',
        connectedDevice.name,
        connectedDevice.id,
      );
    } catch (error) {
      console.error('Connection error:', error);
    }
  };
  */
  /**
  useEffect(() => {
    const deviceId = 'DC:0D:30:14:6C:BD';
    const serviceUUID = '00001800-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a00-0000-1000-8000-00805f9b34fb';

    const subscription = manager.monitorCharacteristicForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Monitoring error:', error);
          return;
        }

        console.log('Received data:', characteristic?.value);
      },
    );

    // コンポーネントがアンマウントされるとき、監視を停止する
    return () => {
      subscription.remove();
    };
  }, [manager]);

   */

  /**
  useEffect(() => {
    const deviceId = 'DC:0D:30:14:6C:BD';
    const serviceUUID = '00001800-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a00-0000-1000-8000-00805f9b34fb';
    const subscription = manager.monitorCharacteristicForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error('Monitoring error:', error);
          return;
        }

        console.log('Received data:', characteristic.value);
      },
    );

    // コンポーネントがアンマウントされるとき、監視を停止する
    return () => {
      subscription.remove();
    };
  }, [manager]);
  */

  return (
    <>
      <Sample />
      <Button
        title="キャラクタID"
        onPress={async () => {
          const connectedDevice = await manager.connectToDevice(
            'DC:0D:30:14:6C:BD',
          );
          console.log(
            'Connected to device:',
            connectedDevice.name,
            connectedDevice.id,
          );

          const discoveredDevice =
            await connectedDevice.discoverAllServicesAndCharacteristics();

          setTimeout(async () => {
            const characteristics =
              await discoveredDevice.characteristicsForService(
                '0000fef5-0000-1000-8000-00805f9b34fb',
              );
            console.log(
              'CHARACTERISTIC_UUID',
              characteristics.map(c => c.uuid),
            );
          }, 1000);

          /**
        setTimeout(async () => {
          const characteristics =
            await discoveredDevice.characteristicsForService(
              '00001800-0000-1000-8000-00805f9b34fb',
            );
          console.log(
            'CHARACTERISTIC_UUID',
            characteristics.map(c => c.uuid),
          );
        }, 100);
        */
        }}
      />
    </>
  );
};

export default App;
