import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import routes from "../routes.js";
import axios from "axios";

const validationComment = yup.object({
    content: yup.string().required("comment can't be empty").trim(),
});

export default function CreateReplyCommentPost({ postId, parentId }) {
    const dispatch = useDispatch();
    const { currentUser, token } = JSON.parse(localStorage.getItem("currentUser"));

    const inputRef = useRef();
    const [isEdite, setEdite] = useState(false);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            content: "",
        },
        validationSchema: validationComment,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values) => {
            try {
                const response = await axios.post(
                    routes.createPostComment(),
                    {
                        content: values.content,
                        parentId: parentId,
                        postId: postId,
                    },
                    {
                        headers: {
                            authorization: token,
                        },
                    },
                );
                toast.info(response.data.massage);
                window.location.reload();
            } catch (err) {
                if (err.isAxiosError && err.response.status === 400) {
                    const responseErrors = err.response.data.errors.errors;
                    responseErrors.map((err) => toast.error(`${err.param}: ${err.msg}`));
                    inputRef.current?.select();
                    return;
                }
                throw err;
            }
        },
        onChange: async () => {},
    });

    return (
        <form onSubmit={formik.handleSubmit} className="CreateReplyCommentPostForm">
            <div>
                <div>
                    <label htmlFor="content">Add reply:</label>
                </div>
                <textarea
                    id="content"
                    className="CommentInput"
                    name="content"
                    type="text"
                    placeholder="Enter comment"
                    onClick={(e) => setEdite(true)}
                    onChange={formik.handleChange}
                    value={formik.values.content}
                    required
                />
            </div>
            {isEdite ? (
                <div className="CommentBtnBlock">
                    <button className="PostComment_btn" type="submit">
                        Reply
                    </button>
                </div>
            ) : null}
        </form>
    );
}
