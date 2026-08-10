import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Home = ({ username, password }) => {
    const [currentRecipient, setCurrentRecipient] = useState('Bikash');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [itemIndex, setItemIndex] = useState(0);
    
    //tracking mobile sidebar placement
    const [isSidebarOpen, setIsSidebarOpen]=useState(true);
    
    const navigate=useNavigate();
    const socketRef=useRef (null);

    
    
    useEffect(() => {
        if (username===''){
            navigate('/');
        }
        
        socketRef.current = io('https://socket-stream-api.vercel.app/', {
            transports: ['websocket'],
            upgrade: false
        });
        


        socketRef.current.on('connect', () => {
            if (username!==''){
                socketRef.current.emit('register_user', username);
            }
        });

        socketRef.current.on('receive_message', (data) => {
            setCurrentRecipient((latestRecipient) => {
                if (data.sender === latestRecipient) {
                    setMessages((prev) => [...prev, { sender: data.sender, message: data.message }]);
                } else {
                    console.log('new unread message');
                }
                return latestRecipient;
            })
        })
        socketRef.current.on('chat-history', (historyData) => {
            setMessages(historyData);
        });

        socketRef.current.on('online_users', (data)=>{
            setUsers(data.filter(item => item !== username));
            socketRef.current.emit('chat-history', data[0]);
        });

        // --- Integrated jQuery Responsive Viewport Setup ---
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true); // Don't translate sidebar out of sight on desktop
            } else {
                setIsSidebarOpen(false); // Hide overlay on mobile view initially
            }
        };

        // Initialize dynamic viewport layout settings configurations
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [username, navigate]);



    // 2. Handler to send outgoing messages
    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socketRef.current) return;

        const messageData = {
            sender: username,
            recipient: currentRecipient,
            message: inputMessage
        };

        // Emit message to backend
        socketRef.current.emit('private_message', messageData);

        // Optimistically add message to your own UI screen
        setMessages((prev) => [...prev, { sender: username, message: inputMessage }]);
        setInputMessage('');
    };



    return (
        <div className="bg-[#242424] text-white font-sans h-screen flex flex-col overflow-hidden">
            {/* <!-- Main Workspace Container --> */}
            <div className="flex flex-1 h-full relative overflow-hidden">

                {/* <!-- SIDEBAR: Contacts List --> */}
                {/* <!-- Responsive: Full-screen overlay on mobile screens (< md), sidebar layout on desktops (md+) --> */}
                <aside id="sidebar"
                    className={`w-full md:w-80 bg-[#1a1a1a] flex flex-col z-20 absolute md:static inset-y-0 left-0 transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    {/* <!-- Sidebar Header Brand Logo --> */}
                    <div className="p-5 flex items-center justify-between border-b border-zinc-800">
                        <div className="flex items-center gap-1 text-2xl font-semibold tracking-wide">
                            <span className="text-[#ff6a00]">Q</span><span>uickChat</span>
                        </div>
                    </div>

                    {/* <!-- Contacts Navigation Stream --> */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-2">
                        {/* <!-- Contact item entry --> */}
                        {users.map((item, index) => (
                            item!==username?
                            <button
                                className={`contact-btn w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition ${itemIndex === index ? 'bg-zinc-700/70 border-l-4 border-[#ff6a00]' : 'bg-zinc-800/40 hover:bg-zinc-800'}`} onClick={() => {
                                    setItemIndex(index);
                                    setCurrentRecipient(item);

                                    // Auto-hide sidebar overlay switch logic targeting mobile
                                    if (window.innerWidth < 768) {
                                        setIsSidebarOpen(false);
                                    }
                                    
                                    // Use socketRef.current safely here
                                    if (socketRef.current) {
                                        socketRef.current.emit('chat-history', item);
                                    }
                                }}
                                data-name="Anand">
                                <div
                                    className="w-11 h-11 bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 text-lg">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <span className="font-medium text-zinc-200">{item}</span>
                            </button>:''
                        ))}
                    </nav>
                </aside>

                {/* <!-- MAIN CHAT VIEW WINDOW --> */}
                <main className="flex-1 flex flex-col bg-[#2a2a2a] relative h-full">

                    {/* <!-- Chat Window Header --> */}
                    <header className="h-16 border-b border-zinc-800/60 flex items-center justify-between px-4 bg-[#242424]">
                        <div className="flex items-center gap-3">
                            {/* <!-- Responsive Mobile back button inside header context --> */}
                            <button id="back-to-list"
                            onClick={()=> setIsSidebarOpen(true)}
                                className="md:hidden text-zinc-400 hover:text-white text-xl pr-2 focus:outline-none">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            {/* <!-- Current active user header layout --> */}
                            <div
                                className="w-9 h-9 bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 text-sm">
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <h2 id="active-chat-user" className="font-medium text-zinc-100 text-base">{users[itemIndex]}</h2>
                        </div>
                        {/* <!-- Menu / Navigation utilities --> */}
                        <button className="text-zinc-400 hover:text-white p-2 rounded-lg text-xl focus:outline-none">
                            <i className="fa-solid fa-user mr-2"></i>
                            <span id="user">{username}</span>
                        </button>
                    </header>

                    {/* <!-- Chat Message Streams Viewport Container --> */}
                    <div id="chat-box" className="flex-1 overflow-y-auto p-6 space-y-6">
                        <p className="text-xs text-center text-gray-500 my-4">Conversation started with Bikashh</p>
                        {messages.map((item) => (
                            <div className={`flex ${item.sender === username ? 'items-end justify-end ml-auto' : 'items-start'} max-w-[85%] sm:max-w-xl animate-fade-in`}>
                                <div
                                    className={`bg-[#505050] text-zinc-100 py-3 px-5 rounded-2xl ${item.sender === username ?'rounded-tr-sm': 'rounded-tl-sm'} text-sm relative shadow-md leading-relaxed`}>
                                    {item.message}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <!-- Messages Composing Input Toolbar Footer --> */}
                    <footer className="p-4 bg-[#242424]/40 border-t border-zinc-800/40">
                        <form id="chat-form" onSubmit={sendMessage} className="relative max-w-4xl mx-auto flex items-center">
                        <input 
                                type="text" 
                                id="message-input" 
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type message here..."
                                className="w-full bg-[#3a3a3a] text-zinc-100 placeholder-zinc-500 pl-5 pr-14 py-3.5 rounded-full border border-zinc-700/50 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] text-sm transition" 
                            />
                            <button type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4a4a4a] text-white rounded-full flex items-center justify-center hover:bg-[#ff6a00] transition active:scale-95 focus:outline-none">
                                <i
                                    className="fa-solid fa-paper-plane text-xs transform rotate-45 -translate-x-[1px] -translate-y-[1px]"></i>
                            </button>
                        </form>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default Home
