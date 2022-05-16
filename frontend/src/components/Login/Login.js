import React from 'react';
import IdentityForm from '../IdentityForm/IdentityForm';

function Login(props) {
  
  return ( 
    <IdentityForm name="sign-in" title="Вход" buttonText="Войти" onSubmit={props.onSubmit}>
      <input value={props.values.email} onChange={props.onChange} className="identity__input identity__input_type_email" required type="text" name="email" placeholder="Email"/>
      <input value={props.values.password} onChange={props.onChange} className="identity__input identity__input_type_activity" required type="password" name="password" placeholder="Пароль"/>
    </IdentityForm>
  )
}

export default Login