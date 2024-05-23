import React, { useRef, useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { auth } from '../firebase-config.js';
import { sendPasswordResetEmail } from 'firebase/auth';

const validationReset = yup.object({
	email: yup.string().required('Cannot be blank').trim().email()
});

export default function ResetPassword() {
	const inputRef = useRef();
	const navigate = useNavigate();
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const formik = useFormik({
		initialValues: {
			email: ''
		},
		validationSchema: validationReset,
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: async (values) => {
			try {
				await sendPasswordResetEmail(auth, values.email);
				navigate('/');
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
		}
	});

	return (
		<div className="divFormBlock">
			<form onSubmit={formik.handleSubmit} className="Main_Form">
				<h1>Reset Password</h1>
				<div>
					<div>
						<label htmlFor="email">
							Email
						</label>
						<span className="Errors">
							{formik.errors.email ? formik.errors.email : null}
						</span>
					</div>
					<div>
						<input
							id="email"
							className="inputField"
							name="email"
							placeholder="Enter email"
							ref={inputRef}
							onChange={formik.handleChange}
							value={formik.values.email}
							autoComplete="email"
						/>
					</div>
				</div>
				<br />
				<button type="submit" className="Submit_btn">
					Reset
				</button>
				
			</form>
		</div>
	);
};

