
// components/HowItWorksModal.tsx
import React from 'react';
import { Modal } from './ui/Modal';
import { AnvilIcon, UsersIcon, SwordsIcon, BrainIcon } from './icons';
import { DiscordIcon } from './icons/DiscordIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Como Funciona" panelClassName="w-full max-w-3xl">
      <div className="p-6 space-y-6 text-gray-300">
        <p className="text-center italic text-base">
          Siga estes passos para dominar as ferramentas da Forja.
        </p>

        <ol className="relative border-l border-gray-700 ml-4 space-y-8">
          <li className="ml-8">            
            <span className="absolute flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full -left-5 ring-4 ring-gray-800">
              <SettingsIcon className="w-6 h-6 text-gray-300" />
            </span>
            <h4 className="font-semibold text-white text-lg">Passo Opcional: Sua Chave de API</h4>
            <p className="text-sm">Para uso ilimitado, clique na engrenagem (⚙️) no cabeçalho e insira sua própria chave da Google Gemini API. Isso remove o limite diário de gerações.</p>
          </li>
          <li className="ml-8">            
            <span className="absolute flex items-center justify-center w-10 h-10 bg-[#5865F2]/20 rounded-full -left-5 ring-4 ring-gray-800">
              <DiscordIcon className="w-6 h-6 text-[#5865F2]" />
            </span>
            <h4 className="font-semibold text-white text-lg">Passo 1: Autentique-se</h4>
            <p className="text-sm">Para uma experiência completa, entre com sua conta do Discord. Isso garante seu acesso e permite salvar suas criações, favoritos e chaves de API.</p>
          </li>
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-10 h-10 bg-indigo-900 rounded-full -left-5 ring-4 ring-gray-800">
              <AnvilIcon className="w-6 h-6 text-indigo-300" />
            </span>
            <h4 className="font-semibold text-white text-lg">Passo 2: Explore as Abas</h4>
            <p className="text-sm">Use a navegação no topo para alternar entre as seções: Forja de Itens (<AnvilIcon className="w-4 h-4 inline-block" />), Personagens (<UsersIcon className="w-4 h-4 inline-block" />), Conflitos (<SwordsIcon className="w-4 h-4 inline-block" />) e as Ferramentas do Mestre (<BrainIcon className="w-4 h-4 inline-block" />).</p>
          </li>
          <li className="ml-8">
            <span className="absolute flex items-center justify-center w-10 h-10 bg-red-900 rounded-full -left-5 ring-4 ring-gray-800">
              <AnvilIcon className="w-6 h-6 text-red-300" />
            </span>
            <h4 className="font-semibold text-white text-lg">Passo 3: Forje sua Lenda</h4>
            <p className="text-sm">Em cada aba, use os filtros à esquerda para moldar sua criação e clique em <strong>Forjar</strong>. A IA dará vida à sua ideia. Suas criações aparecerão como cards à direita. Clique em um card para ver os detalhes em um pop-up.</p>
          </li>
        </ol>

        <div>
          <h3 className="font-bold text-white text-lg mb-3 text-center">O Motor por Trás da Magia</h3>
           <p className="text-sm text-center">
              Para garantir estabilidade e qualidade, o Kimetsu Forge utiliza o poder do <strong>Google Gemini</strong> como motor principal. Modelos alternativos como DeepSeek e GPT-4 podem ser usados para tarefas de refinamento se você fornecer suas próprias chaves de API.
            </p>
        </div>
      </div>
    </Modal>
  );
};