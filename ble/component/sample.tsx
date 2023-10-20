import React, {useEffect, useState} from 'react';
import {BleManager, Device} from 'react-native-ble-plx';
import {Button, Text, View, Alert} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

const Sample = () => {
  const [manager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [device, setDevice] = useState<Device | null>(null);

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
          setTimeout(async () => {
            const services = await discoveredDevice.services();
            const SERVICE_UUID = services[0].uuid;
            console.log(
              'SERVICE_UUID',
              services.map(s => s.uuid),
            );
            setTimeout(async () => {
              const characteristics =
                await discoveredDevice.characteristicsForService(SERVICE_UUID);
              const CHARACTERISTIC_UUID = characteristics[0].uuid;
              console.log(
                'CHARACTERISTIC_UUID',
                characteristics.map(c => c.uuid),
              );
            }, 100);
          }, 100);
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
        title="ビーコン発火"
        onPress={() => {
          const deviceId = 'DC:0D:30:14:6C:BD';
          const serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
          const characteristicUUID = '00002a01-0000-1000-8000-00805f9b34fb';

          manager.monitorCharacteristicForDevice(
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

export default Sample;
