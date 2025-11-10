import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import Welcome from "./pages/Welcome"
import About from "./pages/About"
import BucketList from "./pages/BucketList"
import Map from "./pages/Map"
import UserProfile from "./pages/UserProfile"
import SearchUsers from "./pages/SearchUsers"
import EditProfile from "./pages/EditProfile"
import Messages from "./pages/Messages"
import PrivateRoute from "./components/PrivateRoute"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Welcome />} />
          <Route path="/about" exact element={<About />} />

          <Route element={<PrivateRoute />}>
            <Route path="/home" exact element={<Home />} />
            <Route path="/bucket-list" exact element={<BucketList />} />
            <Route path="/map" exact element={<Map />} />
            <Route path="/search-users" exact element={<SearchUsers />} />
            <Route path="/user/:userId" exact element={<UserProfile />} />
            <Route path="/edit-profile" exact element={<EditProfile />} />
            <Route path="/messages/:userId?" exact element={<Messages />} />
          </Route>

          <Route path="/login" exact element={<Login />} />
          <Route path="/sign-up" exact element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
