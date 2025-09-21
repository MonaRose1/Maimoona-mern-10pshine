import React,{ useState } from 'react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
};



  return (
    <>
    <div className='flex justify-center items-center mt-28 '>
        <div className="w-96 border rounded bg-white px-7 py-10">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-5 ">Signup</h2>
                <input type = 'text' placeholder = 'username' className="input-box" value={username} onChange={(e) => setUsername (e.target.value)}/>
            <input type = 'text' placeholder = 'email' className="input-box" value={email} onChange={(e) => setEmail (e.target.value)}/>
                <input type = 'text' placeholder = 'password' className="input-box" value={password} onChange={(e) => setPassword (e.target.value)}/>
                <button className="btn-primary">Submit</button>
                <p className= "text-gray-600 text-sm mt-5">Already have an account? <a href = '/login'> Log in</a></p>

            </form>
        </div>
    </div>
    </>
  );
};

export default Signup;