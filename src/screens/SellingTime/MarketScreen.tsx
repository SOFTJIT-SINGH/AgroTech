import {
  View,
  Text,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { geminiModel } from "../../services/gemini";

export default function MarketScreen() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Loading is false initially since we wait for the user to search
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Track if a search has been executed yet
  const [hasSearched, setHasSearched] = useState(false);

  const [search, setSearch] = useState("");

  const API =
    "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd00000107085e0c269e4aa069e697fb45c1b1b4&format=json&filters[state]=Punjab&filters[district]=Amritsar&limit=50";

  const fetchMarketPrices = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);

      const prompt = `You are an agricultural market price API. Provide realistic, current market prices for the crop "${searchTerm}" in Punjab Mandis (e.g., Amritsar, Ludhiana, or Jalandhar). 
Return exactly a JSON array of objects, with no markdown, no backticks, and no extra text. 
Each object must have these exact keys:
"commodity" (string, the crop name),
"market" (string, the mandi name),
"grade" (string, e.g., "FAQ", "Grade A"),
"min_price" (number, realistic minimum price per quintal in INR),
"max_price" (number, realistic maximum price per quintal in INR),
"modal_price" (number, realistic common/modal price per quintal in INR).
Provide 2 to 5 realistic records. If the crop is completely invalid or not a real agricultural product, return an empty array [].`;

      const aiResult = await geminiModel.generateContent(prompt);
      const responseText = aiResult.response.text().trim();
      
      // Remove any markdown code blocks Gemini might add
      const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      let records = [];
      try {
        records = JSON.parse(jsonStr);
      } catch (e) {
        console.error("JSON Parse Error:", e, "Response was:", jsonStr);
      }

      setData(records);
      setFiltered(records);
      setLoading(false);

    } catch (error) {
      console.log("Market API error:", error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    if (!hasSearched) return; // Don't refresh if no search was made yet
    
    setRefreshing(true);
    fetchMarketPrices(search);

    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">

      {/* HEADER */}
      <View className="px-6 pt-5 pb-4">
        <Text className="text-3xl font-extrabold text-white tracking-tight">
          Amritsar Mandi
        </Text>
        <Text className="text-emerald-400 font-medium mt-1">
          Government Market Prices
        </Text>
      </View>

      {/* SEARCH BAR & BUTTON */}
      <View className="px-6 mb-6 flex-row items-center">
        <TextInput
          placeholder="e.g., Wheat, Rice..."
          placeholderTextColor="#64748b" // Tailwind slate-500
          selectionColor="#34d399" // Tailwind emerald-400
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => fetchMarketPrices(search)}
          className="flex-1 bg-slate-900 px-5 py-4 rounded-2xl border border-slate-800 text-slate-100 font-medium text-base mr-3"
        />
        
        <Pressable 
          onPress={() => fetchMarketPrices(search)}
          className="bg-emerald-500 px-6 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 active:bg-emerald-600 transition-all justify-center items-center"
        >
          <Text className="text-slate-950 font-extrabold text-base tracking-wide">
            Search
          </Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#34d399" />
          <Text className="mt-4 text-slate-400 font-medium tracking-wide">
            Fetching market prices...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="pb-6"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#34d399"
              colors={["#34d399"]}
              progressBackgroundColor="#0f172a"
            />
          }
        >

          {/* INITIAL STATE (Before user has searched) */}
          {!hasSearched && (
            <View className="items-center justify-center mt-24 px-8">
              <View className="w-24 h-24 bg-slate-900 rounded-full items-center justify-center mb-6 border border-slate-800 shadow-lg shadow-slate-900/50">
                <Text className="text-4xl opacity-90">🔍</Text>
              </View>
              <Text className="text-2xl font-bold text-white mb-3 text-center">
                Search to Start
              </Text>
              <Text className="text-slate-400 text-center leading-6 font-medium text-base px-2">
                Enter a crop name above and tap Search to see today's live Mandi prices.
              </Text>
            </View>
          )}

          {/* EMPTY STATE (User searched, but no results found) */}
          {hasSearched && filtered.length === 0 && (
            <View className="items-center justify-center mt-24 px-8">
              <View className="w-24 h-24 bg-slate-900 rounded-full items-center justify-center mb-6 border border-slate-800 shadow-lg shadow-slate-900/50">
                <Text className="text-4xl opacity-90">🌾</Text>
              </View>
              <Text className="text-2xl font-bold text-white mb-3 text-center">
                No Results Found
              </Text>
              <Text className="text-slate-400 text-center leading-6 font-medium text-base px-2">
                We couldn't find any current data for "{search}". Try searching for another crop.
              </Text>
            </View>
          )}

          {/* MARKET CARDS */}
          {hasSearched && filtered.map((item, index) => (
            <View
              key={index}
              className="bg-slate-900 mx-6 mb-4 rounded-3xl p-5 border border-slate-800"
            >
              <View className="flex-row justify-between items-start mb-5">
                <View className="flex-1 mr-2">
                  <Text className="text-xl font-extrabold text-white">
                    {item.commodity}
                  </Text>
                  <Text className="text-slate-400 font-semibold text-[11px] mt-1.5 uppercase tracking-widest">
                    Market: {item.market}
                  </Text>
                </View>
                
                <View className="bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                  <Text className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    {item.grade || "FAQ"}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between pt-4 border-t border-slate-800/80">
                
                <View className="items-start">
                  <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">
                    Min Price
                  </Text>
                  <Text className="text-slate-200 font-semibold text-base">
                    ₹{item.min_price}
                    <Text className="text-slate-500 text-xs font-medium">/q</Text>
                  </Text>
                </View>

                <View className="items-center">
                  <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">
                    Max Price
                  </Text>
                  <Text className="text-slate-200 font-semibold text-base">
                    ₹{item.max_price}
                    <Text className="text-slate-500 text-xs font-medium">/q</Text>
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-1">
                    Modal Price
                  </Text>
                  <Text className="text-emerald-400 font-extrabold text-lg leading-6">
                    ₹{item.modal_price}
                    <Text className="text-emerald-500/60 text-xs font-bold">/q</Text>
                  </Text>
                </View>

              </View>
            </View>
          ))}

        </ScrollView>
      )}

    </SafeAreaView>
  );
}