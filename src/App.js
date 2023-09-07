import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import Hero from './Hero';
import Browse from './components/Browse';
import Arrived from './components/Arrieved';
import Clients from './components/Clients';
import AsideMenu from './components/AsideMenu';
import Footer from './components/Footer';
import Offline from './components/Offline';
import Splash from './pages/Splash';
import Profile from './pages/Profile';
import Details from './pages/Details';
import Cart from './pages/Cart';
function App({ cart }) {

    const [items, setItems] = React.useState([])
    const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine)
    const [isloading, setIsLoading] = React.useState(true)


    function handleOfflineStatus() {
        setOfflineStatus(!navigator.onLine)
    }

    React.useEffect(function () {
        (async function () {
            const response = await fetch('https://bwacharity.fly.dev/items', {
                Header: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            })
            const { nodes } = await response.json()
            setItems(nodes)

            if (!document.querySelector('script[src="/carousel.js"]')) {
                const script = document.createElement("script");
                script.src = "/carousel.js";
                script.async = false;
                document.body.appendChild(script);
            }
        })()
        handleOfflineStatus()

        window.addEventListener('online', handleOfflineStatus)
        window.addEventListener('offline', handleOfflineStatus)

        setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return function () {
            window.removeEventListener('online', handleOfflineStatus)
            window.removeEventListener('offline', handleOfflineStatus)
        }
    }, [offlineStatus])
    return (
        <>
            {isloading ? <Splash /> :
                (
                    <div>
                        {offlineStatus && <Offline />}
                        <Header mode="light" cart={cart} />
                        <Hero />
                        <Browse />
                        <Arrived items={items} />
                        <Clients />
                        <AsideMenu />
                        <Footer />
                    </div>)}
        </>
    );
}

export default function AppRoutes() {
    const cacheCart=window.localStorage.getItem("cart")

    const [cart, setCart] = React.useState([])
    function handleAddToCart(item) {
        const currentindex = cart.length
        const newCart = [...cart, { id: currentindex + 1, item }]
        setCart(newCart)
        window.localStorage.setItem("cart",JSON.stringify(newCart))
    }

    function handleRemoveCartItem(event,id){
       const  revisedCart= cart.filter(function(item){
            return item.id !== id
        })
        setCart(revisedCart)
        window.localStorage.setItem("cart",JSON.stringify(revisedCart))

    }

     useEffect(function(){
        console.info("useEffect for localStorage")
        if(cacheCart!== null){
            setCart(JSON.parse(cacheCart))
        }
    },[cacheCart])
    return (
        <BrowserRouter>

            <Routes>


                <Route path="/" element={<App cart={cart} />} />
                <Route path='/profile' element={<Profile/>} />
                <Route path="/details/:id" element={<Details handleAddToCart={handleAddToCart} cart={cart} />} />
                <Route path="/cart" element={<Cart cart={cart} handleRemoveCartItem={handleRemoveCartItem} />} />

            </Routes>
        </BrowserRouter>

    )
}
