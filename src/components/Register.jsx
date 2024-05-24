import React, { useRef, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import routes from "../routes.js";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase-config.js";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const validationRegister = yup.object({
    email: yup.string().required("Cannot be blank").trim().min(6, "email short").max(24, "email long"),
    password: yup.string().required("Cannot be blank").trim().min(8, "Password short"),
    passwordConfirm: yup
        .string()
        .required("Cannot be blank")
        .oneOf([yup.ref("password")], "Passwords do not match"),
});

export default function Register() {
    const inputRef = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const db = getFirestore();
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);
            const parts = user.displayName.split(" ");
            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    userId: user.uid,
                    email: user.email,
                    name: parts[0],
                    lastname: parts[1],
                    createdAt: new Date(),
                });
            }
            navigate("/auth");
        } catch (error) {
            console.error("Error during sign-in or user document creation: ", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            passwordConfirm: "",
            name: "",
            lastName: "",
            terms: false,
        },
        validationSchema: validationRegister,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values) => {
            if (values.terms !== true) {
                toast.warning(`You didn't agree with the terms and conditions of use!`);
                return;
            }
            try {
                await axios.post(routes.registerPath(), {
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.passwordConfirm,
                    name: values.name,
                    lastName: values.lastName,
                });
                navigate("/auth");
            } catch (err) {
                if (err.isAxiosError && err.response.status === 400) {
                    const responseErrors = err.response.data.errors.errors;
                    console.log(err);
                    responseErrors.map((err) => toast.error(`${err.param}: ${err.msg}`));
                    inputRef.current?.select();
                    return;
                }
                throw err;
            }
        },
    });

    return (
        <div className="divFormBlock">
            <form onSubmit={formik.handleSubmit} className="Main_Form">
                <h1>Sing Up</h1>
                <div>
                    <div>
                        <label htmlFor="email">Email</label>{" "}
                        <span className="Errors">{formik.errors.email ? formik.errors.email : null}</span>
                    </div>
                    <div>
                        <input
                            id="email"
                            className="inputField"
                            name="email"
                            placeholder="Enter email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            autoComplete="email"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="password">Password</label>{" "}
                        <span className="Errors">{formik.errors.password ? formik.errors.password : null}</span>
                    </div>
                    <div>
                        <input
                            id="password"
                            className="inputField"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            autoComplete="password"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="password-confirm">Password confirm</label>{" "}
                        <span className="Errors">
                            {formik.errors.passwordConfirm ? formik.errors.passwordConfirm : null}
                        </span>
                    </div>
                    <div className="relative mt-1">
                        <input
                            id="password-confirm"
                            className="inputField"
                            name="passwordConfirm"
                            type="password"
                            placeholder="Enter password confirm"
                            onChange={formik.handleChange}
                            value={formik.values.passwordConfirm}
                            autoComplete="passwordConfirm"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="Name">Name</label>{" "}
                        <span className="Errors">{formik.errors.name ? formik.errors.name : null}</span>
                    </div>
                    <div>
                        <input
                            id="Name"
                            className="inputField"
                            name="Name"
                            placeholder="Enter name"
                            onChange={formik.handleChange}
                            value={formik.values.Name}
                            autoComplete="Name"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <label htmlFor="login">LastName</label>{" "}
                        <span className="Errors">{formik.errors.lastName ? formik.errors.lastName : null}</span>
                    </div>
                    <div>
                        <input
                            id="lastName"
                            className="inputField"
                            name="lastName"
                            placeholder="Enter lastName"
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            autoComplete="lastName"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <input
                            id="terms"
                            aria-describedby="terms"
                            type="checkbox"
                            onChange={formik.handleChange}
                            checked={formik.values.terms}
                        />{" "}
                        <label htmlFor="terms">I accept the Terms and Conditions</label>
                    </div>
                </div>
                <button type="submit" className="Submit_btn">
                    Sign Up
                </button>
                <button onClick={handleSignIn} className="SubmitGoogle_btn">
                    Sign Up with google <img alt="some" src="/google.png" className="userimg" />
                </button>
                <p>
                    Already have an account?
                    <a href="/auth">Sign in</a>
                </p>
            </form>
        </div>
    );
}
