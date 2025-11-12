module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    ['nativewind/babel', { enableWorklets: false }],
  ],
  plugins: ['react-native-reanimated/plugin'],
};
