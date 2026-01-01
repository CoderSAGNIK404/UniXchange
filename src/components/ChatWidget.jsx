import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Mock Data
    const [conversations, setConversations] = useState([
        { id: 'ai', name: "AI Assistant", avatar: null, lastMessage: "How can I help you today?", unread: 0, online: true, isAI: true },
        { id: 1, name: "Support Team", avatar: null, lastMessage: "How can we help you today?", unread: 2, online: true },
        { id: 2, name: "John Doe", avatar: null, lastMessage: "Is this item still available?", unread: 0, online: false },
        { id: 3, name: "Jane Smith", avatar: null, lastMessage: "Thanks for the quick delivery!", unread: 0, online: true },
    ]);

    const [messages, setMessages] = useState({
        'ai': [
            { id: 1, text: "Hello! I'm your UniXchange AI assistant. Ask me anything about buying, selling, or using the platform.", sender: "them", time: "Now" }
        ],
        1: [
            { id: 1, text: "Hello! Welcome to UniXchange support.", sender: "them", time: "10:00 AM" },
            { id: 2, text: "How can we help you today?", sender: "them", time: "10:01 AM" },
        ],
        2: [
            { id: 1, text: "Hi, I saw your listing for the calculus textbook.", sender: "me", time: "Yesterday" },
            { id: 2, text: "Is this item still available?", sender: "them", time: "Yesterday" },
        ],
        3: [
            { id: 1, text: "Thanks for the quick delivery!", sender: "them", time: "2 days ago" },
        ]
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat, isOpen, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim() || !activeChat) return;

        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
        }));

        const userMessage = inputValue;
        setInputValue('');

        // Handle AI Chat
        if (activeChat.isAI) {
            setIsTyping(true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });

                const data = await response.json();

                if (response.ok) {
                    const aiReply = {
                        id: Date.now() + 1,
                        text: data.reply,
                        sender: "them",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setMessages(prev => ({
                        ...prev,
                        [activeChat.id]: [...prev[activeChat.id], aiReply]
                    }));
                } else {
                    throw new Error(data.message || 'Failed to get response');
                }
            } catch (error) {
                console.error("AI Chat Error:", error);
                const errorReply = {
                    id: Date.now() + 1,
                    text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                    sender: "them",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => ({
                    ...prev,
                    [activeChat.id]: [...prev[activeChat.id], errorReply]
                }));
            } finally {
                setIsTyping(false);
            }
        }
        // Handle Mock Support Chat
        else if (activeChat.id === 1) {
            setTimeout(() => {
                const reply = {
                    id: Date.now() + 1,
                    text: "Thanks for your message! Our team will get back to you shortly.",
                    sender: "them",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => ({
                    ...prev,
                    [activeChat.id]: [...prev[activeChat.id], reply]
                }));
            }, 1000);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: '0',
                            width: '350px',
                            height: '500px',
                            background: 'var(--card-bg)',
                            borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '1rem',
                            background: 'var(--card-bg)',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            {activeChat ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setActiveChat(null)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center' }}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div style={{ fontWeight: '600', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {activeChat.isAI && <Sparkles size={16} color="#8b5cf6" />}
                                        {activeChat.name}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-color)' }}>Messages</div>
                            )}
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-color)' }}>
                            {activeChat ? (
                                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {(messages[activeChat.id] || []).map(msg => (
                                        <div
                                            key={msg.id}
                                            style={{
                                                alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                                                maxWidth: '80%',
                                                padding: '0.8rem 1rem',
                                                borderRadius: '12px',
                                                background: msg.sender === 'me' ? 'var(--primary-color)' : 'var(--card-bg)',
                                                color: msg.sender === 'me' ? 'white' : 'var(--text-color)',
                                                border: msg.sender === 'me' ? 'none' : '1px solid var(--border-color)',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.2rem', textAlign: 'right' }}>{msg.time}</div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                            <Loader2 size={16} className="animate-spin" color="var(--text-secondary)" />
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div>
                                    {conversations.map(chat => (
                                        <div
                                            key={chat.id}
                                            onClick={() => setActiveChat(chat)}
                                            style={{
                                                padding: '1rem',
                                                borderBottom: '1px solid var(--border-color)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: chat.isAI ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }}>
                                                {chat.isAI ? <Sparkles size={20} /> : chat.name.charAt(0)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                    <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>{chat.name}</span>
                                                    {chat.unread > 0 && (
                                                        <span style={{
                                                            background: 'var(--primary-color)',
                                                            color: 'white',
                                                            fontSize: '0.7rem',
                                                            padding: '0.1rem 0.4rem',
                                                            borderRadius: '10px'
                                                        }}>
                                                            {chat.unread}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                                    {chat.lastMessage}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input Area (only in chat view) */}
                        {activeChat && (
                            <div style={{
                                padding: '1rem',
                                background: 'var(--card-bg)',
                                borderTop: '1px solid var(--border-color)',
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    disabled={isTyping}
                                    style={{
                                        flex: 1,
                                        padding: '0.8rem',
                                        borderRadius: '20px',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-color)',
                                        color: 'var(--text-color)',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isTyping}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: isTyping ? 'var(--text-secondary)' : 'var(--primary-color)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: isTyping ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
