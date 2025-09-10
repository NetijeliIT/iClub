
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
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import Booking from './pages/Booking'

function App() {

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path='/' element={<MainContainer />} >
              <Route index element={<HomePage />} />
              <Route path='/calendar' element={<Booking />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/profile' element={<ProfileContainer />} >
                <Route index element={<ProfilePage />} />
                <Route path='/profile/orders' element={<OrdersPage />} />
              </Route>
            </Route>
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
