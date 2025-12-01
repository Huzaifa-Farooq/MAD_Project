import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignupScreen from './Screens/SignupScreen';
import LoginScreen from './Screens/LoginScreen';
import AddTimelineScreen from './Screens/AddTimelineScreen';
import HomeScreen from './Screens/HomeScreen';
import ViewTimelineScreen from './Screens/ViewTimelineScreen';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
      Home: HomeScreen,
      Signup: SignupScreen,
      Login: LoginScreen,
      AddTimeline: AddTimelineScreen,
      ViewTimeline: ViewTimelineScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);


export default function App() {
  return <Navigation />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
