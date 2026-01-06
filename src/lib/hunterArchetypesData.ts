

// Provides a list of hunter archetypes for creative inspiration within the application.

interface ArchetypeAbility {
  nome: string;
  tipo: string;
  o_que_faz: string;
  custo_cd: string;
  interacao_respiracoes: string;
}

interface SubArchetype {
    nome: string;
    habilidade: ArchetypeAbility;
}

interface Archetype {
  arquétipo: 'Guerreiro' | 'Alquimista' | 'Escudeiro';
  funcao_geral: string;
  estilo_de_jogo: string;
  progressao_tipica: string;
  subclasses: SubArchetype[];
}

export const HUNTER_ARCHETYPES_DATA: Archetype[] = [
  {
    "arquétipo": "Guerreiro",
    "funcao_geral": "corpo-a-corpo e curta/média distância; foco em execução técnica (posturas, timing, counters) + especializações (arco, furtivo, fúria). O guerreiro é o “faz-tudo” do combate direto: pode ser duelist, controle, sniper de curta distância (Kyūshi), anti-boss (Oni Hunter) ou burst puro (Berserker).",
    "estilo_de_jogo": "habilidade mecânica (parry, posicionamento), gerenciamento de recursos (stamina/ki/charges) e sinergia com respirações — nas mãos certas, vira suporte de alto dano e utilidade tática.",
    "progressao_tipica": "dominar uma Respiração Lendária para sua subclasse; forjar/ganhar uma Nichirin de linhagem; executar provas de duelo (Ronin) ou caçadas de Kizuki (Oni Hunter).",
    "subclasses": [
      {
        "nome": "Espadachim",
        "habilidade": {
          "nome": "Sen no Kamae (Postura do Corte)",
          "tipo": "Ativa (stance toggle)",
          "o_que_faz": "Alterna entre 3 posturas por X segundos:\nHaya (rápida) → aumenta velocidade e esquiva;\nTora (perfuração) → ignora parte da defesa/armadura;\nChiryū (sangramento) → aplica DOT por acerto.",
          "custo_cd": "custo baixo de stamina por mudança; CD curto entre trocas.",
          "interacao_respiracoes": "cada Respiração altera efeitos (ex.: Respiração da Água aumenta duração do DOT como “sangramento por água”); permite combos de postura + técnica de respiração."
        }
      },
      {
        "nome": "Lutador Marcial",
        "habilidade": {
          "nome": "Ciclo do Ki (Ki no Meguri)",
          "tipo": "Ativa/Acumulativa",
          "o_que_faz": "Golpes leves acumulam até 5 stacks de Ki; ao ativar, consome stacks para desferir um Kiai Burst que: empurra inimigos, atordoa e aplica controle (pulveriza balance/hold). Versões com mais stacks aumentam área/tempo de controle.",
          "custo_cd": "gera stacks sem custo; explosão consome stamina/ki; CD médio.",
          "interacao_respiracoes": "respirações que aumentam a potência física (Terra, Relâmpago) aumentam número máximo de stacks ou reduzem custo da explosão."
        }
      },
      {
        "nome": "Arqueiro Artífice",
        "habilidade": {
          "nome": "Takumi no Yumi (Arco do Artífice)",
          "tipo": "Ativa técnica (projétil + utilitário)",
          "o_que_faz": "Um tiro carregado que tece uma linha tática de energia entre o arqueiro e um ponto-alvo por T segundos. Esta linha é uma ferramenta versátil de controle de campo: pode ser usada como um gancho para puxar o jogador ou um aliado para um local seguro (grapple), ou para criar uma onda de repulsão que afasta inimigos (disengage). Além disso, as flechas disparadas podem ricochetear ao longo da linha, atingindo alvos de ângulos inesperados. Flechas que viajam pela linha também são imbuídas com efeitos extras, como penetração de armadura, veneno ou atordoamento.",
          "custo_cd": "carga consome stamina; uso único em combo com CD médio.",
          "interacao_respiracoes": "cada Respiração altera tipo de flecha (Vento = maior alcance/ricochete; Água = cura ao atingir aliado; Lua = crítico na sombra)."
        }
      },
      {
        "nome": "Furtivo",
        "habilidade": {
          "nome": "Passo Sombrio (Kage no Ippo)",
          "tipo": "Ativa (utilitário/movimento)",
          "o_que_faz": "Por 2 turnos, o Furtivo se torna quase invisível. Ele ganha vantagem em testes de Furtividade e seu próximo ataque contra um alvo que não o detectou é um acerto crítico automático. A habilidade é quebrada se ele atacar.",
          "custo_cd": "Custo de 2 PC; CD longo (1x por combate).",
          "interacao_respiracoes": "Respirações como a da Névoa ou da Lua estendem a duração em 1 turno ou adicionam um efeito de desorientação ao sair da furtividade."
        }
      }
    ]
  },
  {
    "arquétipo": "Alquimista",
    "funcao_geral": "suporte técnico e utilitário. Alquimistas não são só curandeiros — eles criam condições de batalha: armas, dispositivos, poções, selos. Em your world, o Alquimista é o cérebro tático: prepara o time, manipula recursos e neutraliza/regula Onis.",
    "estilo_de_jogo": "posicionamento, preparação (pré-batalha e em-combate crafting), gestão de reagentes e sinergias com respirações — por exemplo, preparar um elixir que amplifica a Respiração do Vento por 30s.",
    "progressao_tipica": "forjar uma Nichirin com alma (Kajiya + Kenshi quest); sintetizar veneno de Kizuki; dominar rituais de selo para incursões endgame.",
    "subclasses": [
      {
        "nome": "Ferreiro de Batalha",
        "habilidade": {
          "nome": "Forja de Batalha (Gyakuten no Kaji)",
          "tipo": "Ativa (buff/temporária)",
          "o_que_faz": "Em combate, consome materiais para temperar a arma de um aliado por X minutos: concede bônus (dano crítico, perfuração, efeito elemental) e um proc único por hit (p.ex. incendiar, selar). Pode ser ativada em si mesmo.",
          "custo_cd": "consome materiais/tempo de forja; CD médio-alto.",
          "interacao_respiracoes": "armas forjadas podem amplificar uma respiração específica (ex.: lâmina temperada habilita uma variante da Respiração do Vento)."
        }
      },
      {
        "nome": "Curandeiro",
        "habilidade": {
          "nome": "Elixir Vital (Seimei no Jusu)",
          "tipo": "Ativa (cura instantânea + limpeza)",
          "o_que_faz": "Lança um elixir que cura instantaneamente um aliado e remove 1-2 debuffs (veneno, corrupção). Versão carregada cura área e remove corrupções demoníacas temporárias. Tem tempo de preparo curto.",
          "custo_cd": "usa reagente/charges; CD curto-médio entre usos.",
          "interacao_respiracoes": "quando aliado usar Respiração pouco depois (window), cura é amplificada; certas respirações consomem parte do elixir para buff estendido."
        }
      },
      {
        "nome": "Toxicologista",
        "habilidade": {
          "nome": "Mistura Letal (Dokuga no Kesshō)",
          "tipo": "Ativa área (DOT / debuff)",
          "o_que_faz": "Arremessa um frasco que explode em nuvem tóxica específica (p.ex. paralisia, corrosão, supressão de cura). Efeitos são escaláveis: combinando frascos diferentes cria sinergias (ex.: veneno A + B vira “necrótipo” que impede regen Oni).",
          "custo_cd": "requer crafting de frascos; CD médio.",
          "interacao_respiracoes": "Respirações que aumentam circulação (Shin no Kokyū) podem ajudar aliados a resistir aos efeitos; certas respirações (Lua) tornam o veneno mais letal contra demônios."
        }
      },
      {
        "nome": "Ritualista Alquímico",
        "habilidade": {
          "nome": "Selo de Contenção (Fūin no Noroi)",
          "tipo": "Ativa / Canalização",
          "o_que_faz": "Desenha um selo no chão que, ao ativar, restringe habilidades inimigas, reduz regeneração e aumenta dano recebido por demônios dentro do raio. Requer canal (casting), pode ser colocado estrategicamente.",
          "custo_cd": "consome reagentes espirituais; cooldown longo.",
          "interacao_respiracoes": "Respirações de purificação aumentam eficácia do selo; respirações demoníacas (quando usadas pelo inimigo) podem tentar quebrar o selo (criando mini-duelos mágicos)."
        }
      }
    ]
  },
  {
    "arquétipo": "Escudeiro",
    "funcao_geral": "O Escudeiro é o pilar defensivo do grupo — a parede que separa o caos do colapso. Enquanto os Guerreiros caçam e os Alquimistas planejam, o Escudeiro protege. Ele é o centro tático, controlando o aggro, quebrando o ritmo dos Onis e mantendo aliados vivos com defesas espirituais, físicas ou simbióticas.",
    "estilo_de_jogo": "Mitigação, bloqueios táticos, redirecionamento de dano, controle de multidão. Foco em gerenciamento de cooldowns e leitura de combate. Toda a jogabilidade do tanque gira em torno do timing do bloqueio e do uso inteligente de stamina e postura.",
    "progressao_tipica": "Forjar um escudo Nichirin que absorve energia demoníaca; aprender uma Kata de Guardião lendária; proteger um local sagrado para receber uma bênção de resistência.",
    "subclasses": [
      {
        "nome": "Protetor",
        "habilidade": {
          "nome": "Vínculo de Proteção (Mamori no Kizuna)",
          "tipo": "Ativa / Link",
          "o_que_faz": "Vinca-se a um aliado por T segundos: Tate absorve uma porcentagem do dano recebido por esse alvo. Enquanto vinculado, Tate sofre redução de mobilidade, mas ganha regeneração de estamina. Se o Tate quebrar o vínculo (cancel), gera uma onda que atordoa ao redor.",
          "custo_cd": "custo de stamina inicial; CD médio.",
          "interacao_respiracoes": "Respirações defensivas (Terra/Água) aumentam a porcentagem de dano absorvido e reduzem o custo de estamina do Tate."
        }
      },
      {
        "nome": "Baluarte",
        "habilidade": {
          "nome": "Barreira de Pedra (Ishibumi no Kabe)",
          "tipo": "Ativa / CC e defesa de área",
          "o_que_faz": "Golpe de chão que ergue uma parede de pedra/rocha em linha (durável) e aplica slow/root aos inimigos próximos. Parede bloqueia movimentos e projéteis por X segundos; inimigos que atravessarem a parede recebem dano.",
          "custo_cd": "consome stamina/força; CD médio-alto.",
          "interacao_respiracoes": "certas respirações (Terra) tornam a parede mais resistente; Respiração do Fogo pode tempestar a parede causando dano por calor a quem encosta."
        }
      },
      {
        "nome": "Defensor",
        "habilidade": {
          "nome": "Aura do Guardião (Shugo no Hōyō)",
          "tipo": "Passiva/Toggled (stance)",
          "o_que_faz": "Ao entrar em stance de guardião, gera ao redor uma aura que concede redução de dano passiva a aliados próximos e cura pequena por tick. Enquanto ativada, Shugo mobiliza menos, mas seus bloqueios ganham “reflexo” (pequeno counter).",
          "custo_cd": "toggle com custo de energia/estamina por segundo; CD pequeno ao desligar.",
          "interacao_respiracoes": "Respirações espirituais (como a do Sol) aumentam a cura por tick; a cura em sinergia com o Alquimista pode se tornar uma cura em área maior."
        }
      },
      {
        "nome": "Paladino do Pilar",
        "habilidade": {
          "nome": "Juramento do Pilar (Chika no Hashira)",
          "tipo": "Ativa ultimate/Área",
          "o_que_faz": "Invoca por curto período uma aura sagrada que: provoca inimigos em raio, reduz dano aliado, e aplica um debuff antidemon (reduz regen e defesa de demônios). A ativação tem animação ritual (tempo de canal) e dá imunidade curta contra possessão/controle.",
          "custo_cd": "alto custo de recurso (resolve/ultimate) e cooldown muito longo.",
          "interacao_respiracoes": "Respirações do usuário aumentam o alcance e a intensidade do debuff; respiração do aliado ao entrar na aura pode ganhar bônus extra (ex.: +crit vs demônios)."
        }
      }
    ]
  }
];