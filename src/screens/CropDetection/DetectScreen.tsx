import React, { useRef, useState } from "react";
import { View, Text, Image, Pressable, ActivityIndicator, Switch, ScrollView, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useUserStore } from "../../store/userStore";
import { geminiModel } from "../../services/gemini"; // Using your reliable SDK
import { supabase } from "../../services/supabase";
import { uriToBlob, base64ToArrayBuffer } from "../../utils/fileUtils";

export default function DetectScreen({ navigation }: { navigation: any }) {
  const { addHistory, preferredLanguage } = useUserStore();
  const cameraRef = useRef<any>(null);

  const isFocused = useIsFocused();

  const [permission, requestPermission] = useCameraPermissions();
  const [useEnglish, setUseEnglish] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isPosting, setIsPosting] = useState(false);

  if (!permission) {
    return <View className="flex-1 bg-agro-earth-50" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-agro-earth-50 justify-center items-center px-6">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-6 border border-agro-earth-100 shadow-lg shadow-agro-green-950/5">
          <Ionicons name="camera-outline" size={40} color="#3e8e3e" />
        </View>
        <Text className="text-2xl font-black text-agro-green-950 mb-3 text-center">Camera Access</Text>
        <Text className="text-agro-earth-600 font-bold text-center mb-8 px-4">We need camera access to detect diseases on your crop leaves.</Text>
        <Pressable
          onPress={requestPermission}
          className="bg-agro-green-600 px-8 py-4 rounded-2xl active:bg-agro-green-700 active:scale-95 transition-all w-full items-center shadow-lg shadow-agro-green-600/20"
        >
          <Text className="text-white font-black text-base uppercase tracking-wider">Grant Permission</Text>
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

    if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
      setIsAnalyzing(false);
      setResult({
        disease: "Missing API Key",
        confidence: "0%",
        treatment: "Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.",
        plantDetails: "-",
        improvementTips: "-",
        pestAndDiseaseInfo: "-"
      });
      return;
    }

    try {
      const activeLanguage = useEnglish || !preferredLanguage ? 'English' : preferredLanguage;

      const prompt = `Analyze this image carefully. First, determine if the main subject is a plant, leaf, or crop. 
      Reply with ONLY valid JSON and no markdown formatting. The JSON must exactly match this format: { "disease": "string", "confidence": "string", "treatment": "string", "plantDetails": "string", "improvementTips": "string", "pestAndDiseaseInfo": "string" }.
      
      RULES:
      1. If the image IS a plant leaf/crop: 
         - "disease": The name of the disease or 'Healthy'. (in ${activeLanguage})
         - "confidence": The confidence percentage (e.g., '92%').
         - "treatment": Brief, actionable treatment advice. (in ${activeLanguage})
         - "plantDetails": Professional detail of the plant, what it needs, supplements, fertilizers, and irrigation. (in ${activeLanguage})
         - "improvementTips": How to improve its growth effectively. (in ${activeLanguage})
         - "pestAndDiseaseInfo": What pests or diseases it is prone to in which season and how to protect/cure it. (in ${activeLanguage})
      
      2. If the image IS NOT a plant: 
         - "disease": "Not a Plant" (in ${activeLanguage})
         - "confidence": "N/A"
         - "treatment": "Our AI detected an object. Please upload a clear image of a crop leaf." (in ${activeLanguage})
         - "plantDetails": "N/A"
         - "improvementTips": "N/A"
         - "pestAndDiseaseInfo": "N/A"
         
      CRITICAL: The keys MUST remain in English ("disease", "confidence", "treatment", "plantDetails", "improvementTips", "pestAndDiseaseInfo"), but the VALUES must strictly be in ${activeLanguage}.`;

      // const temp =   const prompt = `Analyze this crop leaf image.
      // Output strictly JSON (no markdown, no text) in this schema:
      // {
      //   "disease": "Detected disease or 'Healthy'",
      //   "confidence": "Certainty percentage",
      //   "treatment": "Actionable treatment advice",
      //   "plantDetails": "Details about plant care, soil, and water",
      //   "improvementTips": "Growth and yield optimization tips",
      //   "pestAndDiseaseInfo": "Seasonal risks and prevention"
      // }
      // Rules: Values must be in ${activeLanguage}. Keys must stay in English as defined above.`;


      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      };

      const resultObj = await geminiModel.generateContent([prompt, imagePart]);
      const rawText = await resultObj.response.text();

      let parsed;
      try {
        const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleanJsonStr);
      } catch (e) {
        parsed = {
          disease: "Parsing Error",
          confidence: "-",
          treatment: "Failed to read the AI response properly.",
          plantDetails: "-",
          improvementTips: "-",
          pestAndDiseaseInfo: "-"
        };
      }

      const resObj = {
        disease: parsed.disease || "Unknown",
        confidence: parsed.confidence || "Low",
        treatment: parsed.treatment || "Unable to determine treatment.",
        plantDetails: parsed.plantDetails || "Details unavailable.",
        improvementTips: parsed.improvementTips || "Tips unavailable.",
        pestAndDiseaseInfo: parsed.pestAndDiseaseInfo || "Info unavailable."
      };

      setResult(resObj);

      if (resObj.confidence !== "N/A" && resObj.confidence !== "0%") {
        // --- NEW: PERSIST SCAN TO DATABASE ---
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            // 1. Upload image to Storage
            const fileName = `scan_${Date.now()}.jpg`;
            
            // Use base64ToArrayBuffer - most compatible on Android
            const arrayBuffer = base64ToArrayBuffer(base64Image);
            
            const { data: uploadData, error: storageError } = await supabase.storage
              .from('images')
              .upload(fileName, arrayBuffer, { contentType: 'image/jpeg' });

            if (storageError) throw storageError;

            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(fileName);

            // 2. Save to disease_reports
            await supabase.from('disease_reports').insert({
              user_id: session.user.id,
              disease_name: resObj.disease,
              confidence_score: parseFloat(resObj.confidence.replace('%', '')),
              treatment: resObj.treatment,
              image_url: urlData.publicUrl,
              detected_on: new Date().toISOString()
            });
          } catch (dbErr) {
            console.error("Database save error:", dbErr);
          }
        }

        addHistory({
          id: Date.now().toString(),
          imageUri: uri,
          disease: resObj.disease,
          confidence: resObj.confidence,
          treatment: resObj.treatment,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }

    } catch (err) {
      console.log("Scanner Error:", err);
      setResult({
        disease: "Analysis Failed",
        confidence: "0%",
        treatment: "There was an error communicating with the AI. Please try again.",
        plantDetails: "-",
        improvementTips: "-",
        pestAndDiseaseInfo: "-"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePostBlog = async () => {
    if (!result) return;
    setIsPosting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert("Error", "You must be logged in to post a blog.");
        return;
      }

      const content = `Based on my crop scan:\n\n**Detected Status**: ${result.disease} (Confidence: ${result.confidence})\n\n**Actionable Treatment**:\n${result.treatment}\n\n**Plant Care Details**:\n${result.plantDetails}\n\n**Improvement Tips**:\n${result.improvementTips}\n\n**Pest & Disease Outlook**:\n${result.pestAndDiseaseInfo}`;

      const { error } = await supabase.from('blogs').insert({
        title: `Crop Scan: ${result.disease === 'Healthy' ? 'Healthy Check' : result.disease}`,
        content: content,
        category: 'Crop Tips',
        image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800',
        author_name: useUserStore.getState().name || session.user.email?.split('@')[0] || 'Anonymous',
        author_id: session.user.id,
      });

      if (error) throw error;

      Alert.alert("Success! 🎉", "Your comprehensive scan analysis was posted as a blog. You can view & edit it from the Blogs tab.", [
        { text: "View Blogs", onPress: () => navigation.navigate("Blogs") },
        { text: "OK", style: "cancel" }
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsPosting(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <View className="px-6 pt-4 pb-4 border-b border-agro-earth-100 flex-row items-center justify-between bg-white/50 z-20">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 bg-white rounded-full border border-agro-earth-200 shadow-sm active:scale-95 transition-all"
          >
            <Ionicons name="arrow-back" size={24} color="#3e8e3e" />
          </Pressable>
          <View>
            <Text className="text-xl font-black text-agro-green-950 tracking-tight">
              Disease <Text className="text-agro-green-600">Scanner</Text>
            </Text>
            <Text className="text-agro-earth-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              AI Analysis
            </Text>
          </View>
        </View>

        {/* LANGUAGE TOGGLE */}
        {Boolean(preferredLanguage && preferredLanguage.toLowerCase() !== 'english') && (
          <View className="items-center bg-white py-1 px-3 rounded-xl border border-agro-earth-100 shadow-sm">
            <Text className="text-[8px] text-agro-earth-500 font-bold mb-0.5 uppercase tracking-widest">
              {useEnglish ? 'English' : preferredLanguage}
            </Text>
            <Switch
              value={useEnglish}
              onValueChange={setUseEnglish}
              trackColor={{ false: '#3e8e3e', true: '#e5e2d9' }}
              thumbColor="#f8fafc"
              style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }], height: 16 }}
            />
          </View>
        )}
      </View>

      {!image && isFocused ? (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end items-center pb-12 px-6">

            {/* Guide frame overlaid on camera */}
            <View className="absolute top-1/4 bottom-1/3 left-10 right-10 border-2 border-agro-green-500/30 rounded-3xl items-center justify-center pointer-events-none">
              <View className="w-8 h-8 border-t-4 border-l-4 border-agro-green-400 absolute top-0 left-0 rounded-tl-xl" />
              <View className="w-8 h-8 border-t-4 border-r-4 border-agro-green-400 absolute top-0 right-0 rounded-tr-xl" />
              <View className="w-8 h-8 border-b-4 border-l-4 border-agro-green-400 absolute bottom-0 left-0 rounded-bl-xl" />
              <View className="w-8 h-8 border-b-4 border-r-4 border-agro-green-400 absolute bottom-0 right-0 rounded-tr-xl" />
            </View>

            <View className="bg-white/90 w-full p-6 rounded-[32px] border border-agro-earth-100 backdrop-blur-lg flex-col shadow-2xl shadow-agro-green-950/20 items-center">
              <Text className="text-agro-earth-600 font-bold mb-6 text-center text-sm">Position the crop leaf within the frame</Text>
              <View className="flex-row w-full justify-between items-center gap-4">
                <Pressable
                  onPress={pickImage}
                  className="bg-agro-earth-50 h-16 w-16 rounded-2xl items-center justify-center border border-agro-earth-200 active:bg-agro-earth-100 transition-colors"
                >
                  <Ionicons name="images-outline" size={24} color="#3e8e3e" />
                </Pressable>
                <Pressable
                  onPress={takePhoto}
                  className="w-20 h-20 rounded-full bg-white border-4 border-agro-earth-100 items-center justify-center active:scale-95 transition-transform"
                >
                  <View className="w-14 h-14 bg-agro-green-600 rounded-full border-2 border-white" />
                </Pressable>
                <View className="w-16 h-16" />
              </View>
            </View>

          </View>
        </CameraView>
      ) : (
        <ScrollView className="flex-1 px-6 pt-24" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          <View className="rounded-[32px] overflow-hidden border border-agro-earth-100 bg-white shadow-2xl shadow-agro-green-950/10 mb-6">
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 320 }}
              className="opacity-95"
            />
            {isAnalyzing && (
              <View className="absolute inset-0 bg-white/80 justify-center items-center">
                <ActivityIndicator size="large" color="#3e8e3e" />
                <Text className="text-agro-green-700 font-black mt-4 tracking-widest uppercase text-xs">Analyzing Extensive Plant Data...</Text>
              </View>
            )}
          </View>

          {!isAnalyzing && result && (
            <View className="bg-white p-6 rounded-[32px] border border-agro-earth-100 shadow-xl shadow-agro-green-950/5 mb-6">

              <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 pr-4">
                  <Text className="text-agro-earth-500 font-bold text-[10px] uppercase tracking-widest mb-1">Detected Issue</Text>
                  <Text className="text-agro-green-950 font-black text-2xl leading-8">{result.disease}</Text>
                </View>
                <View className="bg-agro-green-50 px-3 py-1.5 rounded-xl border border-agro-green-100 mt-1">
                  <Text className="text-agro-green-700 font-black text-xs uppercase">{result.confidence}</Text>
                </View>
              </View>

              <View className="bg-agro-green-50 p-4 rounded-2xl border border-agro-green-100 mb-4">
                <Text className="font-black text-agro-green-800 mb-2 text-xs uppercase tracking-wider">Recommended Treatment</Text>
                <Text className="text-agro-green-950 text-sm leading-6 font-bold">{result.treatment}</Text>
              </View>

              {result.plantDetails !== "N/A" && (
                <>
                  <View className="bg-agro-earth-50 p-4 rounded-2xl border border-agro-earth-100 mb-4">
                    <Text className="font-black text-agro-earth-500 mb-2 text-xs uppercase tracking-wider">Plant Details & Requirements</Text>
                    <Text className="text-agro-green-950 text-sm leading-6 font-bold">{result.plantDetails}</Text>
                  </View>

                  <View className="bg-agro-earth-50 p-4 rounded-2xl border border-agro-earth-100 mb-4">
                    <Text className="font-black text-agro-earth-500 mb-2 text-xs uppercase tracking-wider">Improvement Tips</Text>
                    <Text className="text-agro-green-950 text-sm leading-6 font-bold">{result.improvementTips}</Text>
                  </View>

                  <View className="bg-agro-earth-50 p-4 rounded-2xl border border-agro-earth-100 mb-6">
                    <Text className="font-black text-agro-earth-500 mb-2 text-xs uppercase tracking-wider">Pest & Disease Outlook</Text>
                    <Text className="text-agro-green-950 text-sm leading-6 font-bold">{result.pestAndDiseaseInfo}</Text>
                  </View>

                  <Pressable
                    onPress={handlePostBlog}
                    disabled={isPosting}
                    className="bg-agro-green-100 py-4 rounded-2xl items-center border border-agro-green-200 active:scale-95 transition-all mb-3 flex-row justify-center"
                  >
                    {isPosting ? (
                      <ActivityIndicator size="small" color="#3e8e3e" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="share-social" size={18} color="#3e8e3e" style={{ marginRight: 8 }} />
                        <Text className="text-agro-green-800 font-black text-sm uppercase tracking-wider">
                          Post as Public Blog
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </>
              )}

              <Pressable
                onPress={resetScanner}
                className="bg-agro-green-600 py-4 rounded-2xl items-center shadow-lg shadow-agro-green-600/20 active:scale-95 active:bg-agro-green-700 transition-all w-full"
              >
                <Text className="text-white font-black text-base uppercase tracking-wider">
                  Scan Another Leaf
                </Text>
              </Pressable>

            </View>
          )}

        </ScrollView>
      )}

    </SafeAreaView>
  );
}