import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { getPermissionsAsync } from 'expo-camera';

export default function App() {
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    console.log("No permission!")
  }

  if (!(permission?.granted)) {
    console.log("No permission granted")
  }
  console.log(permission);
  /*useEffect(() => {
    Camera.requestCameraPermissionsAsync()
          .then((res) => console.log(res));
  }, [])*/

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        zoom={0.001}
        ref={cameraRef}
      >
          <View
              style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              padding: 20,
              justifyContent: 'space-between'
              }}
            >
              <View
              style={{
              alignSelf: 'center',
              flex: 1,
              alignItems: 'center'
              }}
              >
              <TouchableOpacity
                onPress={
                  () => takePicture()
                }
                style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderRadius: 50,
                backgroundColor: '#fff'
                }}
              />
          </View>
        </View>
      </Camera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    height: "90%"
  }
});
