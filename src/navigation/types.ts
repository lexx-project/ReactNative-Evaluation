import { NavigatorScreenParams } from '@react-navigation/native';

export type RootAuthStackParamList = {
  Login: undefined;
  MainApp: NavigatorScreenParams<Record<string, object | undefined>> | undefined;
};
