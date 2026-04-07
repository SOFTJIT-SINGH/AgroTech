import React, { useRef } from 'react';
import { Pressable, Text, ActivityIndicator, Animated } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export default function DynamicButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  textClassName = '',
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  let bgClass = 'bg-[#2E7D32]'; // Earthy dark green
  let textClass = 'text-white';
  
  if (variant === 'secondary') {
    bgClass = 'bg-[#8D6E63]'; // Earthy brown
    textClass = 'text-white';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border-2 border-[#2E7D32]';
    textClass = 'text-[#2E7D32]';
  }

  if (disabled) {
    bgClass = 'bg-gray-400 border-gray-400';
    textClass = 'text-white';
  }

  // Use a wrapper to prevent tailwind from clobbering the transform
  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]} className="w-full relative">
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        className={`p-4 rounded-2xl items-center flex-row justify-center shadow-lg ${bgClass} ${className}`}
        style={{ elevation: disabled ? 0 : 5 }}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? '#2E7D32' : '#fff'} className="mr-2" />
        ) : null}
        <Text className={`font-bold text-lg tracking-wide ${textClass} ${textClassName}`}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
