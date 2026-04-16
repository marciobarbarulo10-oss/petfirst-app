import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PetProvider } from './contexts/PetContext';
import WelcomeScreen from './screens/WelcomeScreen';
import CadastroEspecieScreen from './screens/CadastroEspecieScreen';
import CadastroNomeScreen from './screens/CadastroNomeScreen';
import MainTabs from './screens/MainTabs';
import AdicionarVacinaScreen from './screens/AdicionarVacinaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PetProvider>
      <NavigationContainer>
      {/* Stack de onboarding — Welcome → CadastroEspecie → CadastroNome → MainTabs */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="CadastroEspecie" component={CadastroEspecieScreen} />
        <Stack.Screen name="CadastroNome" component={CadastroNomeScreen} />
        {/* MainTabs contém o bottom tab navigator com todas as telas principais */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Telas modais/secundárias */}
        <Stack.Screen name="AdicionarVacina" component={AdicionarVacinaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </PetProvider>
  );
}
