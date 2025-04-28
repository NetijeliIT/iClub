import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import MainContainer from './components/MainContainer'
import LoginPage from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CategoryPage from './pages/Category'
import { Toaster } from 'react-hot-toast';
import MealPage from './pages/Meal'
import UserPage from './pages/User'
import OrderPage from './pages/Order'

function App() {

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route element={<ProtectedRoute />} >
            <Route path='/' element={<MainContainer />}>
              <Route index element />
              <Route path='/category' element={<CategoryPage />} />
              <Route path='/order' element={<OrderPage />} />
              <Route path='/meal' element={<MealPage />} />
              <Route path='/user' element={<UserPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
