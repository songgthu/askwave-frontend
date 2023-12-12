import Logo from '../images/AskWaveLogo.png';
import RegisterForm from '../login/registerForm';
import '../login/login.css';

function Register() {
  const handleRegister = (username: string, password: string) => {
    console.log('Register credentials:', { username, password });
  };
  return (
    <div className="Register">
      <div className="LogoContainer">
        <img src={Logo} className="Logo" style={{ width: '200px', height: '200px' }} />
      </div>
      <RegisterForm onRegister={handleRegister} />
      
    </div>
  );
}

export default Register;