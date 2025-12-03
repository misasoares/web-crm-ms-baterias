import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../kernel/http/axios-client';
import { ThemeSwitcher } from '../../shared/components/ThemeSwitcher';
import { 
  EmailOutlined, 
  LockOutlined, 
  VisibilityOutlined, 
  VisibilityOffOutlined,
  Facebook,
  Google,
  WhatsApp,
  BatteryChargingFull
} from '@mui/icons-material';

export const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await httpClient.doPost('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.success !== false) {
           const data = response as any;
           if (data.access_token) {
             localStorage.setItem('ACCESS_TOKEN', data.access_token);
             navigate('/');
           } else {
             setError('Falha no login: Nenhum token recebido');
           }
        } else {
          setError(response.message || 'Falha no login');
        }
      } else {
        const response = await httpClient.doPost('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (response.success !== false) {
          setIsLogin(true);
          setError('Cadastro realizado com sucesso! Por favor, faça login.');
          setFormData(prev => ({ ...prev, password: '' }));
        } else {
          setError(response.message || 'Falha no cadastro');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img 
          src="/assets/images/login-bg.png" 
          alt="Bateria Automotiva" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
              <BatteryChargingFull fontSize="large" />
              <span>MS Baterias</span>
            </div>
          </div>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">CRM - MS Baterias</h1>
            <p className="text-gray-300 text-lg">
              CRM para gestão de clientes e pedidos.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
        {/* Theme Switcher */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeSwitcher />
        </div>

        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-50 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg transform rotate-3">
              <BatteryChargingFull />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? 'Insira seus dados para acessar sua conta' : 'Comece com sua conta gratuita hoje'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none block w-full pl-3 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                      placeholder="João Silva"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço de Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <EmailOutlined fontSize="small" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                    placeholder="nome@empresa.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <LockOutlined fontSize="small" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Manter-me conectado
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-150 hover:scale-[1.01]"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Continuar com</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Facebook className="text-blue-600" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <WhatsApp className="text-green-500" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Google className="text-red-500" />
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '' });
              }}
              className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
