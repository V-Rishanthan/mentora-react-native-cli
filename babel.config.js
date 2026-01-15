// module.exports = {
//   presets: ['module:@react-native/babel-preset', ],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],

  plugins: ['react-native-reanimated/plugin'], // keep LAST
};
// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: [
//     'nativewind/babel',
//     'react-native-reanimated/plugin', // MUST be last
//   ],
// };
