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

// 특정 모듈은 모바일 패키지의 로컬 버전을 우선 사용하도록 강제 매핑
config.resolver.extraNodeModules = {
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
  'react': path.resolve(__dirname, 'node_modules/react'),
};

module.exports = config;
