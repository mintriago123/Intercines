import { useState } from 'react';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error en el registro');
      }

      const result = await response.json();
      setMessage('Registro exitoso: ' + result.message);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 space-y-4">
      <RegisterForm onRegister={handleRegister} />
      {message && <div className="text-green-600">{message}</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
