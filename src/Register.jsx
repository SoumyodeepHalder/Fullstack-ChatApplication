import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ username, setUsername, password, setPassword }) => {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePassChange = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("starting process of registering a new user and showing all available users ---");
        console.log("1. registreation page submitted: ", username, password);

        const trimmedUsername = username.trim();

        if (!trimmedUsername || !password) {
            alert('Please fill out all fields.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://auth-gateway-api-fawn.vercel.app/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: trimmedUsername, password: password }),
            });

            const data = await response.json();
            console.log("2. recived response: ", data);

            if (response.ok) {
                // Backend returns status 200 on successful match
                console.log("3. redirecting to home page");
                navigate('/Home');
            } else {
                // Handle backend error messages
                alert(data.message || 'An error occurred during submission. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            alert('An error occurred during submission. Please try again.');
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
    };

    return (
        <div class="bg-[#121212] min-h-screen flex items-center justify-center p-4 relative font-sans text-white select-none">

            {/* <!-- Back Arrow Button --> */}
            <button id="backBtn"
                class="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-[#242424] rounded-full hover:bg-[#333] transition-colors focus:outline-none"
                aria-label="Go back">
                <i class="fas fa-arrow-left text-lg"></i>
            </button>

            {/* <!-- Login Container Card --> */}
            <main class="bg-[#242424] w-full max-w-[500px] rounded-2xl px-8 py-12 md:px-12 md:py-16 shadow-2xl text-center">

                {/* <!-- Header Text --> */}
                <h1 class="text-4xl md:text-5xl font-normal tracking-wide mb-10 text-white">Register</h1>

                {/* <!-- Interactive Form --> */}
                <form id="loginForm" class="space-y-6 text-left" novalidate>

                    {/* <!-- Username Input Field Group --> */}
                    <div class="space-y-2">
                        <label for="username"
                            class="block text-sm md:text-base font-normal tracking-wide text-[#CCCCCC]">Username</label>
                        <input type="text" value={username} onChange={handleUsernameChange} id="username" name="username" required
                            class="w-full h-11 bg-white text-black px-4 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#EE8133] transition-all text-base" />
                    </div>

                    {/* <!-- Password Input Field Group --> */}
                    <div class="space-y-2">
                        <label for="password"
                            class="block text-sm md:text-base font-normal tracking-wide text-[#CCCCCC]">Password</label>
                        <input type="password" value={password} onChange={handlePassChange} id="password" name="password" required
                            class="w-full h-11 bg-white text-black px-4 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#EE8133] transition-all text-base" />
                    </div>

                    {/* <!-- Utility Actions Row (Remember / Forgot) --> */}
                    <div class="flex items-center justify-between text-xs md:text-sm pt-2 text-[#CCCCCC]">
                        <label class="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" id="rememberMe"
                                class="w-4 h-4 rounded border-gray-300 text-[#EE8133] focus:ring-[#EE8133] bg-transparent cursor-pointer" />
                            <span class="group-hover:text-white transition-colors">Remember me</span>
                        </label>
                        <Link to="/" id="forgotPassword" class="hover:text-white hover:underline transition-colors">Forgot
                            Password?</Link>
                    </div>

                    {/* <!-- Submit Submission Button Call-To-Action --> */}
                    <div class="pt-4 flex justify-center">
                        <button type="submit" id="submitBtn" onClick={handleSubmit}
                            class="w-44 h-11 bg-[#EE8133] text-white font-medium rounded-xl hover:bg-[#d66f25] active:scale-95 transition-all text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#242424] focus:ring-[#EE8133]">
                            {isLoading ? 'Verifying...' : 'Submit'}
                        </button>
                    </div>
                </form>

                {/* <!-- Registration Route Context Switcher --> */}
                <footer class="mt-8 text-xs md:text-sm text-[#CCCCCC]">
                    Already have an account?
                    <Link to="/register" id="registerLink"
                        class="text-white underline hover:text-[#EE8133] transition-colors ml-1">Login</Link>
                </footer>
            </main>
        </div>
    )
}

export default Register
