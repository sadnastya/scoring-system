import React from "react";
import { useNavigate } from 'react-router-dom';

import { usePermify } from '@permify/react-role';

import { Box, Button, TextField, Modal, Typography } from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";

import { useAuth } from "../../../hooks/useAuth";

const SignInForm = () => {
  const [IsOpenError, setOpenError] = React.useState(false);
  const [error_message, setErrorMessage] = React.useState("");


  const handleCloseError = () => setOpenError(false);

  const handleOpenError = (error) => {
    setErrorMessage(error)
    setOpenError(true)
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 150,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



  const { login } = useAuth();
  const { setUser } = usePermify();

  const navigate = useNavigate();

  const handleFormSubmit = (values) => {
    const address = 'http://90.156.156.3:5000/api/auth/login';
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }

    fetch(address, params)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response);
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        if (data && data.access_token) {
          login(data.access_token);


          setUser({
            id: "1",
            roles: data.roles,
          })

          navigate("/quoteOsago");
        }
      })
      .catch(error => {
        handleOpenError("Ошибка авторизации: " + error.message);
      });
  };

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              minWidth="420px"
              gap={3}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Введите email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Введите пароль"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Box>

                <Button type="submit" color="secondary" variant="contained">
                  Войти
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>

      <Box>
        <a href="/signup">Восстановить пароль</a>
      </Box>

      <Modal
        open={IsOpenError}
        onClose={handleCloseError}>
        <Box sx={style} display={"grid"}>
          <Typography variant='h5' marginBottom={"auto"}>{error_message}</Typography>

          <Button onClick={handleCloseError} color="secondary" >Close</Button>
        </Box>
      </Modal>

    </>
  );
};

const checkoutSchema = yup.object().shape({
  email: yup.string().required("обязательное!"),
  password: yup.string().required("обязательное!"),
});

const initialValues = {
  email: "",
  password: "",
};

export default SignInForm;