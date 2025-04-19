
import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import MainContainer from './components/MainContainer'
import HomePage from './pages/Home'
import Calendar from './pages/Calendar'
import CartPage from './pages/Cart'
import ProfilePage from './pages/Profile'
import ProfileContainer from './components/ProfileContainer'
import OrdersPage from './pages/Orders'
import LoginPage from './pages/Login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/' element={<MainContainer />} >
          <Route index element={<HomePage />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/profile' element={<ProfileContainer />} >
            <Route index element={<ProfilePage />} />
            <Route path='/profile/orders' element={<OrdersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
