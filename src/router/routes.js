
import TodoApp from '../components/TodoApp'
import LadingPage from '../components/maketing/LandingPage'
import About from '../components/maketing/About'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

const routes = [
  {
    path: '/',
    component: LadingPage
  },
  {
    path: '/todo',
    component: TodoApp
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
]

export default routes