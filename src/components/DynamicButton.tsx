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

  let bgClass = 'bg-emerald-600'; // Theme primary emerald
  let textClass = 'text-white';
  
  if (variant === 'secondary') {
    bgClass = 'bg-slate-800 border border-slate-700'; // Premium dark secondary
    textClass = 'text-slate-200';
  } else if (variant === 'outline') {
    bgClass = 'bg-transparent border border-emerald-500';
    textClass = 'text-emerald-400';
  }

  if (disabled) {
    bgClass = 'bg-slate-800 border-slate-800 opacity-50';
    textClass = 'text-slate-500';
  }

  // Use a wrapper to prevent tailwind from clobbering the transform
  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]} className="w-full relative">
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        className={`p-4 rounded-2xl items-center flex-row justify-center ${bgClass} ${className}`}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? '#34d399' : '#fff'} className="mr-2" />
        ) : null}
        <Text className={`font-extrabold text-base tracking-wider ${textClass} ${textClassName}`}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
