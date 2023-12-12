import React, { useState } from 'react';
import Button from '@mui/material/Button';

interface RegisterFormProps {
  onRegister: (username: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(username, password);
  };

  return (
    <form onSubmit={handleRegister}>
    <h2>Register</h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Button variant="contained">Register</Button>
      </div>
    </form>
  );
};

export default RegisterForm;
