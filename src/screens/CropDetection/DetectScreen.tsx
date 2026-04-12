import React, { useRef, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/userStore";

export default function DetectScreen({ navigation }: { navigation: any }) {
  const { addHistory } = useUserStore();

  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950 justify-center items-center px-6">
        <View className="w-24 h-24 bg-slate-900 rounded-full items-center justify-center mb-6 border border-slate-800 shadow-lg">
          <Ionicons name="camera-outline" size={40} color="#34d399" />
        </View>
        <Text className="text-2xl font-bold text-white mb-3 text-center">Camera Access</Text>
        <Text className="text-slate-400 text-center mb-8 px-4">We need camera access to detect diseases on your crop leaves.</Text>
        <Pressable 
          onPress={requestPermission}
          className="bg-emerald-500 px-8 py-4 rounded-2xl active:bg-emerald-600 active:scale-95 transition-all w-full items-center"
        >
          <Text className="text-slate-950 font-extrabold text-base uppercase tracking-wider">Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      setImage(photo.uri);
      if (photo.base64) {
        analyzePhoto(photo.base64, photo.uri);
      }
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5
    });

    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      setImage(asset.uri);
      if (asset.base64) {
        analyzePhoto(asset.base64, asset.uri);
      }
    }
  };

  const analyzePhoto = async (base64Image: string, uri: string) => {
    setIsAnalyzing(true);
    
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      setIsAnalyzing(false);
      setResult({
        disease: "Missing API Key",
        confidence: "0%",
        treatment: "Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file to enable real AI disease detection."
      });
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this crop leaf. Reply with ONLY valid JSON and no markdown formatting. The JSON must exactly match this format: { \"disease\": \"string name of disease or Healthy\", \"confidence\": \"string percentage like 92%\", \"treatment\": \"string brief simple treatment advice\" }. If it's not a leaf/crop, reply with { \"disease\": \"Invalid Image\", \"confidence\": \"0%\", \"treatment\": \"Please upload a clear picture of a crop leaf.\" }" },
              { inline_data: { mime_type: "image/jpeg", data: base64Image } }
            ]
          }]
        })
      });

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      
      let parsed;
      try {
        const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleanJsonStr);
      } catch (e) {
        parsed = {
          disease: "Result",
          confidence: "-",
          treatment: rawText // Print raw output if JSON parsing failed
        };
      }

      const resObj = {
        disease: parsed.disease || "Unknown",
        confidence: parsed.confidence || "Low",
        treatment: parsed.treatment || "Unable to determine treatment."
      };
      
      setResult(resObj);
      
      addHistory({
        id: Date.now().toString(),
        imageUri: uri,
        disease: resObj.disease,
        confidence: resObj.confidence,
        treatment: resObj.treatment,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

    } catch (err) {
      console.log(err);
      setResult({
        disease: "Analysis Failed",
        confidence: "0%",
        treatment: "There was an error communicating with the AI. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      
      {/* HEADER */}
      <View className="px-6 pt-5 pb-4 flex-row items-center z-10 absolute top-10 left-0 right-0 pointer-events-none">
        <View className="bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800/80 backdrop-blur-md">
           <Text className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Disease Scanner</Text>
        </View>
      </View>

      {!image ? (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end items-center pb-12 px-6">
            
            {/* Guide frame overlaid on camera */}
            <View className="absolute top-1/4 bottom-1/3 left-10 right-10 border-2 border-emerald-500/50 rounded-3xl items-center justify-center pointer-events-none">
              <View className="w-8 h-8 border-t-4 border-l-4 border-emerald-400 absolute top-0 left-0 rounded-tl-xl" />
              <View className="w-8 h-8 border-t-4 border-r-4 border-emerald-400 absolute top-0 right-0 rounded-tr-xl" />
              <View className="w-8 h-8 border-b-4 border-l-4 border-emerald-400 absolute bottom-0 left-0 rounded-bl-xl" />
              <View className="w-8 h-8 border-b-4 border-r-4 border-emerald-400 absolute bottom-0 right-0 rounded-br-xl" />
            </View>

            <View className="bg-slate-950/80 w-full p-6 rounded-[32px] border border-slate-800/80 backdrop-blur-lg flex-col shadow-2xl items-center">
              <Text className="text-slate-300 font-medium mb-6 text-center text-sm">Position the crop leaf within the frame</Text>
              
              <View className="flex-row w-full justify-between items-center gap-4">
                <Pressable
                  onPress={pickImage}
                  className="bg-slate-800/80 h-16 w-16 rounded-2xl items-center justify-center border border-slate-700 active:bg-slate-700 transition-colors"
                >
                  <Ionicons name="images-outline" size={24} color="#94a3b8" />
                </Pressable>

                <Pressable
                  onPress={takePhoto}
                  className="w-20 h-20 rounded-full bg-slate-800 border-4 border-slate-700 items-center justify-center active:scale-95 transition-transform"
                >
                  <View className="w-14 h-14 bg-emerald-500 rounded-full border-2 border-slate-950" />
                </Pressable>

                <View className="w-16 h-16" /> {/* Placeholder for balance */}
              </View>
            </View>

          </View>
        </CameraView>
      ) : (
        <View className="flex-1 px-6 pt-20">
          
          <View className="rounded-[32px] overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl mb-6 absolute top-24 left-6 right-6">
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 320 }}
              className="opacity-90"
            />
            {isAnalyzing && (
              <View className="absolute inset-0 bg-slate-950/70 justify-center items-center">
                <ActivityIndicator size="large" color="#34d399" />
                <Text className="text-emerald-400 font-bold mt-4 tracking-widest uppercase text-xs">Analyzing Leaf Data...</Text>
              </View>
            )}
          </View>

          {!isAnalyzing && result && (
            <View className="bg-slate-900 absolute top-[400px] left-6 right-6 p-6 rounded-[32px] border border-slate-800 shadow-xl">
              
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Detected Issue</Text>
                  <Text className="text-white font-extrabold text-2xl">{result.disease}</Text>
                </View>
                <View className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <Text className="text-emerald-400 font-bold text-xs uppercase">{result.confidence}</Text>
                </View>
              </View>
              
              <View className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 mb-6">
                <Text className="font-bold text-emerald-400 mb-2 text-xs uppercase tracking-wider">Recommended Treatment</Text>
                <Text className="text-slate-300 text-sm leading-6">{result.treatment}</Text>
              </View>

              <Pressable
                onPress={resetScanner}
                className="bg-emerald-500 py-4 rounded-2xl items-center shadow-lg shadow-emerald-500/20 active:scale-95 active:bg-emerald-600 transition-all w-full"
              >
                <Text className="text-slate-950 font-extrabold text-base uppercase tracking-wider">
                  Scan Another Leaf
                </Text>
              </Pressable>

            </View>
          )}

        </View>
      )}

    </SafeAreaView>
  );
}