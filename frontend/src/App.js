
  // eslint-disable-next-line no-lone-blocks
 //for routing different pages
 import {useEffect, useState} from 'react'
  import { BrowserRouter as Router, Route} from 'react-router-dom'
  import axios from 'axios'
  import { useSelector } from 'react-redux'
  import {Elements} from '@stripe/react-stripe-js'
  import {loadStripe} from '@stripe/stripe-js'
 
  //page layout 
  import Header from './components/layout/Header'
  import  Footer from './components/layout/Footer'
  import Home from './components/Home'
  import ProductDetails from './components/product/ProductDetails'

//admin 
import Dashboard from './components/admin/Dashboard'
import ProductLists from './components/admin/ProductLists'
import NewProduct from './components/admin/NewProduct'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'

//user 
  import Login from './components/user/Login'
  import Register from './components/user/Register'
  import Profile from './components/user/Profile'
  import UpdateProfile from './components/user/UpdateProfile'
  import UpdatePassword from './components/user/UpdatePassword'
  import ForgotPassword from './components/user/ForgotPassword'
  import NewPassword from './components/user/NewPassword'

//cart 
import Cart from './components/cart/Cart'
  import Shipping from './components/cart/Shipping'
  import ConfirmOrder from './components/cart/ConfirmOrder'
  import Payment from './components/cart/Payment'
  import OrderSuccess from './components/cart/OrderSuccess'
  
  //order
  import ListOrders from './components/order/ListOrders'
  import OrderDetails from './components/order/OrderDetails'



  import ProtectedRoute from './components/routes/ProtectedRoute'
  
  
  import {loadUser} from './action/userAction'
  import store from './store'


function App() {
  // make sure that there is no space between "" in useState
  const [stripeApiKey, setStripeApiKey] = useState('')

  useEffect(() => {
    store.dispatch(loadUser())
  
    async function getStripeApiKey( ) {
      const {data } = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey( );
  },[])

 const {user, loading} = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
          <Header/>
          
          <div className="container  container-fluid">

              <Route path="/"component={Home} exact />
              <Route path="/search/:keyword"component={Home}  />

              <Route path="/product/:id" component={ProductDetails} exact />
              
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Register} />
              <ProtectedRoute path="/me" component={Profile}  exact/>
              <ProtectedRoute path="/me/update" component={UpdateProfile}  exact/>
              <ProtectedRoute path="/password/update" component={UpdatePassword} exact/>
              <Route path="/password/forgot" component={ForgotPassword} exact/>
              <Route path="/password/reset/:token" component={NewPassword} exact/>

              <ProtectedRoute path="/orders/me" component={ListOrders} exact/>
              <ProtectedRoute path="/order/:id" component={OrderDetails} exact/>

           
             
              <ProtectedRoute path="/cart" component={Cart} exact/>
              <ProtectedRoute path="/shipping" component={Shipping} />
              <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
              <ProtectedRoute path="/success" component={OrderSuccess} />
              {stripeApiKey && 
              <Elements stripe= {loadStripe(stripeApiKey)}>
                <ProtectedRoute path='/payment' component={Payment}/>
              </Elements>
              }

             
             
          </div>
           <ProtectedRoute path="/dashboard" isAdmin = {true} component={Dashboard} exact/>
           <ProtectedRoute path="/admin/products" isAdmin = {true} component={ProductLists} exact/>
           <ProtectedRoute path="/admin/product" isAdmin = {true} component={NewProduct} exact/>
           <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />
           <ProtectedRoute path="/admin/oders" isAdmin = {true} component={OrdersList} exact/>
         {/* loading maybe added here  */}
            <Footer/>
            
        </div>
    </Router>
  
  );
}

export default App;
