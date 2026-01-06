// components/MasterToolsInterface.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAppCore, useAuth, useApiKeys } from '../contexts/AppContext';
import type { User } from '../types';
import { AuthOverlay } from './AuthOverlay';
import { Button, Spinner, TextArea, Switch } from './ui';
import { BrainIcon, SparklesIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { Tooltip } from './ui/Tooltip';

const MASTER_TOOLS_SYSTEM_INSTRUCTION = `
Você é um Mestre de RPG experiente e apaixonado, especializado em criar conteúdo para campanhas de fantasia, aventura e universos inspirados em anime/manga. Sua comunicação é:
- Visual e cinematográfica - descreva cenas com detalhes sensoriais
- Criativa e imersiva - construa atmosferas envolventes
- Referências autênticas de cultura otaku, manhwa, manga e gaming
- Tom de entusiasta que domina o assunto
- Use formatação Markdown para melhorar a legibilidade (negrito, itálico, listas).
`;

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl lg:max-w-2xl px-4 py-3 rounded-lg ${isUser ? 'bg-indigo-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <pre className="text-sm whitespace-pre-wrap font-sans">{message.content}</pre>
            </div>
        </div>
    );
};

export const MasterToolsInterface: React.FC = () => {
    const { isAuthenticated, user, handleLoginClick } = useAuth();
    const { geminiApiKey } = useApiKeys();
    
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [thinkingMode, setThinkingMode] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const saveChatHistory = useCallback(async (currentHistory: ChatMessage[]) => {
        if (!user) return;
        try {
            await fetch('/api/masterChatHistory', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User': JSON.stringify(user)
                },
                body: JSON.stringify({ history: currentHistory })
            });
        } catch (error) {
            console.error("Failed to save chat history:", error);
        }
    }, [user]);

    useEffect(() => {
        const initializeChat = async () => {
            if (user && geminiApiKey) {
                setIsHistoryLoading(true);
                try {
                    // Fetch history
                    const historyRes = await fetch('/api/masterChatHistory', {
                        headers: { 'X-User': JSON.stringify(user) }
                    });
                    const pastMessages: ChatMessage[] = await historyRes.json();
                    const recentMessages = pastMessages.slice(-50);
                    setHistory(recentMessages);

                    // Initialize Gemini Chat
                    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                    
                    const model = thinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
                    const config: any = {
                        systemInstruction: MASTER_TOOLS_SYSTEM_INSTRUCTION,
                    };
                    if (thinkingMode) {
                        config.thinkingConfig = { thinkingBudget: 32768 };
                    }

                    const chatSession = ai.chats.create({
                        model,
                        config,
                        history: recentMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
                    });
                    setChat(chatSession);
                } catch (error) {
                    console.error("Failed to initialize chat:", error);
                } finally {
                    setIsHistoryLoading(false);
                }
            } else {
                setIsHistoryLoading(false);
            }
        };
        initializeChat();
    }, [user, geminiApiKey, thinkingMode]);

     useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history, isLoading]);

    const handleSend = async () => {
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: userInput };
        const newHistory = [...history, userMessage];
        setHistory(newHistory);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: userInput });
            const modelMessage: ChatMessage = { role: 'model', content: response.text ?? '' };
            const finalHistory = [...newHistory, modelMessage];
            setHistory(finalHistory);
            await saveChatHistory(finalHistory);
        } catch (error: any) {
            console.error("Gemini chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: `Ocorreu um erro: ${error.message}` };
            const finalHistory = [...newHistory, errorMessage];
            setHistory(finalHistory);
            await saveChatHistory(finalHistory);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <AuthOverlay onLoginClick={handleLoginClick} title="Acesso às Ferramentas do Mestre" />;
    }

    if (!geminiApiKey) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                <BrainIcon className="w-16 h-16 text-indigo-400 mb-4" />
                <h2 className="text-xl font-bold text-white">Chave de API do Gemini Necessária</h2>
                <p className="text-gray-400 max-w-md mt-2">
                    Para usar o assistente de Mestre, por favor, configure sua chave de API do Google Gemini nas configurações (ícone de engrenagem).
                </p>
            </div>
        );
    }

    if (isHistoryLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }
    
    return (
        <div className="w-full h-full flex flex-col p-4">
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 pr-2 inner-scroll">
                {history.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <BrainIcon className="w-12 h-12" />
                        <p className="mt-2">Assistente do Mestre pronto.</p>
                    </div>
                )}
                <AnimatePresence>
                    {history.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChatBubble message={msg} />
                        </motion.div>
                    ))}
                </AnimatePresence>
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xl lg:max-w-2xl px-4 py-3 rounded-lg bg-gray-700 text-gray-200 flex items-center gap-2">
                            <Spinner size="sm" />
                            <span>Pensando...</span>
                        </div>
                    </div>
                 )}
            </div>
            <div className="mt-4 flex-shrink-0">
                <div className="relative">
                    <TextArea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Converse com o mestre... (Shift+Enter para nova linha)"
                        rows={3}
                        className="w-full pr-14"
                        disabled={isLoading}
                    />
                    <div className="absolute bottom-3 right-14">
                        <Tooltip text="Thinking Mode (Usa Gemini Pro para respostas mais complexas)">
                            <Switch label="" checked={thinkingMode} onChange={() => setThinkingMode(p => !p)} />
                        </Tooltip>
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !userInput.trim()}
                        className="absolute bottom-3 right-3 !p-2 btn-master_tools"
                        size="sm"
                    >
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Simple Send Icon
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);