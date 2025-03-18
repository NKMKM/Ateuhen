import React from 'react';
import { AuthProvider } from './AuthContext';
import ProfilePage from './ProfilePage';

function App() {
  const user = { id: 456, name: "John Doe" }; // Пример данных пользователя

  return (
    <AuthProvider>
      <ProfilePage user={user} />
    </AuthProvider>
  );
}

export default App;