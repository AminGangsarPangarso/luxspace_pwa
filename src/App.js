import React from 'react';
import Header from './components/Header';
import Hero from './Hero';
import Browse from './components/Browse';
import Arrived from './components/Arrieved';
import Clients from './components/Clients';
import AsideMenu from './components/AsideMenu';
import Footer from './components/Footer';
import Offline from './components/Offline';

function App() {

    const [items, setItems] = React.useState([])
    const [offlineStatus,setOfflineStatus]=React.useState(!navigator.onLine)

    function handleOfflineStatus (){
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

        window.addEventListener('online',handleOfflineStatus)
        window.addEventListener('offline',handleOfflineStatus)

        return function (){
            window.removeEventListener('online',handleOfflineStatus)
            window.removeEventListener('offline',handleOfflineStatus)
        }
    }, [offlineStatus])
    return (
        <>
        {offlineStatus && <Offline />}
            <Header />
            <Hero />
            <Browse />
            <Arrived items={items} />
            <Clients />
            <AsideMenu />
            <Footer />
        </>
    );
}

export default App;
