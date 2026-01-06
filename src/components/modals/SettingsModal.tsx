// components/modals/SettingsModal.tsx
// (Equivalente: components/ApiKeysModal.tsx)
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { TextInput } from '../ui/TextInput';
import { Button } from '../ui/Button';
import { SaveIcon, TrashIcon } from '../icons';
import { useToast } from '../ToastProvider';
import { useApiKeys, useAuth } from '../../contexts/AppContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { 
    geminiApiKey, setGeminiApiKey,
    openaiApiKey, setOpenaiApiKey,
    deepseekApiKey, setDeepseekApiKey 
  } = useApiKeys();
  
  const [localGemini, setLocalGemini] = useState(geminiApiKey);
  const [localOpenAI, setLocalOpenAI] = useState(openaiApiKey);
  const [localDeepSeek, setLocalDeepSeek] = useState(deepseekApiKey);
  
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setLocalGemini(geminiApiKey);
      setLocalOpenAI(openaiApiKey);
      setLocalDeepSeek(deepseekApiKey);
    }
  }, [isOpen, geminiApiKey, openaiApiKey, deepseekApiKey]);

  const handleSave = async (keysToSave: { gemini: string; openai: string; deepseek: string; }) => {
    if (!user) {
      showToast('error', 'Você precisa estar logado para salvar as chaves.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/keys/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          geminiApiKey: keysToSave.gemini || null,
          openaiApiKey: keysToSave.openai || null,
          deepseekApiKey: keysToSave.deepseek || null,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar as chaves.');
      }
      
      setGeminiApiKey(keysToSave.gemini);
      setOpenaiApiKey(keysToSave.openai);
      setDeepseekApiKey(keysToSave.deepseek);
      return true;
    } catch (error: any) {
      showToast('error', `Erro: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = async () => {
    const success = await handleSave({ gemini: localGemini, openai: localOpenAI, deepseek: localDeepSeek });
    if (success) {
      showToast('success', 'Chaves de API salvas com sucesso!');
      onClose();
    }
  };

  const handleClearKeys = async () => {
    if (window.confirm('Tem certeza de que deseja limpar todas as suas chaves de API salvas?')) {
      const success = await handleSave({ gemini: '', openai: '', deepseek: '' });
      if (success) {
        setLocalGemini('');
        setLocalOpenAI('');
        setLocalDeepSeek('');
        showToast('info', 'Suas chaves de API foram limpas.');
        onClose();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Chaves de API">
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-400">
          Forneça suas chaves para ter <strong>uso ilimitado</strong> e ativar modelos de IA alternativos. Sem sua chave, o uso é limitado e compartilhado. Suas chaves são salvas com segurança em nosso banco de dados e associadas apenas à sua conta.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-300 mb-1">Google Gemini API Key</label>
            <TextInput
              id="gemini-key"
              type="password"
              value={localGemini}
              onChange={(e) => setLocalGemini(e.target.value)}
              placeholder="Chave do Google AI Studio (modelo principal)"
            />
          </div>
           <div>
            <label htmlFor="openai-key" className="block text-sm font-medium text-gray-300 mb-1">OpenAI API Key (GPT)</label>
            <TextInput
              id="openai-key"
              type="password"
              value={localOpenAI}
              onChange={(e) => setLocalOpenAI(e.target.value)}
              placeholder="Opcional: Para refinamento narrativo com GPT"
            />
          </div>
           <div>
            <label htmlFor="deepseek-key" className="block text-sm font-medium text-gray-300 mb-1">DeepSeek API Key</label>
            <TextInput
              id="deepseek-key"
              type="password"
              value={localDeepSeek}
              onChange={(e) => setLocalDeepSeek(e.target.value)}
              placeholder="Opcional: Para expansão criativa de ideias"
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>Links para obter suas chaves (requer conta nas plataformas):</p>
          <ul className="list-disc list-inside">
            <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">Google AI Studio (Gemini)</a></li>
            <li><a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">OpenAI Platform (GPT)</a></li>
            <li><a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">DeepSeek Platform</a></li>
          </ul>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <Button variant="danger" onClick={handleClearKeys} disabled={isSaving || !user}>
                <TrashIcon className="w-5 h-5" />
                Limpar Chaves
            </Button>
            <div className="flex gap-2">
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleSaveClick} disabled={isSaving || !user}>
                    <SaveIcon className="w-5 h-5" />
                    {isSaving ? 'Salvando...' : 'Salvar Chaves'}
                </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
