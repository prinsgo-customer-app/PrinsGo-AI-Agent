1. **Setup React Native Android project**: Create a clean, production-ready React Native app using `react-native init` (using version 0.76.0 which is modern and stable).
   - Directory: `mobile-app-native`
   - Technologies: React Navigation for routing, Zustand for state management, Axios for network layer, Expo SecureStore (if compatible as a standalone package via `expo install`, or `@react-native-async-storage/async-storage` to ensure it's not dependent on Expo Go).
2. **Setup Dependencies**: Install `@react-navigation/native`, `@react-navigation/native-stack`, `axios`, `zustand`, `@react-native-async-storage/async-storage`, `lucide-react-native`, `react-native-safe-area-context`, `react-native-screens`.
3. **Network Layer**: Implement an `api.ts` configured with `axios` to target `https://prinsgo-backend.onrender.com`. Include interceptors for Auth token injection and error handling.
4. **State Management**: Create a `store/useAuthStore.ts` utilizing Zustand and Async Storage to persist `user` and `token`. Create a `store/useWorkspaceStore.ts` for managing the active workspace ID.
5. **Authentication Flow**: Implement `LoginScreen` and `OTPScreen`.
   - Flow: user enters phone -> `POST /api/auth/send-otp` -> user enters OTP -> `POST /api/auth/verify-otp` -> store token -> navigate to App.
6. **Navigation**: Create `RootNavigator` that switches between `AuthNavigator` and `AppNavigator` based on the auth state.
7. **Dashboard/App Flow**:
   - `DashboardScreen`: Shows profile details and system status (`GET /api/ai-agent/workspaces/:workspaceId/status`). We will need to fetch or create a workspace first.
   - We will need a way to fetch or create a workspace (since the backend requires `workspaceId` for most AI routes). Since `GET /workspaces` doesn't seem directly exposed, we might need to check if there's an API for it, or we just rely on `aiSystemController.createWorkspace` to create one if none is known (or see if the backend returns it). Looking closer, there is `getUserWorkspaces` in the service but maybe not exposed? We will need to figure out workspace logic.
   - `AIAgentScreen`: Shows agents (`GET /api/ai-agent/workspaces/:workspaceId/agents`).
   - `HermesStatusScreen`: Shows Hermes status.
8. **UI Implementation**: Use professional enterprise UI with Green/White theme.
9. **Android Configuration**: Setup basic app naming, icons (if time permits), and ensure standard Android permissions.
10. **Pre-commit**: Complete standard checks.
11. **Final Build**: Perform Android APK build `cd android && ./gradlew assembleRelease` to confirm it compiles as a standalone native app.
