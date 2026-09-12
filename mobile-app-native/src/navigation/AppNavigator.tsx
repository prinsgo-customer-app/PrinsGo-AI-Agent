import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AgentsScreen } from '../screens/AgentsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { Home, Bot, Settings, ListTodo } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AgentsStack = () => (
  <Stack.Navigator>
     <Stack.Screen name="AgentsList" component={AgentsScreen} options={{ headerShown: false }} />
     <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Agent Chat' }} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'Agents') {
            return <Bot color={color} size={size} />;
          } else if (route.name === 'Tasks') {
            return <ListTodo color={color} size={size} />;
          } else if (route.name === 'Settings') {
            return <Settings color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#111827',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Agents" component={AgentsStack} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
