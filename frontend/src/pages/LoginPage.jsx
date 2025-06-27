import React from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import SEO from '../components/SEO'
import verifikaAPI from '../services/verifikaApi'

const LoginPage = () => {
  const navigate = useNavigate()

  // Real login function that connects to Verifika backend
  const handleLogin = async (credentials) => {
    try {
      const response = await verifikaAPI.login(credentials)
      
      if (response.success) {
        // Redirect to Verifika dashboard on successful login
        navigate('/verifika/dashboard')
        return {
          success: true,
          message: 'Login exitoso',
          user: response.data.user
        }
      } else {
        return {
          success: false,
          message: response.message || 'Credenciales inválidas'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión con Verifika. ¿Está el servidor iniciado?'
      }
    }
  }

  return (
    <>
      <SEO 
        title="Acceso a Verifika - BlueSystem.io"
        description="Accede al sistema Verifika para gestionar actividades técnicas, validaciones y reportes en tiempo real."
        keywords="verifika, login, acceso, actividades técnicas, validación, bluesystem"
      />
      <Login onLogin={handleLogin} />
    </>
  )
}

export default LoginPage
