import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import {RequireAuth} from "./features/auth/RequireAuth.jsx";
import Sell from "./pages/store/Sell.jsx";
import Buy from "./pages/store/Buy.jsx";
import NewStore from "./pages/store/NewStore.jsx";
import {RequireStore} from "./features/store/RequireStore.jsx";
import {RequireSeller} from "./features/store/RequireSeller.jsx";
import {RequireBuyer} from "./features/store/RequireBuyer.jsx";
import NewItem from "./pages/item/NewItem.jsx";
import EditItem from "./pages/item/EditItem.jsx";
import UpdateStore from "./components/store/UpdateStore.jsx";
import {RequireAdmin} from "./features/store/RequireAdmin.jsx";

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
                                <RequireSeller>
                                    <Sell/>
                                </RequireSeller>
                            </RequireStore>
                        </RequireAuth>
                    }/>
                    <Route path={'/buy'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireBuyer>
                                    <Buy/>
                                </RequireBuyer>
                            </RequireStore>
                        </RequireAuth>
                    }/>
                    <Route path={'/new/item'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireBuyer>
                                    <NewItem />
                                </RequireBuyer>
                            </RequireStore>
                        </RequireAuth>
                    } />
                    <Route path={'/edit/item/:id'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireBuyer>
                                    <EditItem />
                                </RequireBuyer>
                            </RequireStore>
                        </RequireAuth>
                    } />
                    <Route path={'/edit/store'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireAdmin>
                                    <UpdateStore />
                                </RequireAdmin>
                            </RequireStore>
                        </RequireAuth>
                    } />
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
