import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const AuthLayout = ({ onSuccess, onError, mode = '' }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[240px]">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          theme="filled_black"
          shape="rectangular"
          size="large"
          width="100%"
          text={mode === 'login' ? 'signin_with' : 'signup_with'}
          useOneTap={false}
        />
      </div>
    </div>
  );
};

export default AuthLayout;