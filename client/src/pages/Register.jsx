import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/register.css";
import "../styles/AuthPageStyles.css";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = new FormData();
            if (file) {
                data.append("file", file);
            }
            data.append("username", info.username);
            data.append("email", info.email);
            data.append("password", info.password);

            console.log("Submitting Registration Data:", Object.fromEntries(data));

            const response = await axios.post("http://localhost:5500/api/users/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Registration Success:", response.data);
            navigate("/login");
        } catch (err) {
            console.error("Registration Error:", err.response ? err.response.data : err.message);
            setError(err.response?.data?.error || "Registration failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-container">
        <div className="register">
            {/* <Navbar /> */}
            <div className="registerCard">
                <div className="center">
                    <h1>Join Us</h1>
                    <form onSubmit={handleClick}>
                        <div className="image">
                            <img
                                src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                alt="Profile"
                                height="100px"
                            />
                            <div className="txt_field_img">
                                <label htmlFor="file">
                                    Image
                                    <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>
                        <div className="formInput">
                            <div className="txt_field">
                                <input type="text" placeholder="Username" id="username" value={info.username} onChange={handleChange} required />
                            </div>
                            <div className="txt_field">
                                <input type="email" placeholder="Email" id="email" value={info.email} onChange={handleChange} required />
                            </div>
                            <div className="txt_field">
                                <input type="password" placeholder="Password" id="password" value={info.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="login_button">
                            <button className="button" type="submit" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <div className="signup_link">
                            <p>Already Registered? <Link to="/login">Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
        </div>
    );
}

export default Register;
