jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('lucide-react-native', () => ({
  Home: () => 'HomeIcon',
  Bot: () => 'BotIcon',
  Settings: () => 'SettingsIcon',
  ListTodo: () => 'ListTodoIcon',
  Send: () => 'SendIcon',
}));
