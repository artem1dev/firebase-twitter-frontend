import { Outlet, Link } from "react-router-dom";
import React, { useContext } from "react";
import Context from "../context/Context.js";

export default (props) => {
    const { logout } = useContext(Context);
    const { isLogin } = props;
    const { currentUser, token } = JSON.parse(localStorage.getItem("currentUser"));

    const logoutUser = async () => {
        try {
            localStorage.setItem("currentUser", JSON.stringify({ currentUser: "guest" }));
            logout();
        } catch (err) {}
    };

    return (
        <>
            <nav className="menu-bar">
                <div className="group">
                    <Link to="/" className="itemF">
                        Home
                    </Link>
                    {isLogin ? (
                        <Link to="/create-post" className="itemP">
                            Create Post
                        </Link>
                    ) : null}
                </div>
                <div className="group">
                    {isLogin ? (
                        <>
                            <div className="group1">
                                <Link to={`/profile/${currentUser.userData.userId}`} className="item">
                                    Profile
                                </Link>
                            </div>
                            <div className="group1" onClick={async () => await logoutUser()}>
                                <Link to="/" className="item">
                                    Logout
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="group1">
                                <Link to="/auth" className="item">
                                    Sign In
                                </Link>
                            </div>
                            <div className="group1">
                                <Link to="/register" className="item">
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
};
