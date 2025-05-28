import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const handleLogin = (data: { email: string; password: string }) => {
    console.log('Login simulado:', data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
