import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from './HomeScreen';
import SaudeScreen from './SaudeScreen';
import AlimentacaoScreen from './AlimentacaoScreen';
import AssistenteScreen from './AssistenteScreen';
import PerfilScreen from './PerfilScreen';

const Tab = createBottomTabNavigator();

// Ícones em texto/emoji para cada aba — sem dependência de pacote de ícones
function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function MainTabs({ route }) {
  // Recebe os parâmetros do onboarding e repassa para todas as abas
  const { petName, petEspecie } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E07B5A',
        tabBarInactiveTintColor: '#B8B0A8',
        tabBarStyle: {
          backgroundColor: '#FFFDF9',
          borderTopWidth: 1,
          borderTopColor: '#E8E4DF',
          paddingTop: 6,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ petName, petEspecie }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Saude"
        component={SaudeScreen}
        initialParams={{ petName, petEspecie }}
        options={{
          tabBarLabel: 'Saúde',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💉" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Alimentacao"
        component={AlimentacaoScreen}
        initialParams={{ petName, petEspecie }}
        options={{
          tabBarLabel: 'Alimentação',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🍽️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Assistente"
        component={AssistenteScreen}
        initialParams={{ petName, petEspecie }}
        options={{
          tabBarLabel: 'Assistente',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        initialParams={{ petName, petEspecie }}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
