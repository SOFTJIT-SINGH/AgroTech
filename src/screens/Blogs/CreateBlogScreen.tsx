import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';
import { useUserStore } from '../../store/userStore';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { uriToBlob, base64ToArrayBuffer } from '../../utils/fileUtils';

const CATEGORIES = ['Crop Tips', 'Fertilizer', 'Irrigation', 'Market', 'Weather', 'Technology', 'General'];

const STOCK_IMAGES: Record<string, string> = {
  'Crop Tips': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800',
  'Fertilizer': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
  'Irrigation': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'Market': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
  'Weather': 'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800',
  'Technology': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
  'General': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800',
};

export default function CreateBlogScreen({ route, navigation }: any) {
  const { name } = useUserStore();
  const editBlog = route?.params?.editBlog;

  const [title, setTitle] = useState(editBlog?.title || '');
  const [content, setContent] = useState(editBlog?.content || '');
  const [category, setCategory] = useState(editBlog?.category || 'General');
  const [imageUrl, setImageUrl] = useState(editBlog?.image_url && editBlog.image_url.startsWith('http') && !Object.values(STOCK_IMAGES).includes(editBlog.image_url) ? editBlog.image_url : '');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a blog title.");
      return;
    }
    if (!content.trim() || content.trim().length < 20) {
      Alert.alert("Error", "Content must be at least 20 characters long.");
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      Alert.alert("Error", "You must be logged in to post a blog.");
      return;
    }

    // Use category-matched stock image if user didn't provide one
    let finalImageUrl = imageUrl.trim() || STOCK_IMAGES[category] || STOCK_IMAGES['General'];

    // Handle Image Upload to Supabase Storage if a local image was picked
    if (selectedImage) {
      try {
        const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        
        // Use ArrayBuffer for max compatibility
        const fileData = imageBase64 
          ? base64ToArrayBuffer(imageBase64) 
          : await uriToBlob(selectedImage);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, fileData, {
            contentType: 'image/jpeg'
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);
          
        finalImageUrl = urlData.publicUrl;
      } catch (err: any) {
        setLoading(false);
        Alert.alert("Upload Error", err.message || "Failed to upload image.");
        return;
      }
    }

    let error;
    if (editBlog) {
      const { error: updateError } = await supabase.from('blogs').update({
        title: title.trim(),
        content: content.trim(),
        category,
        image_url: finalImageUrl,
      }).eq('id', editBlog.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('blogs').insert({
        title: title.trim(),
        content: content.trim(),
        category,
        image_url: finalImageUrl,
        author_name: name || session.user.email?.split('@')[0] || 'Anonymous',
        author_id: session.user.id,
      });
      error = insertError;
    }

    setLoading(false);

    if (error) {
      console.log("Blog save error:", error);
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        editBlog ? "Updated! 🎉" : "Published! 🎉",
        editBlog ? "Your blog has been updated successfully." : "Your blog has been posted and is now visible to all farmers.",
        [{ text: "OK", onPress: () => {
          if (editBlog) {
            navigation.navigate("Blogs");
          } else {
            navigation.goBack();
          }
        }}]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-agro-earth-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Pressable 
              onPress={() => navigation.goBack()} 
              className="mr-4 p-2 bg-white rounded-2xl border border-agro-earth-200 shadow-sm active:scale-95 transition-all"
            >
              <Ionicons name="arrow-back" size={22} color="#3e8e3e" />
            </Pressable>
            <View>
              <Text className="text-2xl font-extrabold text-agro-green-950 tracking-tight">
                Write <Text className="text-agro-green-600">Blog</Text>
              </Text>
              <Text className="text-agro-earth-500 text-xs font-bold uppercase tracking-widest mt-0.5">Share knowledge</Text>
            </View>
          </View>

          {/* Title */}
          <View className="mb-5">
            <Text className="text-agro-earth-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Blog Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Best Practices for Wheat Farming"
              placeholderTextColor="#bab194"
              selectionColor="#3e8e3e"
              className="bg-white border border-agro-earth-100 rounded-2xl p-4 text-agro-green-950 font-bold text-base shadow-sm shadow-agro-green-950/5"
              maxLength={120}
            />
            <Text className="text-agro-earth-400 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-widest">{title.length}/120 characters</Text>
          </View>

          {/* Category */}
          <View className="mb-5">
            <Text className="text-agro-earth-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className="px-5 py-2.5 rounded-2xl border"
                    style={isSelected ? { backgroundColor: '#dcf0dc', borderColor: '#b8d8b8' } : { backgroundColor: '#ffffff', borderColor: '#ebe9df', shadowColor: '#1a3c1a', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '700', letterSpacing: 0.5, color: isSelected ? '#2d722d' : '#695a43' }}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Image Picker */}
          <View className="mb-5">
            <Text className="text-agro-earth-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Cover Image</Text>
            <Pressable 
              onPress={pickImage}
              className="bg-white border border-dashed border-agro-earth-300 rounded-2xl h-48 overflow-hidden items-center justify-center shadow-sm"
            >
              {selectedImage || (imageUrl && imageUrl.startsWith('http')) ? (
                <View className="w-full h-full relative">
                  <Image 
                    source={{ uri: selectedImage || imageUrl }} 
                    className="w-full h-full"
                    contentFit="cover"
                  />
                  <View className="absolute inset-0 bg-agro-green-950/20 items-center justify-center">
                    <Ionicons name="camera" size={32} color="white" />
                    <Text className="text-white font-black mt-2 uppercase tracking-widest text-[10px]">Change Image</Text>
                  </View>
                </View>
              ) : (
                <View className="items-center">
                  <View className="bg-agro-earth-50 p-4 rounded-full mb-3 border border-agro-earth-100">
                    <Ionicons name="image-outline" size={32} color="#3e8e3e" />
                  </View>
                  <Text className="text-agro-green-950 font-black text-sm uppercase tracking-wider">Pick an Image</Text>
                  <Text className="text-agro-earth-500 text-[10px] mt-1 font-bold">16:9 aspect ratio recommended</Text>
                </View>
              )}
            </Pressable>
            {selectedImage && (
              <Pressable onPress={() => setSelectedImage(null)} className="mt-2 self-end px-3 py-1 active:opacity-70">
                <Text className="text-red-600 text-[10px] font-black uppercase tracking-widest">Remove Image</Text>
              </Pressable>
            )}
          </View>

          {/* Content */}
          <View className="mb-6">
            <Text className="text-agro-earth-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Blog Content</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Share your farming experience, tips, or insights..."
              placeholderTextColor="#bab194"
              selectionColor="#3e8e3e"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              className="bg-white border border-agro-earth-100 rounded-2xl p-4 text-agro-green-950 font-bold text-base leading-7 min-h-[200px] shadow-sm shadow-agro-green-950/5"
            />
            <Text className="text-agro-earth-400 text-[10px] font-bold mt-1.5 ml-1 uppercase tracking-widest">{content.length} characters</Text>
          </View>

          {/* Preview */}
          {title.trim() && content.trim() ? (
            <View className="bg-agro-green-50/50 rounded-[24px] p-5 mb-6 border border-agro-green-100">
              <View className="flex-row items-center mb-3">
                <Ionicons name="eye-outline" size={16} color="#3e8e3e" />
                <Text className="text-agro-green-700 text-[10px] font-black uppercase tracking-widest ml-2">Real-time Preview</Text>
              </View>
              <Text className="text-agro-green-950 font-black text-lg mb-2 leading-6">{title}</Text>
              <View className="flex-row items-center mb-3">
                <View className="bg-agro-accent-500 px-2.5 py-1 rounded-lg">
                  <Text className="text-agro-accent-950 font-black text-[9px] uppercase tracking-wider">{category}</Text>
                </View>
                <Text className="text-agro-earth-500 text-xs font-bold ml-3">By {name}</Text>
              </View>
              <Text className="text-agro-earth-700 text-sm leading-6 font-medium" numberOfLines={3}>{content}</Text>
            </View>
          ) : null}

          {/* Publish Button */}
          <DynamicButton
            title={editBlog ? "UPDATE BLOG" : "PUBLISH BLOG"}
            onPress={handlePublish}
            loading={loading}
            className="mb-12 rounded-2xl bg-agro-green-600 shadow-xl shadow-agro-green-700/20 active:bg-agro-green-700"
            textClassName="text-white font-black tracking-widest"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
