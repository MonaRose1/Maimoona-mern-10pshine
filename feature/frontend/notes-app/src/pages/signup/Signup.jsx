import React from 'react';
const Signup = () => {
  return (
    <>
    <div>
        <div><p>Signup</p></div>
        <div><input type = 'text' placeholder = 'username' /></div>
        <div><input type = 'text' placeholder = 'email' /></div>
        <div><input type = 'text' placeholder = 'password' /></div>
        <div><button>Submit</button></div>
        <div><p>Already have an account? <a href = '/login'> Login</a></p></div>

    
    </div>
    </>
  );
};

export default Signup;