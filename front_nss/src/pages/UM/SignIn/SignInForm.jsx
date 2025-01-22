import React from "react";
import { useNavigate } from 'react-router-dom';

import { usePermify } from '@permify/react-role';

import { Box, Button, TextField } from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";

import { useAuth } from "../../../hooks/useAuth"; 

const SignInForm = () => {

  const  { login } = useAuth();
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
        return response.json(); // Разбираем JSON, если статус ответа успешный
      } else if (response.status === 500) {
        throw new Error("Сервер недоступен");
      } else {
        throw new Error("Ошибка авторизации");
      }
    })
    .then(data => {
      if (data && data.access_token) {
        login(data.access_token);
        
        // TODO: данные должны приходить с бэка 
        // Note: один пользователь может иметь несколько ролей
        setUser({
          id: "2",
          roles: ["manager"], 
        })

        navigate("/quoteOsago");
      } else {
        throw new Error("Токен отсутствует в ответе сервера");
      }
    })
    .catch(error => {
      console.error("Ошибка авторизации:", error.message);
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

    </>
  );
};

const checkoutSchema = yup.object().shape({
  email:      yup.string().required("обязательное!"),
  password:   yup.string().required("обязательное!"),
});

const initialValues = {
  email: "",
  password: "",
};

export default SignInForm;