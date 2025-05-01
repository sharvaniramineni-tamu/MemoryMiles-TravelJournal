import React, { useState, useEffect, useContext, useRef } from "react";
import Navbar from "../components/Navbar";
import "../styles/login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../authContext";
import { jwtDecode } from "jwt-decode";

function Login() {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
    });

    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    // Define the refs
    const userRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]);

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            // Use refs here instead of credentials state
            const res = await axios.post("http://localhost:5500/api/users/login", {
                username: userRef.current.value, // Access username from the ref
                password: passwordRef.current.value, // Access password from the ref
            });
            const token = res.data.token;
            const decodedToken = jwtDecode(token);

            const user = {
                _id: decodedToken.userId,
                username: userRef.current.value, // You can also use decodedToken.username
            };

            // Save user details and token to localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(user));

            // Dispatch login success
            console.log("User logged in:", user);

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: user
            });

            // Redirect to home page after login
            setTimeout(() => {
                navigate('/');
            }, 0);
        } catch (err) {
            if (err.response && err.response.data) {
                dispatch({
                    type: "LOGIN_FAILURE",
                    payload: err.response.data
                });
            } else {
                dispatch({
                    type: "LOGIN_FAILURE",
                    payload: "An error occurred while logging in"
                });
            }
        }
    };

    return (
        <div className="auth-background">
        <div className="login">
            {/* <Navbar /> */}
            <div className="loginCard">
                <div className="center">
                    <h1>Welcome Back!</h1>
                    <form>
                        <div className="txt_field">
                            <input
                                type="text"
                                placeholder="username"
                                id="username"
                                onChange={handleChange}
                                className="lInput"
                                ref={userRef} // Attach userRef here
                            />
                        </div>
                        <div className="txt_field">
                            <input
                                type="password"
                                placeholder="password"
                                id="password"
                                onChange={handleChange}
                                className="lInput"
                                ref={passwordRef} // Attach passwordRef here
                            />
                        </div>
                        <div className="login_button">
                            <button className="btn" onClick={handleClick}>
                                Login
                            </button>
                        </div>
                        <div className="signup_link">
                            <p>
                                Not registered?
                                <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Login;
