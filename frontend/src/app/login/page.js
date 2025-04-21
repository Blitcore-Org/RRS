'use client';

import { UserProvider } from '@/context/UserContext';
import Login from '@/Components/LoginComponent';

export default function LoginPage() {
  return (
    <UserProvider skipInitialFetch>
      <Login />
    </UserProvider>
  );
}
