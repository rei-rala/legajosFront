import React, { useEffect, useState } from "react";

/*
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import styles from "./LogInForm.module.css";
import { Credentials, loginApiForm, userService } from "services/user.services";
import { useLoading } from "context";
import { NextRouter, useRouter } from "next/router";

const LogInSchema = Yup.object().shape({
  username: Yup.string()
    .required("El nombre de usuario es requerido")
    .min(5, "El nombre de usuario debe tener al menos 5 caracteres")
    .max(20, "El nombre de usuario debe tener menos de 20 caracteres"),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(5, "La contraseña debe tener al menos 5 caracteres")
    .max(20, "La contraseña debe tener menos de 20 caracteres")
}); 3


interface Props {
  router: NextRouter;
}


const LogInForm: React.FC<Props> = ({ router }) => {
  const { pushLoading, popLoading } = useLoading();
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(credentials: Credentials) {
    if (submitting) {
      alert("Submitting");
      return;
    }
    return Promise.resolve()
      .then(() => {
        setSubmitting(true)
        pushLoading("loggingIn")
      })
      .then(() => userService.login(credentials.username, credentials.password))
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query?.returnUrl ? router.query?.returnUrl[0] : '/' as string;
        router.push(returnUrl);
      })
      .catch(err => {
        alert("Error!\n\t" + (err.message ?? err) || "Error no especificado")
        //setError('apiError', { message: error.message || error });
      })
      .finally(() => {
        popLoading("loggingIn")
        setSubmitting(false);
      })
  }


  useEffect(() => {
    // Will find the first input and focus it
    const input = document.querySelector("input");
    if (input) {
      input.focus();
    }
  }, []);


  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LogInSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre de usuario</label>
            <Field name="username" type="text" autoFocus={true} className={errors.username && touched.username ? styles.inpErr : ""} />
            {errors.username && touched.username && <span>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <Field name="password" type="password" className={errors.password && touched.password ? styles.inpErr : ""} />
            {errors.password && touched.password && <span>{errors.password}</span>}
          </div>

          <button type="submit" disabled={submitting}>Iniciar sesión</button>
        </Form>
      )}
    </Formik>
  )
}


export default LogInForm; */