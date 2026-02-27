/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const safeApp = () => {
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <App />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

AppRegistry.registerComponent(appName, () => safeApp);