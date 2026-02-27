import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import Routes from './src/screens/routes';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;