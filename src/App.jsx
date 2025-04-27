import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Layout} from "./Layout.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import {RequireAuth} from "./features/auth/RequireAuth.jsx";
import Sell from "./pages/store/Sell.jsx";
import Buy from "./pages/store/Buy.jsx";
import {RequireStore} from "./features/store/RequireStore.jsx";
import {RequireSeller} from "./features/store/RequireSeller.jsx";
import {RequireBuyer} from "./features/store/RequireBuyer.jsx";
import NewItem from "./pages/item/NewItem.jsx";
import EditItem from "./pages/item/EditItem.jsx";
import "./App.css"
import ViewItem from "./pages/item/ViewItem.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path={'/'} element={
                        <RequireAuth>
                            <Profile/>
                        </RequireAuth>
                    }/>
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
                    <Route path={'/sell/view/:id'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireSeller>
                                    <ViewItem />
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
                    <Route path={'/buy/new'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireBuyer>
                                    <NewItem />
                                </RequireBuyer>
                            </RequireStore>
                        </RequireAuth>
                    } />
                    <Route path={'/buy/edit/:id'} element={
                        <RequireAuth>
                            <RequireStore>
                                <RequireBuyer>
                                    <EditItem />
                                </RequireBuyer>
                            </RequireStore>
                        </RequireAuth>
                    } />
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/register'} element={<Register/>}/>
                    <Route path={'/*'} element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
