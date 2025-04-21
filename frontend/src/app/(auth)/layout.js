import { UserProvider } from '@/context/UserContext';

export default function AuthenticatedLayout({ children }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
} 