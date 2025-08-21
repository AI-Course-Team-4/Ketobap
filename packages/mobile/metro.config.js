const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 모노레포 루트 watch 설정
config.watchFolders = [
  path.resolve(__dirname, '../..')
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules')
];

module.exports = config;
