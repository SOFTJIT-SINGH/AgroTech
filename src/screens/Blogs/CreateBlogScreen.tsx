import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DynamicButton from '../../components/DynamicButton';
import { supabase } from '../../services/supabase';
import { useUserStore } from '../../store/userStore';

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

export default function CreateBlogScreen({ navigation }: any) {
  const { name } = useUserStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

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
    const finalImageUrl = imageUrl.trim() || STOCK_IMAGES[category] || STOCK_IMAGES['General'];

    const { error } = await supabase.from('blogs').insert({
      title: title.trim(),
      content: content.trim(),
      category,
      image_url: finalImageUrl,
      author_name: name || session.user.email?.split('@')[0] || 'Anonymous',
      author_id: session.user.id,
    });

    setLoading(false);

    if (error) {
      console.log("Blog insert error:", error);
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Published! 🎉",
        "Your blog has been posted and is now visible to all farmers.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4 p-2 bg-slate-900 rounded-2xl border border-slate-800 active:scale-95">
            <Ionicons name="arrow-back" size={22} color="#34d399" />
          </Pressable>
          <View>
            <Text className="text-2xl font-extrabold text-white tracking-tight">
              Write <Text className="text-emerald-400">Blog</Text>
            </Text>
            <Text className="text-slate-500 text-xs font-medium mt-0.5">Share your farming knowledge</Text>
          </View>
        </View>

        {/* Title */}
        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Blog Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Best Practices for Wheat Farming"
            placeholderTextColor="#64748b"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-semibold text-base"
            maxLength={120}
          />
          <Text className="text-slate-600 text-xs mt-1.5 ml-1">{title.length}/120</Text>
        </View>

        {/* Category */}
        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl border ${
                  category === cat
                    ? 'bg-emerald-500/15 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <Text className={`text-sm font-semibold ${category === cat ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Image URL (Optional) */}
        <View className="mb-5">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Cover Image URL <Text className="text-slate-600">(Optional)</Text></Text>
          <TextInput
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://... or leave empty for auto image"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-base"
          />
          <Text className="text-slate-600 text-xs mt-1.5 ml-1">Leave empty to use a default image for the selected category</Text>
        </View>

        {/* Content */}
        <View className="mb-6">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Blog Content</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Share your farming experience, tips, or insights..."
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-base leading-7 min-h-[200px]"
          />
          <Text className="text-slate-600 text-xs mt-1.5 ml-1">{content.length} characters</Text>
        </View>

        {/* Preview */}
        {title.trim() && content.trim() ? (
          <View className="bg-slate-900/80 rounded-[24px] p-5 mb-6 border border-slate-800">
            <View className="flex-row items-center mb-2">
              <Ionicons name="eye-outline" size={16} color="#64748b" />
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2">Preview</Text>
            </View>
            <Text className="text-white font-extrabold text-lg mb-1">{title}</Text>
            <View className="flex-row items-center mb-2">
              <View className="bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Text className="text-emerald-400 font-bold text-[10px] uppercase">{category}</Text>
              </View>
              <Text className="text-slate-500 text-xs ml-3">By {name}</Text>
            </View>
            <Text className="text-slate-400 text-sm leading-6" numberOfLines={3}>{content}</Text>
          </View>
        ) : null}

        {/* Publish Button */}
        <DynamicButton
          title="PUBLISH BLOG"
          onPress={handlePublish}
          loading={loading}
          className="mb-12 rounded-2xl bg-emerald-600"
          textClassName="text-white"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
