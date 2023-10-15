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
import {PERMISSIONS, request} from 'react-native-permissions';

const App = () => {
  const manager = new BleManager();
  const [state, setState] = React.useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  React.useEffect(() => {
    manager.state().then(state => {
      setState(state);
    });
  });

  return (
    <View>
      <Button
        title={'テスト'}
        onPress={() => {
          const devicesStore: Device[] = [];
          manager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
              console.error('Scanning error:', error);
              return;
            }
            if (scannedDevice) {
              const isExist = devicesStore.some(d => d.id === scannedDevice.id);
              if (isExist === false) {
                devicesStore.push(scannedDevice);
              }
            }
          });
          setTimeout(() => {
            manager.stopDeviceScan();
            setDevices(devicesStore);
            Alert.alert('更新確認');
          }, 5000);
        }}
      />
      <View style={{height: 60}} />
      <Button
        title="リクエスト"
        onPress={() => {
          console.log('aaaa');
          request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(response => {
            if (response === 'granted') {
              // Start scanning
            }
          });
        }}
      />
      <View style={{height: 60}} />
      <Button
        title="確認"
        onPress={() => {
          console.log(devices);
        }}
      />
      <View style={{height: 60}} />
      <Button
        title="ip確認"
        onPress={() => {
          console.log(devices.length);
          devices.map(d => {
            console.log(d.id);
          });
        }}
      />
      <Button
        title="ビーコン接続"
        onPress={() => {
          manager
            .connectToDevice('DC:0D:30:14:6C:BD')
            .then(connectedDevice => {
              setDevice(connectedDevice);
              console.log(
                'Connected to device:',
                connectedDevice.name,
                connectedDevice.id,
              );
            })
            .catch(error => {
              console.error('Connection error:', error);
            });
        }}
      />

      <Button
        title="ビーコン2"
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
          console.log('1');
          setTimeout(async () => {
            const services = await discoveredDevice.services();
            const SERVICE_UUID = services[0].uuid;
            setTimeout(async () => {
              const characteristics =
                await discoveredDevice.characteristicsForService(SERVICE_UUID);
              const CHARACTERISTIC_UUID = characteristics[0].uuid;
              console.log('CHARACTERISTIC_UUID', CHARACTERISTIC_UUID);
              setTimeout(async () => {
                const characteristic =
                  await manager.monitorCharacteristicForDevice(
                    discoveredDevice.id,
                    SERVICE_UUID,
                    CHARACTERISTIC_UUID,
                    (error, characteristic) => {
                      if (error) {
                        console.error('Notification error:', error);
                        return;
                      }
                      if (characteristic) {
                        const notificationData = characteristic.value; // Base64 encoded string
                        setNotification(notificationData);
                      }
                    },
                  );
                console.log('characteristic', characteristic);
              }, 500);
            }, 100);
          }, 100);

          /**
          const services = await discoveredDevice.services();

          const SERVICE_UUID = services[0].uuid;
          console.log('SERVICE_UUID', SERVICE_UUID);

          const characteristics =
            await discoveredDevice.characteristicsForService(SERVICE_UUID);

          const CHARACTERISTIC_UUID = characteristics[0].uuid;
          console.log('CHARACTERISTIC_UUID', CHARACTERISTIC_UUID);
          */
          /**
          const characteristic = await manager.monitorCharacteristicForDevice(
            discoveredDevice.id,
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            (error, characteristic) => {
              if (error) {
                console.error('Notification error:', error);
                return;
              }
              if (characteristic) {
                const notificationData = characteristic.value; // Base64 encoded string
                setNotification(notificationData);
              }
            },
          );
          console.log('characteristic', characteristic);
          */
        }}
      />

      <Button
        title="ビーコン サービス確認"
        onPress={async () => {
          try {
            // Connect to device
            const connectedDevice = await manager.connectToDevice(
              'DC:0D:30:14:6C:BD',
            );

            // Discover all services and characteristics
            const discoveredDevice =
              await connectedDevice.discoverAllServicesAndCharacteristics();

            // Fetch the list of services
            const services = await discoveredDevice.services();

            // Log the UUIDs of all available services
            for (const service of services) {
              console.log(service.uuid);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }}
      />
      <Button
        title="ビーコン確認"
        onPress={() => {
          console.log(device);
        }}
      />
      {/**
      <FlatList
        data={devices}
        renderItem={({item}) => (
          <View>
            <Button
              title={item.name || `${item.id}`}
              onPress={() => {
                console.log(item.id);
                manager
                  .connectToDevice(item.id)
                  .then(connectedDevice => {
                    console.log(
                      'Connected to device:',
                      connectedDevice.name,
                      connectedDevice.id,
                    );
                  })
                  .catch(error => {
                    console.error('Connection error:', error);
                  });
              }}
            />
          </View>
        )}
      />
      */}
    </View>
  );
};

export default App;
