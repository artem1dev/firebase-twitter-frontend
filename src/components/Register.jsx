import React, { useRef, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import routes from "../routes.js";

const validationRegister = yup.object({
    login: yup.string().required("Cannot be blank").trim().min(6, "Login short").max(24, "Login long"),
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

    const formik = useFormik({
        initialValues: {
            login: "",
            password: "",
            passwordConfirm: "",
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
                const response = await axios.post(routes.registerPath(), {
                    login: values.login,
                    password: values.password,
                    confirmPassword: values.passwordConfirm,
                });
                toast.info(response.data.massage);
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
                        <label htmlFor="login">Login</label>{" "}
                        <span className="Errors">{formik.errors.login ? formik.errors.login : null}</span>
                    </div>
                    <div>
                        <input
                            id="login"
                            className="inputField"
                            name="login"
                            placeholder="Enter login"
                            onChange={formik.handleChange}
                            value={formik.values.login}
                            autoComplete="login"
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
                        <input
                            id="terms"
                            aria-describedby="terms"
                            type="checkbox"
                            onChange={formik.handleChange}
                            checked={formik.values.terms}
                        />{" "}
                        <label htmlFor="terms">
                            I accept the <a href="#">Terms and Conditions</a>
                        </label>
                    </div>
                </div>
                <button type="submit" className="Submit_btn">
                    Sign Up
                </button>
                <p>
                    Already have an account?
                    <a href="/auth">Sign in</a>
                </p>
            </form>
        </div>
    );
}
