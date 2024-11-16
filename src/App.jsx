import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import {RequireAuth} from "./features/auth/RequireAuth.jsx";
import Sell from "./pages/Sell.jsx";
import Buy from "./pages/Buy.jsx";
import NewStore from "./pages/NewStore.jsx";
import {RequireStore} from "./features/store/RequireStore.jsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/profile'} element={
                        <RequireAuth>
                            <Profile/>
                        </RequireAuth>
                    }/>
                    <Route path={'/sell'} element={
                        <RequireAuth>
                            <RequireStore>
                                <Sell/>
                            </RequireStore>
                        </RequireAuth>
                    }/>
                    <Route path={'/buy'} element={
                        <RequireAuth>
                            <RequireStore>
                                <Buy/>
                            </RequireStore>
                        </RequireAuth>
                    }/>
                    <Route path={'/new/store'} element={
                        <RequireAuth>
                            <NewStore />
                        </RequireAuth>
                    }/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/register'} element={<Register/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
