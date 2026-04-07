import React, { useRef, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function CropDiseaseScreen() {

  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Camera permission required</Text>
        <Pressable onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    setImage(photo.uri);
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white">

      {!image ? (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end items-center pb-10">

            <Pressable
              onPress={takePhoto}
              className="bg-green-700 px-8 py-4 rounded-full"
            >
              <Text className="text-white font-bold">
                Capture Leaf
              </Text>
            </Pressable>

            <Pressable
              onPress={pickImage}
              className="mt-3 bg-gray-200 px-6 py-2 rounded-full"
            >
              <Text>Pick From Gallery</Text>
            </Pressable>

          </View>
        </CameraView>
      ) : (
        <View className="flex-1 p-5">

          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 300 }}
            className="rounded-xl"
          />

          <Pressable
            onPress={() => setImage(null)}
            className="bg-green-700 p-4 rounded-lg mt-5"
          >
            <Text className="text-white text-center">
              Scan Another Leaf
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}