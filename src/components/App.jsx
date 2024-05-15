import "../css/App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Context from "../context/Context.js";

import Layout from "./Layout";
import Home from "./Home";
import Profile from "./Profile";
import Auth from "./Auth";
import FullPost from "./FullPost";
import Register from "./Register";
import CreatePost from "./CreatePost";
import NotFound from "./404";

import "../css/index.css";
import "../css/Auth.css";
import "../css/Profile.css";
import "../css/Nav.css";
import "../css/Post.css";
import "../css/FullPost.css";
import "../css/CreatePost.css";

export default function App() {
    if (!localStorage.getItem("currentUser")) {
        localStorage.setItem("currentUser", JSON.stringify({ currentUser: "guest" }));
    }
    const { currentUser } = JSON.parse(localStorage.getItem("currentUser"));

    const [isLogin, setLogin] = useState(currentUser !== "guest");

    const login = () => setLogin(true);
    const logout = () => setLogin(false);

    return (
        <Context.Provider value={{ login, logout }}>
            <BrowserRouter>
                <Layout isLogin={isLogin} />
                <Routes>
                    <Route>
                        <Route index element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/post/:id" element={<FullPost />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Context.Provider>
    );
}
