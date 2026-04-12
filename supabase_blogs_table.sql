-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates the blogs table and enables public read + authenticated write

CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  image_url TEXT,
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone who is authenticated can read all blogs
CREATE POLICY "Authenticated users can read all blogs"
  ON blogs FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert their own blogs
CREATE POLICY "Authenticated users can insert blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update only their own blogs
CREATE POLICY "Users can update own blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Policy: Users can delete only their own blogs
CREATE POLICY "Users can delete own blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- MOCK DATA (Optional)
-- Note: author_id is left NULL for these official system blogs
INSERT INTO blogs (title, content, category, image_url, author_name)
VALUES 
('10 Tips for Higher Wheat Yield', 'To maximize wheat production, timely sowing is crucial. Ensure soil moisture is optimal and use high-quality certified seeds. Regular monitoring for rust diseases and balanced application of Nitrogen, Phosphorus, and Potash (NPK) can significantly improve the grains quality and weight.', 'Crop Tips', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800', 'AgroTech Team'),

('Organic Fertilizer Guide', 'Switching to organic fertilizers like vermicompost and cow dung manure improves soil structure and long-term fertility. Unlike chemical fertilizers, organic options release nutrients slowly and encourage beneficial microbial activity in the soil.', 'Fertilizer', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800', 'AgroTech Team'),

('Drip Irrigation vs Flood Irrigation', 'Drip irrigation delivers water directly to the roots, reducing water wastage by up to 60% compared to flood irrigation. It also prevents weed growth and soil erosion, making it the most efficient choice for high-value crops like vegetables and fruits.', 'Irrigation', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', 'AgroTech Team'),

('Understanding MSP for 2026', 'The Minimum Support Price (MSP) is a safety net for farmers. For the 2026 season, keep an eye on government procurement dates. Knowing the quality standards required by the procurement agencies ensures you get the best price for your produce.', 'Market', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', 'Market Expert'),

('Using AI in Modern Farming', 'Artificial Intelligence helps farmers predict weather patterns, detect pests from photos, and optimize fertilizer usage. Tools like AgroTech use Gemini AI to provide real-time advice tailored to your specific farm conditions.', 'Technology', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', 'AgroTech Team');
