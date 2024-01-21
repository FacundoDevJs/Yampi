import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"
import Orders from "./pages/Orders"
import AddProduct from "./pages/AddProduct"
import AuthProvider from "./context/AuthContext"
import ProductProvider from "./context/ProductContext"
import HomePage from "./pages/HomePage"
import Home from "./pages/Home"
import Order from "./pages/Order"
import Product from "./pages/Product"
import OrderProvider from "./context/OrderContext"
import AddOrder from "./pages/AddOrder"
import Success from "./pages/Success"
import OrderPage from "./pages/OrderPage"
import ProtectedRoute from "./components/ProtectedRoute"
import MercadoPagoSuccess from "./pages/MercadoPagoSuccess"
import UserProvider from "./context/UserContext"
import CreateUser from "./pages/CreateUser"
import Signin from "./pages/Signin"
import Profile from "./pages/Profile"
import LoginUser from "./pages/LoginUser"
import NewPurchase from "./pages/NewPurchase"
import AddPurchase from "./pages/AddPurchase"
import Purchases from "./pages/Purchases"
import PurchasePage from "./pages/PurchasePage"

function App() {

  return (
    <>
      <AuthProvider>
        <UserProvider>
          <ProductProvider>
            <OrderProvider>
              <Routes>
                <Route
                path="/"
                element={
                  <HomePage/>
                }/>
                <Route
                path="/orders"
                element={
                <PrivateRoute>
                  <Orders/>
                </PrivateRoute>
                }
                />
                <Route
                path="/tus-productos"
                element={
                <PrivateRoute>
                  <Home admin={true}/>
                </PrivateRoute>
                }
                />
                <Route
                path="/add-product"
                element={
                <PrivateRoute>
                  <AddProduct/>
                </PrivateRoute>
                }
                />
                <Route
                path="/edit/:id"
                element={
                <PrivateRoute>
                  <AddProduct/>
                </PrivateRoute>
                }
                />
                <Route
                path="/order/:id"
                element={
                <PrivateRoute>
                  <OrderPage/>
                </PrivateRoute>
                }
                />
                <Route
                path="/purchase/:id"
                element={
                <PrivateRoute>
                  <PurchasePage/>
                </PrivateRoute>
                }
                />
                <Route
                path="/productos"
                element={
                  <ProtectedRoute>
                    <Home admin={false}/>
                  </ProtectedRoute>
                }
                />
                <Route
                path="/productos/orden/:admin"
                element={
                  <Order/>
                }
                />
                <Route
                path="/signin"
                element={
                  <Signin/>
                }
                />
                <Route
                path="/productos/:id"
                element={
                  <Product/>
                }
                />
                <Route
                path="/productos/add-order"
                element={
                  <AddOrder/>
                }
                />
                <Route
                path="/cashSuccess/:delivery"
                element={
                  <Success/>
                }
                />
                <Route
                path="/success/:id"
                element={
                  <MercadoPagoSuccess/>
                }
                />
                <Route
                path="/create-user"
                element={
                  <CreateUser/>
                }
                />
                <Route
                path="/profile"
                element={
                  <Profile/>
                }
                />
                <Route
                path="/login"
                element={
                  <LoginUser/>
                }
                />
                <Route
                path='/new-purchase'
                element={
                  <NewPurchase/>
                }
                />
                <Route
                path='/add-purchase'
                element={
                  <AddPurchase/>
                }
                />
                <Route
                path='/purchases'
                element={
                  <Purchases/>
                }
                />
              </Routes>
              <Toaster/>
            </OrderProvider>
          </ProductProvider>
        </UserProvider>
      </AuthProvider>
    </>
  )
}

export default App
