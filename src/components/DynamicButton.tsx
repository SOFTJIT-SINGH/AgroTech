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

  const getVariantStyle = () => {
    if (disabled) {
      return { backgroundColor: '#1e293b', borderColor: '#1e293b', opacity: 0.5 };
    }
    if (variant === 'secondary') {
      return { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' };
    }
    if (variant === 'outline') {
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#34d399' };
    }
    return { backgroundColor: '#059669' };
  };

  const getTextColor = () => {
    if (disabled) return '#64748b';
    if (variant === 'secondary') return '#e2e8f0';
    if (variant === 'outline') return '#34d399';
    return '#ffffff';
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]} className="w-full relative">
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || loading}
        className={`p-4 rounded-2xl items-center flex-row justify-center ${className}`}
        style={getVariantStyle()}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? '#34d399' : '#fff'} style={{ marginRight: 8 }} />
        ) : null}
        <Text style={{ fontWeight: '800', fontSize: 16, letterSpacing: 1, color: getTextColor(), ...textClassName }} >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
