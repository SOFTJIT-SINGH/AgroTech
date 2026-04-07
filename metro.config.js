const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro'); // Fixed import path

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });