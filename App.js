import { Camera, CameraType, getPermissionsAsync } from 'expo-camera';
import { useEffect, useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { uploadImageAsync } from './firebase';
import { Slider } from '@miblanchard/react-native-slider';
import { CameraPreview } from './CameraPreview';
import * as Progress from 'react-native-progress';

export default function App() {
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [imageTaken, setImageTaken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    console.log("No permission!")
  }

  if (!(permission?.granted)) {
    console.log("No permission granted")
  }
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
        setImage(data);
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
        zoom={zoom}
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setUploading(true); 
          uploadImageAsync(image?.uri)
          .then((res) => console.log("Success!"))
          .catch(e => console.log(e))
          .finally(() => setUploading(false))
        }}
      >
        <Text>Upload photo {uploading && " "}
          {uploading && <Progress.Circle style={{ marginLeft: 10}} size={10} indeterminate={true} />}
        </Text>
      </TouchableOpacity>
      <Slider
        value={zoom}
        maximumValue={0.05}
        onValueChange={(val) => {console.log(zoom); setZoom(val[0])}}
      />
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
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
});
