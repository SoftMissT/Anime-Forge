// lib/breathingStylesDetails.ts

// FIX: Added and exported interfaces for BreathingStyleDetail and BreathingForm to provide strong typing and resolve import errors.
export interface BreathingFormNivel {
    nivel?: number;
    dano: string;
    custo: string;
    movimento?: string;
    precisao?: string;
    bloqueio?: string;
    redireciona?: string;
    reducaoDano?: string;
    anula?: string;
    cura?: string;
    bonus?: string;
}

export interface BreathingForm {
    nome: string;
    tipo: string;
    niveis: BreathingFormNivel[];
    efeitos: string[];
    requisito?: string;
    sinergiaMomentum?: string;
}

export interface BreathingStyleDetail {
    id: string;
    nome: string;
    conceito: string;
    historia: {
        titulo: string;
        paragrafos: string[];
    };
    passiva: {
        nome: string;
        descricao: string;
        acumulo?: string;
        reset: string;
        efeitos: any[];
        laminasCaoticas?: string;
    };
    formas: BreathingForm[];
}

// FIX: Typed the array with the new BreathingStyleDetail interface and added an 'id' property to each object to match the breathingDatabase and fix lookup errors.
export const BREATHING_STYLES_DETAILS: BreathingStyleDetail[] = [
  {
    id: 'water',
    nome: "RESPIRAÇÃO DA ÁGUA (水の呼吸, Mizu no Kokyū)",
    conceito: "Estilo do Fluxo Adaptável. A Água cede, mas jamais se rende. Este estilo de respiração prioriza a defesa, o controle e a fluidez, transformando o corpo em uma corrente imprevisível. O seu princípio é claro: o controle vence a força bruta.",
    historia: {
      titulo: "Yusuke Mizuhara: O Primeiro Rio",
      paragrafos: [
        "Na turbulenta Era Sengoku (século XVI), enquanto o Japão sangrava em guerras civis, Yusuke Mizuhara era um samurai a serviço do clã Takeda. Durante uma campanha nas montanhas de Hida, seu batalhão foi massacrado por demônios - uma carnificina que apenas Yusuke sobreviveu, salvo pela intervenção oportuna de Yoriichi Tsukiguni.",
        "Yusuke testemunhou Yoriichi executando a Respiração do Sol contra os demônios. A técnica era absolutamente perfeita - cada movimento um reflexo do sol, cada golpe contendo o calor da criação. Mas quando Yusuke tentou imitá-la, descobriu uma verdade cruel: seu corpo não conseguia acompanhar a perfeição sobre-humana de Yoriichi.",
        "Frustrado, Yusuke retirou-se para as montanhas de Yoshino. Observando um rio correr por séculos sobre rochas imutáveis, ele teve sua revelação: \"Yoriichi-san é o sol - inatingível, perfeito, constante. Mas eu... eu posso ser a água que flui ao redor da pedra, não contra ela.\"",
        "Yusuke nunca igualou Yoriichi, mas criou algo igualmente vital - um estilo que qualquer pessoa com determinação podia aprender. Enquanto a Respiração do Sol permaneceu como uma estrela distante, a Respiração da Água tornou-se o rio que alimenta mil córregos - a base de onde outras respirações como a Neve, a Flor e o Inseto eventualmente brotariam.",
        "Antes de morrer, Yusuke encontrou Yoriichi pela última vez. O criador da Respiração do Sol sorriu suavemente: \"Você não tentou copiar o sol, Mizuhara-san. Você encontrou sua própria luz refletida na água. Isso é mais sábio do que qualquer técnica.\"",
        "E assim, enquanto Yoriichi se tornava uma lenda, Yusuke Mizuhara tornava-se a fonte - o primeiro de muitos que encontrariam sua própria força seguindo o fluxo, não contra ele."
      ]
    },
    passiva: {
      nome: "Fluxo da Corrente",
      descricao: "O estilo depende do acúmulo de \"Fluxo\" para aumentar a adaptabilidade do usuário e desbloquear técnicas avançadas.",
      acumulo: "Ganha 1 Fluxo (máximo de 3) ao realizar uma Forma (habilidade) bem-sucedida ou uma esquiva perfeita.",
      reset: "O acúmulo é resetado (volta a 0) se o usuário falhar 2 ataques consecutivos ou for atingido por um golpe crítico.",
      efeitos: [
        {
          fluxo: 1,
          descricao: "O corpo se move com fluidez total, concedendo +1 em Esquiva e +1 em Precisão."
        },
        {
          fluxo: 2,
          descricao: "O usuário ganha +2 em Esquiva e +2 em Precisão e desbloqueia a [Reação] Contra-fluxo. Pode ser usado uma vez por rodada. Consome 1 Fluxo para desviar e reposicionar-se imediatamente após um ataque inimigo."
        },
        {
          fluxo: 3,
          descricao: "O usuário entra no estado Corrente Infinita na rodada atual, demonstrando domínio absoluto. Poder Aprimorado: Todos os ataques ganham +1 de Dano e +1 de Precisão. Domínio Defensivo: Pode desviar automaticamente de 1 ataque físico por rodada. Imparável: Ignora penalidades de terreno difícil. Pós-Uso: Ao término da Corrente Infinita, o usuário sofre de exaustão, recebendo -1 em Precisão por 1 Rodada. Recarga: 20 segundos."
        }
      ]
    },
    formas: [
      { nome: "Primeira Forma: Corte da Fonte / Minamo Giri", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6", custo: "1 PC" }, { nivel: 2, dano: "1d8", custo: "2 PC" }, { nivel: 3, dano: "1d10", custo: "4 PC" }, { nivel: 4, dano: "2d6", custo: "6 PC" }], efeitos: ["Gera 1 Fluxo.", "Se usado após um avanço de 3m+, ganha +2 de acerto."] },
      { nome: "Segunda Forma: Roda D'água / Mizu Guruma", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8", custo: "2 PC" }, { nivel: 2, dano: "1d10", custo: "3 PC" }, { nivel: 3, dano: "2d6", custo: "4 PC" }, { nivel: 4, dano: "2d8", custo: "5 PC" }], efeitos: ["Ganha 3m durante ataque.", "Empurra o alvo 1.5m.", "Gera 1 Fluxo."] },
      { nome: "Variação da Segunda Forma: Roda D'água Lateral", tipo: "Ação Bônus", requisito: "1 Momentum", niveis: [{ nivel: 1, dano: "1d6 em linha", custo: "1 PC + 1 Momentum" }, { nivel: 2, dano: "1d8 em linha", custo: "2 PC + 1 Momentum" }, { nivel: 3, dano: "1d10 em linha", custo: "3 PC + 1 Momentum" }, { nivel: 4, dano: "2d6 em linha", custo: "4 PC + 1 Momentum" }], efeitos: ["Atinge 2 alvos adjacentes.", "Gera 1 Fluxo."] },
      { nome: "Terceira Forma: Dança do Dragão Fluente (Ryūryū Mai)", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "2 + 1d4", movimento: "4.5m", custo: "3 PC" }, { nivel: 2, dano: "2 + 1d6", movimento: "6m", custo: "4 PC" }, { nivel: 3, dano: "2 + 1d8", movimento: "7.5m", custo: "5 PC" }, { nivel: 4, dano: "2 x 1d10", movimento: "9m", custo: "6 PC" }], efeitos: ["Não provoca ataques de oportunidade.", "Gera 2 Fluxo."] },
      { nome: "Quarta Forma: Maré de Golpes / Uchishio", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "3 + 1d4", custo: "3 PC" }, { nivel: 2, dano: "3 + 1d6", custo: "4 PC" }, { nivel: 3, dano: "3 + 1d8", custo: "5 PC" }, { nivel: 4, dano: "3 x 1d10", custo: "6 PC" }], efeitos: ["Cada acerto subsequente ganha +1 de dano.", "Gera 1 Fluxo por acerto (máx. 2)."] },
      { nome: "Variação da Quarta Forma: Maré Caótica / Uchishio - Ran", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "2 + 1d4", precisao: "+2", custo: "2 PC" }, { nivel: 2, dano: "2 + 1d6", precisao: "+2", custo: "3 PC" }, { nivel: 3, dano: "2 + 1d8", precisao: "+2", custo: "4 PC" }, { nivel: 4, dano: "2 x 1d10", precisao: "+2", custo: "5 PC" }], efeitos: ["Vantagem no primeiro ataque.", "Gera 1 Fluxo."] },
      { nome: "Quinta Forma: Chuva da Benevolência / Kanten no Jiu", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "2d6", custo: "2 PC" }, { nivel: 2, dano: "2d8", custo: "3 PC" }, { nivel: 3, dano: "2d10", custo: "4 PC" }, { nivel: 4, dano: "3d6", custo: "5 PC" }], efeitos: ["Morte instantânea em oponentes rendidos ou com ≤25% PV.", "Não gera Fluxo."] },
      { nome: "Sexta Forma: Redemoinho Torcido / Nejire Uzu", tipo: "Ação Principal (Área)", niveis: [{ nivel: 1, dano: "1d8 em raio 3m", custo: "4 PC" }, { nivel: 2, dano: "1d10 em raio 3m", custo: "5 PC" }, { nivel: 3, dano: "2d6 em raio 3m", custo: "6 PC" }, { nivel: 4, dano: "2d8 em raio 3m", custo: "7 PC" }], efeitos: ["Inimigos ficam Atordoados por 1 turno.", "Gera 2 Fluxo."] },
      { nome: "Variação da Sexta Forma: Redemoinho do Dragão / Nejire Uzu - Ryūryū", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6", redireciona: "1 projétil", custo: "3 PC" }, { nivel: 2, dano: "1d8", redireciona: "1 projétil", custo: "4 PC" }, { nivel: 3, dano: "1d10", redireciona: "2 projéteis", custo: "5 PC" }, { nivel: 4, dano: "2d6", redireciona: "2 projéteis", custo: "6 PC" }], efeitos: ["+4 Defesa contra projéteis.", "Gera 1 Fluxo."] },
      { nome: "Sétima Forma: Gota Perfurante / Shizuku Hamonzuki", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bloqueio: "+2", custo: "3 PC" }, { nivel: 2, dano: "-", bloqueio: "+4", custo: "4 PC" }, { nivel: 3, dano: "-", bloqueio: "+6", custo: "5 PC" }, { nivel: 4, dano: "-", bloqueio: "+8", custo: "6 PC" }], efeitos: ["Se bloquear com sucesso, contra-ataque automático 1d6.", "Gera 1 Fluxo."] },
      { nome: "Variação da Sétima Forma: Gota Extrema / Shizuku Hamonzuki - Kyoku", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", reducaoDano: "1d8", custo: "2 PC" }, { nivel: 2, dano: "-", reducaoDano: "1d10", custo: "3 PC" }, { nivel: 3, dano: "-", reducaoDano: "1d12", custo: "4 PC" }, { nivel: 4, dano: "2d8", custo: "5 PC" }], efeitos: ["Se reduzir dano a 0, retorna o projétil ao atacante.", "Gera 1 Fluxo."] },
      { nome: "Oitava Forma: Cachoeira do Abismo / Takitsubo", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10 / 2d8 se caído", custo: "4 PC" }, { nivel: 2, dano: "1d12 / 2d10 se caído", custo: "5 PC" }, { nivel: 3, dano: "2d8 / 3d6 se caído", custo: "6 PC" }, { nivel: 4, dano: "2d10 / 3d8 se caído", custo: "7 PC" }], efeitos: ["Dano dobrado contra alvos Derrubados/Atordoados.", "Gera 1 Fluxo."] },
      { nome: "Nona Forma: Salpicos do Dragão Aquático / Suiryū Shibuki - Ran", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "-", movimento: "4.5m sem AO", custo: "2 PC" }, { nivel: 2, dano: "-", movimento: "6m sem AO", custo: "3 PC" }, { nivel: 3, dano: "-", movimento: "7.5m sem AO", custo: "4 PC" }, { nivel: 4, dano: "-", movimento: "9m sem AO", custo: "5 PC" }], efeitos: ["Ignora terreno difícil.", "Pode andar sobre água/líquidos.", "Gera 1 Fluxo."] },
      { nome: "Décima Forma: Rota da Criação / Seisei Ruten", tipo: "Ação Principal + Ação Bônus (se 3+ Momentum)", niveis: [{ nivel: 2, dano: "3 + 1d8 + 2d10 mergulho", custo: "10 PC + 3 Fluxo" }, { nivel: 3, dano: "3 + 1d10 + 2d12 mergulho", custo: "12 PC + 3 Fluxo" }, { nivel: 4, dano: "3 x 1d12 + 3d10 mergulho", custo: "14 PC + 3 Fluxo" }], efeitos: ["Movimento de 9m durante o ataque, ignorando terreno difícil.", "Ataques iniciais aumentam dano do mergulho em +1d6 por acerto.", "Mergulho final causa Derrubado e Atordoado por 1 turno (teste de FOR).", "Gasta todos os Fluxos; recupera 1 se o mergulho acertar.", "Requisito: Nível 14+ e domínio de 6+ formas."], sinergiaMomentum: "3 Momentum: Ação Principal + Bônus. 5 Momentum: Ataque final ignora resistências e causa Sangramento (2d4/turno, 3 turnos)." },
      { nome: "Décima Primeira Forma: Calmaria / Nagi", tipo: "Reação", niveis: [{ nivel: 3, dano: "-", anula: "4 ataques/turno", custo: "8 PC + 3 Fluxo" }, { nivel: 4, dano: "-", anula: "8 ataques/turno", custo: "9 PC + 3 Fluxo" }], efeitos: ["Defesa +8 contra o ataque anulado.", "Se bem-sucedido, contra-ataque automático 2d6."] }
    ]
  },
  {
    id: 'flame',
    nome: "RESPIRAÇÃO DAS CHAMAS (炎の呼吸, Honō no Kokyū)",
    conceito: "Estilo da Vontade Explosiva - Foco em Dano Frontral e Controle de Área. Seu espírito ardente se manifesta em chamas.",
    historia: {
      titulo: "Yusuke Mizuhara: O Primeiro Rio",
      paragrafos: [
        "Na turbulenta Era Sengoku (século XVI), enquanto o Japão sangrava em guerras civis, Yusuke Mizuhara era um samurai a serviço do clã Takeda. Durante uma campanha nas montanhas de Hida, seu batalhão foi massacrado por demônios - uma carnificina que apenas Yusuke sobreviveu, salvo pela intervenção oportuna de Yoriichi Tsukiguni.",
        "Yusuke testemunhou Yoriichi executando a Respiração do Sol contra os demônios. A técnica era absolutamente perfeita - cada movimento um reflexo do sol, cada golpe contendo o calor da criação. Mas quando Yusuke tentou imitá-la, descobriu uma verdade cruel: seu corpo não conseguia acompanhar a perfeição sobre-humana de Yoriichi.",
        "Frustrado, Yusuke retirou-se para as montanhas de Yoshino. Observando um rio correr por séculos sobre rochas imutáveis, ele teve sua revelação: \"Yoriichi-san é o sol - inatingível, perfeito, constante. Mas eu... eu posso ser a água que flui ao redor da pedra, não contra ela.\"",
        "Yusuke nunca igualou Yoriichi, mas criou algo igualmente vital - um estilo que qualquer pessoa com determinação podia aprender. Enquanto a Respiração do Sol permaneceu como uma estrela distante, a Respiração da Água tornou-se o rio que alimenta mil córregos - a base de onde outras respirações como a Neve, a Flor e o Inseto eventualmente brotariam.",
        "Antes de morrer, Yusuke encontrou Yoriichi pela última vez. O criador da Respiração do Sol sorriu suavemente: \"Você não tentou copiar o sol, Mizuhara-san. Você encontrou sua própria luz refletida na água. Isso é mais sábio do que qualquer técnica.\"",
        "E assim, enquanto Yoriichi se tornava uma lenda, Yusuke Mizuhara tornava-se a fonte - o primeiro de muitos que encontrariam sua própria força seguindo o fluxo, não contra ele."
      ]
    },
    passiva: {
      nome: "Coração Incandescente / Incendeie Seu Coração",
      descricao: "Cada ataque ou bloqueio bem-sucedido gera 1 Brasa Interna (máx. 3). As Brasas persistem até o usuário perder moral.",
      reset: "Ao recuar por mais de 1 turno ou ser intimidado.",
      efeitos: [
        { brasa: 1, descricao: "+1 de dano físico." },
        { brasa: 2, descricao: "Ganha Resistência à Dor (+1 DEF ou ignora penalidade de ferimento leve)." },
        { brasa: 3, descricao: "Ativa Inferno Determinado por 2 turnos: +2 em Dano e Acerto, ataques CàC liberam chamas secundárias (+1 dano), pode lutar < 0 PV por 1 rodada. Pós-uso: Fadiga Ardente (-1 DEF por 1 rodada). Cooldown: 30s." }
      ]
    },
    formas: [
      { nome: "Primeira Forma: Fogo Desconhecido (Shiranui)", tipo: "Ação de Ataque ou Bônus", niveis: [{ nivel: 1, dano: "1d6", custo: "2 PC" }, { nivel: 2, dano: "1d8", custo: "3 PC" }, { nivel: 3, dano: "1d10", custo: "4 PC" }, { nivel: 4, dano: "2d6", custo: "5 PC" }], efeitos: ["Gera 1 Brasa.", "Se usado como Ação Bônus, -1 de Precisão."] },
      { nome: "Segunda Forma: Sol Nascente Escaldante (Nobori En Ten)", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d4", custo: "1 PC" }, { nivel: 2, dano: "1d6", custo: "2 PC" }, { nivel: 3, dano: "1d8", custo: "3 PC" }, { nivel: 4, dano: "1d10", custo: "4 PC" }], efeitos: ["Ignora 1 de Defesa se o alvo estiver em guarda alta.", "Gera 1 Brasa."] },
      { nome: "Terceira Forma: Universo Flamejante (Kien Banshō)", tipo: "Ação de Ataque + Movimento", niveis: [{ nivel: 1, dano: "1d8", movimento: "3m", custo: "3 PC" }, { nivel: 2, dano: "1d10", movimento: "4.5m", custo: "4 PC" }, { nivel: 3, dano: "2d6", movimento: "6m", custo: "6 PC" }, { nivel: 4, dano: "2d8", movimento: "7.5m", custo: "7 PC" }], efeitos: ["Derruba o alvo se acertar (teste de FOR).", "Gera 1 Brasa."] },
      { nome: "Quarta Forma: Ondulação da Chama Fluorescente (Sei En no Uneri)", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bloqueio: "+2", custo: "1 PC" }, { nivel: 2, dano: "-", bloqueio: "+4", custo: "3 PC" }, { nivel: 3, dano: "-", bloqueio: "+6", custo: "4 PC" }, { nivel: 4, dano: "-", bloqueio: "+8", custo: "6 PC" }], efeitos: ["Se bloquear com sucesso, contra-ataque automático (1d6).", "Gera 1 Brasa.", "Atinge até 2 alvos se múltiplos ataques forem bloqueados."] },
      { nome: "Quinta Forma: Tigre Flamejante (Enko)", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "3 + 1d6", custo: "1 PC" }, { nivel: 2, dano: "3 + 1d8", custo: "2 PC" }, { nivel: 3, dano: "3 + 1d10", custo: "4 PC" }, { nivel: 4, dano: "3 x 1d12", custo: "6 PC" }], efeitos: ["+1 Defesa durante o ataque.", "Gera 2 Brasas se todos os golpes acertarem."] },
      { nome: "Sétima Forma: Compasso da Forja", tipo: "Ação de Ataque ou Bônus", niveis: [{ nivel: 3, dano: "7 x 1d6", custo: "4 PC" }, { nivel: 4, dano: "7 x 1d8", custo: "6 PC" }], efeitos: ["Se 4+ golpes acertarem, o último causa Queimando (1d4/rodada, 3 turnos).", "Gera 1 Momentum por acerto (máx. 3).", "Gera 2 Brasas."] },
      { nome: "Oitava Forma: Rajada Final de Chama (Shūen Rengeki)", tipo: "Ação de Ataque + Movimento", niveis: [{ nivel: 2, dano: "2d6", custo: "7 PC" }, { nivel: 3, dano: "2d6 + 2d4", custo: "9 PC" }, { nivel: 4, dano: "2d6 + 1d12", custo: "11 PC" }], efeitos: ["Área em cone 4.5m (alvos adjacentes sofrem metade do dano).", "Remove 1 buff de defesa do alvo.", "Gera 2 Brasas.", "Fadiga Térmica (-1 testes físicos no próximo turno)."] },
      { nome: "Nona Forma: Purgatório (Rengoku)", tipo: "Ação de Ataque + Movimento", niveis: [{ nivel: 4, dano: "10 x 2d10 + 1d12", custo: "8 PC" }], efeitos: ["Área 6m: alvo principal dano total, outros metade.", "Teste de Constituição do usuário ou sofre Exaustão Nível 2 por 2 turnos.", "Aplica Queimando Intenso (2d4/rodada, 3 turnos) e reduz regeneração de demônios em 75%.", "Ignora 50% da defesa física.", "Gasta todas as Brasas.", "Pré-requisito: Nível 18+."] }
    ]
  },
  {
    id: 'thunder',
    nome: "Respiração do Trovão: 雷の呼吸 (Kaminari no Kokyū)",
    conceito: "Estilo do Relâmpago Instantâneo - Foco em Velocidade e Dano Concentrado.",
    historia: {
      titulo: "Shin Kaminari: O Mensageiro",
      paragrafos: [
        "Shin Kaminari foi mensageiro do período Sengoku. Criou reflexos sobre telhados, caminhos e rotas de fuga. Viu Yoriichi em ação. Não quis imitar o Sol. Procurou a primeira ação. Numa noite gelada, após salvar um comboio, Shin percebeu que o vencedor do duelo é quem atinge a intenção adversária antes dela surgir. Fundiu princípios do iai e da corrida de mensageiro com controle respiratório. Assim nasceu a Respiração do Trovão."
      ]
    },
    passiva: {
      nome: "Relâmpago na Bainha / Shiden Issen",
      descricao: "Sua velocidade se acumula como eletricidade estática. Cada turno em postura sem atacar gera 1 Carga Elétrica (máx. 3).",
      efeitos: [
        { carga: "1+", descricao: "+1 Precisão e Dano por Carga." },
        { carga: 3, descricao: "Ativa Relâmpago Divino: próximo ataque causa +3 de dano e pode Paralisar. Após o golpe, sofre Descarga Residual (-1 em Esquiva por 1 rodada)." }
      ],
      reset: "Cargas são descarregadas ao atacar."
    },
    formas: [
      { nome: "Primeira Forma: Relâmpago Instantâneo (Hekireki Issen)", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8", custo: "3 PC" }, { nivel: 2, dano: "1d10", custo: "4 PC" }, { nivel: 3, dano: "2d6", custo: "5 PC" }, { nivel: 4, dano: "2d8", custo: "6 PC" }], efeitos: ["Gasta todas as Cargas para dano adicional.", "Com 3 Cargas, alvo testa DEX ou fica Paralisado por 1 turno."] },
      { nome: "Variação 1: Relâmpago Sextuplo (Hekireki Issen - Rokuren)", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 2, dano: "6 x 1d4", custo: "5 PC" }, { nivel: 3, dano: "6 x 1d6", custo: "6 PC" }, { nivel: 4, dano: "6 x 1d8", custo: "8 PC" }], efeitos: ["Movimento de +6m.", "Gera 1 Carga por acerto (máx. 3)."] },
      { nome: "Variação 2: Relâmpago Óctuplo (Hekireki Issen - Hachiren)", tipo: "Ação Principal", niveis: [{ nivel: 3, dano: "8 x 1d4", custo: "5 PC" }, { nivel: 4, dano: "8 x 1d6", custo: "6 PC" }], efeitos: ["Gasta todas as Cargas.", "Com 3 Cargas, ignora a primeira reação do alvo.", "Teste de Constituição ou Exaustão Nível 1."] },
      { nome: "Variação 3: Velocidade Divina (Hekireki Issen - Shinsoku)", tipo: "Ação Bônus (fora de combate) / Principal (em combate)", niveis: [{ nivel: 1, dano: "1d10", custo: "4 PC" }, { nivel: 2, dano: "1d12", custo: "5 PC" }, { nivel: 3, dano: "2d8", custo: "6 PC" }, { nivel: 4, dano: "2d10", custo: "7 PC" }], efeitos: ["Fora de combate: Vantagem no ataque.", "Com 3 Cargas: Crítico em 19-20."] },
      { nome: "Segunda Forma: Esfera de Arroz Sagrado (Inadama)", tipo: "Ação Principal / Ação Bônus (se encadeada)", niveis: [{ nivel: 1, dano: "5 x 1d4", custo: "2 PC" }, { nivel: 2, dano: "5 x 1d6", custo: "4 PC" }, { nivel: 3, dano: "5 x 1d8", custo: "5 PC" }, { nivel: 4, dano: "5 x 1d10", custo: "8 PC" }], efeitos: ["Se Ação Bônus: -2 PC no custo.", "Gera 2 Cargas se 3+ golpes acertarem."] },
      { nome: "Terceira Forma: Turbilhão de Tempestade (Shūbun Seirai)", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "3 x 1d6", movimento: "4.5m", custo: "2 PC" }, { nivel: 2, dano: "3 x 1d8", movimento: "6m", custo: "4 PC" }, { nivel: 3, dano: "3 x 1d10", movimento: "7.5m", custo: "5 PC" }, { nivel: 4, dano: "3 x 1d12", movimento: "9m", custo: "7 PC" }], efeitos: ["Alvo fica Desorientado (teste CORPO CD 10+ESP).", "Alvo testa DEX CD 14 ou -2 na Defesa por 1 turno."] },
      { nome: "Quarta Forma: Trovão Distante (Enrai)", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8 em linha 6m", custo: "4 PC" }, { nivel: 2, dano: "1d10 em linha 6m", custo: "5 PC" }, { nivel: 3, dano: "2d6 em linha 9m", custo: "6 PC" }, { nivel: 4, dano: "2d8 em linha 9m", custo: "7 PC" }], efeitos: ["Atravessa cobertura leve.", "Atinge todos na linha.", "Gera 1 Carga."] },
      { nome: "Quinta Forma: Heat Lightning (Netsu Kairai)", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6 + eletrocutar", custo: "3 PC" }, { nivel: 2, dano: "1d8 + eletrocutar", custo: "4 PC" }, { nivel: 3, dano: "1d10 + eletrocutar", custo: "5 PC" }, { nivel: 4, dano: "2d6 + eletrocutar", custo: "6 PC" }], efeitos: ["Alvo fica Suspenso por 1 turno (teste CORPO CD 10).", "Causa 1d4 de dano elétrico/turno por 2 turnos."] },
      { nome: "Sexta Forma: Trovão e Raio (Dengo Raigo)", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "3 x 1d4 em cone 4.5m", custo: "6 PC" }, { nivel: 2, dano: "3 x 1d6 em cone 4.5m", custo: "7 PC" }, { nivel: 3, dano: "3 x 1d8 em cone 6m", custo: "8 PC" }, { nivel: 4, dano: "3 x 1d10 em cone 6m", custo: "9 PC" }], efeitos: ["Inimigos têm Desvantagem na esquiva.", "Gera 1 Carga por acerto (máx. 2)."] },
      { nome: "Sétima Forma: Deus do Fogo e Trovão (Honoikazuchi no Kami)", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 3, dano: "2d10 + 2d8 elétrico", custo: "7 PC" }, { nivel: 4, dano: "2d12 + 2d10 elétrico", custo: "9 PC" }], efeitos: ["Movimento de +12m.", "Gasta todas as Cargas.", "Com 3 Cargas: Paralisia em área 3m.", "Teste de CORPO CD 16 ou Exaustão Nível 2."] }
    ]
  },
  {
    id: 'wind',
    nome: "Respiração do Vento: 風の呼吸 (Kaze no Kokyū)",
    conceito: "Estilo da Liberdade Tempestuosa - Foco em Movimento, Controle de Área e Combos.",
    historia: {
      titulo: "Takeshi Hayate: O Samurai do Vento",
      paragrafos: [
        "Takeshi Hayate nasceu nas planícies do Kantō. Era samurai de patrulha. Viu Yoriichi e não quis imitá-lo. Percebeu que o vencedor cria ritmo. Decidiu virar vento, não sol. Num dia de guerra e pó, Takeshi observou cavalos, ervas e bandeiras. Tudo reagia ao mesmo sopro. Entendeu: mover-se com o ambiente vence quem tenta controlá-lo. Transformou ritmo em lâmina."
      ]
    },
    passiva: {
      nome: "Espírito Indomável",
      descricao: "Seus movimentos criam lâminas de vento invisíveis (Cortes Invisíveis, máx. 3) através de formas bem-sucedidas.",
      efeitos: [
        { corte: 1, descricao: "+1 de dano por rodada em acertos consecutivos." },
        { corte: 2, descricao: "Desbloqueia 1 Reação de Contra-ataque (consome 1 corte)." },
        { corte: 3, descricao: "Ativa Ira dos Céus por 1 turno: +2 Ataque, ignora 25% defesa, dano em área secundário. Pós-uso: Fadiga do Vendaval (-1 esquiva/foco por 1 turno)." }
      ],
      reset: "Se for bloqueado ou ficar sem movimento por 1 turno."
    },
    formas: [
        { nome: "Primeira Forma: Tornado de Poeira Cortante (Sajin no Tatsumaki)", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8 em raio 3m", custo: "3 PC" }, { nivel: 2, dano: "1d10 em raio 3m", custo: "4 PC" }, { nivel: 3, dano: "2d6 em raio 3m", custo: "5 PC" }, { nivel: 4, dano: "2d8 em raio 3m", custo: "6 PC" }], efeitos: ["Inimigos testam COR CD 10+ESP ou ficam Desorientados.", "Gera 2 Cortes Invisíveis."] },
        { nome: "Segunda Forma: Garras Purificadoras de Vento (Fūsō no Jōzan)", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "4 x 1d4", custo: "2 PC" }, { nivel: 2, dano: "4 x 1d6", custo: "4 PC" }, { nivel: 3, dano: "4 x 1d8", custo: "5 PC" }, { nivel: 4, dano: "4 x 1d10", custo: "6 PC" }], efeitos: ["Se Ação Bônus: -2 PC.", "Gera 1 Corte Invisível por acerto (máx. 2)."] },
        { nome: "Terceira Forma: Árvore do Vento Limpo (Seifū no Ki)", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6 em raio 1.5m", custo: "2 PC" }, { nivel: 2, dano: "1d8 em raio 1.5m", custo: "3 PC" }, { nivel: 3, dano: "1d10 em raio 1.5m", custo: "4 PC" }, { nivel: 4, dano: "2d6 em raio 1.5m", custo: "5 PC" }], efeitos: ["+2 Defesa até próximo turno.", "Empurra inimigos 1.5m.", "Gera 1 Corte Invisível."] },
        { nome: "Variação Defensiva: Redemoinho Protetor", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bonus: "+2", custo: "1 PC" }, { nivel: 2, dano: "-", bonus: "+4", custo: "3 PC" }, { nivel: 3, dano: "-", bonus: "+6", custo: "5 PC" }, { nivel: 4, dano: "-", bonus: "+8", custo: "6 PC" }], efeitos: ["Se defender com sucesso, contra-ataque automático (1d6).", "Gera 1 Corte Invisível."] },
        { nome: "Quarta Forma: Tempestade de Poeira Crescente (Shōjin no Arashi)", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8 em cilindro 3m", custo: "4 PC" }, { nivel: 2, dano: "1d10 em cilindro 3m", custo: "5 PC" }, { nivel: 3, dano: "2d6 em cilindro 3m", custo: "6 PC" }, { nivel: 4, dano: "2d8 em cilindro 3m", custo: "7 PC" }], efeitos: ["Atinge voando/saltando.", "Teste de Força ou é levantado no ar.", "Gera 1 Corte Invisível."] },
        { nome: "Quinta Forma: Vento Gelado da Montanha (Sanrei no Kanpū)", tipo: "Ação Bônus ou Principal", niveis: [{ nivel: 1, dano: "2 + 1d6", custo: "3 PC" }, { nivel: 2, dano: "2 + 1d8", custo: "4 PC" }, { nivel: 3, dano: "2 + 1d10", custo: "5 PC" }, { nivel: 4, dano: "2 x 1d12", custo: "6 PC" }], efeitos: ["Aplica Lento por 1 turno.", "Gera 1 Corte Invisível por acerto."] },
        { nome: "Sexta Forma: Névoa da Montanha Negra (Kokuzan no Kiri)", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6 + névoa", custo: "3 PC" }, { nivel: 2, dano: "1d8 + névoa", custo: "4 PC" }, { nivel: 3, dano: "1d10 + névoa", custo: "5 PC" }, { nivel: 4, dano: "2d6 + névoa", custo: "6 PC" }], efeitos: ["Cria área de névoa (3m) que concede Camuflagem.", "Gera 1 Corte Invisível."] },
        { nome: "Sétima Forma: Rajadas Repentinas (Toppū no Ranbu)", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "3 x 1d4", custo: "5 PC" }, { nivel: 2, dano: "3 x 1d6", custo: "6 PC" }, { nivel: 3, dano: "3 x 1d8", custo: "7 PC" }, { nivel: 4, dano: "3 x 1d10", custo: "8 PC" }], efeitos: ["Vantagem contra alvos no ar.", "Gera 2 Cortes Invisíveis se todos acertarem."] },
        { nome: "Oitava Forma: Corte Vendaval Primário (Genshi no Guzan)", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "1d10 + zona", custo: "2 PC" }, { nivel: 2, dano: "1d12 + zona", custo: "4 PC" }, { nivel: 3, dano: "2d8 + zona", custo: "6 PC" }, { nivel: 4, dano: "2d10 + zona", custo: "9 PC" }], efeitos: ["Teste de Acrobacia para máximo alcance.", "Cria zona de vento (3m) que causa 1d4/rodada.", "Gera 2 Cortes Invisíveis.", "Cooldown: 1 turno."] },
        { nome: "Nona Forma: Tufão Idaten (Idaten no Taifū)", tipo: "Ação Principal", niveis: [{ nivel: 3, dano: "2d10 em raio 4.5m", custo: "6 PC" }, { nivel: 4, dano: "2d12 em raio 4.5m", custo: "9 PC" }], efeitos: ["Teste de Acrobacia para evitar Derrubado.", "Inimigos Atordoados por 1 turno.", "Gasta todos os Cortes Invisíveis."] },
        { nome: "Décima forma: Lâmina do Vendaval", tipo: "Reação", niveis: [{ nivel: 1, dano: "1d6", custo: "2 PC" }, { nivel: 2, dano: "1d8", custo: "3 PC" }, { nivel: 3, dano: "1d10", custo: "4 PC" }, { nivel: 4, dano: "2d6", custo: "5 PC" }], efeitos: ["Consome 1 Corte Invisível.", "Movimento de 1.5m após contra-ataque."] }
    ]
  },
  {
    id: 'beast',
    nome: "Respiração da Besta: 獣の呼吸 (Kemono no Kokyū)",
    conceito: "Ataques multiangulares, fúria acumulativa e sentidos aguçados.",
    historia: {
        titulo: "Inosuke Hashibira: O Selvagem",
        paragrafos: [
            "Inosuke Hashibira, criado por javalis nas montanhas, desenvolveu a Respiração da Besta instintivamente. Sua natureza feroz e agressiva se fundiu com movimentos selvagens e imprevisíveis, criando um estilo único que prioriza ataques multiangulares, fúria acumulativa e sentidos aguçados. Sem treinamento formal, ele forjou suas próprias lâminas serrilhadas, tornando-se uma força da natureza em combate."
        ]
    },
    passiva: {
        nome: "FÚRIA INSTINTIVA",
        descricao: "Lutar é existir; parar é morrer. Cada ação agressiva alimenta a Fúria Instintiva (Máx: 9).",
        acumulo: "+1 por acerto/esquiva, +2 por 3+ ataques/turno. Perde -2 se Derrubado/Atordoado. Zera se fugir ou ficar 3 rodadas sem atacar.",
        reset: "Zera se fugir ou ficar 3 rodadas sem atacar.",
        efeitos: [
            { furia: 3, descricao: "Pelagem Tensa: +1 Acerto/Esquiva quando com < 75% PV." },
            { furia: 6, descricao: "Alcance Feral: +2 Reflexo; abaixo de 50% PV, ganhe 1 ataque extra ou +1 alcance/turno." },
            { furia: 9, descricao: "Frenesi Animal (3 turnos): +2 dano, imune a medo/dor, ataques ignoram 1 Defesa. Pós-uso: Fúria zera e Exausto Nível 2." }
        ]
    },
    formas: [
        { nome: "ICHI NO KIBA: UGACHI NUKI / GOLPE PERFURANTE", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "2 x 1d6", custo: "1 PC" }, { nivel: 2, dano: "2 x 1d8", custo: "1 PC" }, { nivel: 3, dano: "2 x 1d10", custo: "2 PC" }, { nivel: 4, dano: "2 x 1d12", custo: "2 PC" }], efeitos: ["Gera 1 Fúria por golpe.", "Gaste 1 Momentum: causa Sangramento 1d4 se ambos acertarem."] },
        { nome: "NI NO KIBA: KIRISAKI / CORTE CRUZADO", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "2d6", custo: "2 PC" }, { nivel: 2, dano: "2d8", custo: "2 PC" }, { nivel: 3, dano: "2d10", custo: "3 PC" }, { nivel: 4, dano: "2d12", custo: "3 PC" }], efeitos: ["Ignora 2 de Armadura.", "Gera 2 Fúria.", "Gaste 2 Momentum: aplica Ferido (-1 testes físicos)."] },
        { nome: "SAN NO KIBA: KUIZAKI / PRESAS DECAPTADORAS", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "2 + 1d8", custo: "1 PC" }, { nivel: 2, dano: "2 + 1d10", custo: "1 PC" }, { nivel: 3, dano: "2 + 1d12", custo: "2 PC" }, { nivel: 4, dano: "2 x 2d8", custo: "2 PC" }], efeitos: ["+3 para acertar se inimigo estiver Desorientado.", "Gera 1 Fúria por acerto."] },
        { nome: "SHI NO KIBA: KIRI KOMAZAKI / CORTE DESPEDAÇADOR", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "4 + 1d6", custo: "3 PC" }, { nivel: 2, dano: "4 + 1d8", custo: "3 PC" }, { nivel: 3, dano: "4 + 1d10", custo: "4 PC" }, { nivel: 4, dano: "4 x 1d12", custo: "4 PC" }], efeitos: ["Gera 1 Fúria por golpe (máx. 3).", "Inimigo fica Sangrando 1d4 com 3+ acertos."] },
        { nome: "GO NO KIBA: KURUIZAKI / REDEMOINHO FEROZ", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "1d10 área 3m", custo: "4 PC" }, { nivel: 3, dano: "1d12 área 3m", custo: "6 PC" }, { nivel: 4, dano: "2d8 área 3m", custo: "8 PC" }], efeitos: ["Gera 2 Fúria + 1 por inimigo acertado.", "Inimigos ficam Desorientados."] },
        { nome: "ROKU NO KIBA: RANGUIGAMI / SERRAGEM CARNAL", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "2d6", custo: "3 PC" }, { nivel: 2, dano: "2d8", custo: "3 PC" }, { nivel: 3, dano: "2d10", custo: "4 PC" }, { nivel: 4, dano: "2d12", custo: "4 PC" }], efeitos: ["Causa Sangramento 1d6.", "Gera 3 Fúria.", "Gaste 2 Momentum: ignora Protegido/Bênção."] },
        { nome: "SHICHI NO KATA: KŪKAN SHIKIKAKU / DETECÇÃO ESPACIAL", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "-", custo: "1 PC" }, { nivel: 2, dano: "-", custo: "1 PC" }, { nivel: 3, dano: "-", custo: "2 PC" }, { nivel: 4, dano: "-", custo: "2 PC" }], efeitos: ["Detecta inimigos Invisíveis por 2 turnos.", "+2 Percepção.", "Gera 1 Fúria por inimigo detectado."] },
        { nome: "HACHI NO KATA: BAKURETSU MŌSHIN / CARGA EXPLOSIVA", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 2, dano: "1d12", custo: "4 PC" }, { nivel: 3, dano: "2d10", custo: "5 PC" }, { nivel: 4, dano: "2d12", custo: "5 PC" }], efeitos: ["Imune a Atordoado/Empurrado durante carga.", "Gera 4 Fúria.", "Requer 6+ Fúria para usar."] },
        { nome: "KU NO KIBA: SHIN - UNERIZAKI / COBRA OCULTA", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 2, dano: "1d10", custo: "2 PC" }, { nivel: 3, dano: "1d12", custo: "3 PC" }, { nivel: 4, dano: "2d8", custo: "3 PC" }], efeitos: ["Alcance +3m.", "Ignora ataques de oportunidade.", "Gera 2 Fúria."] },
        { nome: "JŪ NO KIBA: ENTEN SENGA / LÂMINAS GIRATÓRIAS", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bonus: "+2", custo: "2 PC" }, { nivel: 2, dano: "-", bonus: "+4", custo: "3 PC" }, { nivel: 3, dano: "-", bonus: "+6", custo: "4 PC" }, { nivel: 4, dano: "-", bonus: "+8", custo: "5 PC" }], efeitos: ["Pode refletir projéteis com sucesso crítico.", "Gera 1 Fúria por projétil bloqueado."] },
        { nome: "OMOITSUKI NO NAGESAKI / LANÇAMENTO INSTINTIVO", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "2 x 1d10", custo: "3 PC" }, { nivel: 3, dano: "2 x 1d12", custo: "4 PC" }, { nivel: 4, dano: "2 x 2d8", custo: "4 PC" }], efeitos: ["Alcance 9m.", "Ignora cobertura.", "Gera 2 Fúria + 1 por acerto."] }
    ]
  },
  {
    id: 'moon',
    nome: "Respiração da Lua: 月の呼吸 (Tsuki no Kokyū)",
    conceito: "Precisão mortal, ilusão complexa e ataques caóticos.",
    historia: {
      titulo: "Michigatsu Tsukiguni: O Reflexo Sombrio",
      paragrafos: [
        "Michigatsu Tsukiguni, irmão de Yoriichi, desenvolveu a Respiração da Lua durante o Período Sengoku como reflexo sombrio da Respiração do Sol. Enquanto seu irmão buscava a pureza solar, Michigatsu abraçou a fluidez lunar e suas ilusões, criando um estilo que funde precisão mortal, ilusão complexa e ataques caóticos. Sua técnica tornou-se conhecida por suas lâminas crescentes caóticas e movimentos imprevisíveis."
      ]
    },
    passiva: {
      nome: "CICLO LUNAR (Gessō) & LÂMINAS CAÓTICAS (Rantō)",
      descricao: "Acumula Fases Lunares (Máx: 4) por forma usada, ganhando bônus. Cada forma também gera Lâminas Caóticas (máx 10) que aprimoram ataques.",
      efeitos: [
        { fase: 1, descricao: "(Lua Nova): +1 Furtividade, ataques surpresa +1d4." },
        { fase: 2, descricao: "(Crescente): +1 Acerto, lâminas causam Sangrando (1d4)." },
        { fase: 3, descricao: "(Cheia): +2 Dano, crítico em 19-20." },
        { fase: 4, descricao: "(Minguante): 1 forma adicional como Ação Bônus 1x/combate." }
      ],
      laminasCaoticas: "A cada 3: ignora 2 armadura. A cada 6: +1.5m área. Com 10: explosão 2d6 área 3m como Reação.",
      reset: ""
    },
    formas: [
        { nome: "ICHI NO KATA: YAMIZUKI - YOI NO MIYA / PALÁCIO NOTURNO", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8", custo: "2 PC" }, { nivel: 2, dano: "1d10", custo: "4 PC" }, { nivel: 3, dano: "1d12", custo: "5 PC" }, { nivel: 4, dano: "2d8", custo: "6 PC" }], efeitos: ["Gera 1 Lâmina Caótica.", "Se usado primeiro no combate, causa Atordoado."] },
        { nome: "NI NO KATA: SHUKA NO RŌGETSU / FESTIVAL DA COLHEITA", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "3 x 1d6", custo: "1 PC" }, { nivel: 2, dano: "3 x 1d8", custo: "2 PC" }, { nivel: 3, dano: "3 x 1d10", custo: "4 PC" }, { nivel: 4, dano: "3 x 1d12", custo: "5 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "Inimigos ficam Sangrando 1d4."] },
        { nome: "SAN NO KATA: ENKIZUKI - TSUGARI / LAÇO LUNAR", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "2 x 1d8", custo: "2 PC" }, { nivel: 2, dano: "2 x 1d10", custo: "4 PC" }, { nivel: 3, dano: "2 x 1d12", custo: "5 PC" }, { nivel: 4, dano: "2 x 2d8", custo: "6 PC" }], efeitos: ["Gera 2 Lâminas Caóticas.", "Área 3m sofre 1d4 de dano residual."] },
        { nome: "SHI NO KATA: TSUKIYUME NO MAI /DANÇA DO SONHO LUNAR", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "2 x 1d8", custo: "3 PC" }, { nivel: 2, dano: "2 x 1d10", custo: "3 PC" }, { nivel: 3, dano: "2 x 1d12", custo: "4 PC" }, { nivel: 4, dano: "2 x 2d8", custo: "4 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "Inimigo fica Confuso por 1 turno."] },
        { nome: "GO NO KATA: GEPPAKU SAIKA / PURIFICAÇÃO GELADA", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10 área 3m", custo: "5 PC" }, { nivel: 2, dano: "1d12 área 3m", custo: "6 PC" }, { nivel: 3, dano: "2d8 área 3m", custo: "7 PC" }, { nivel: 4, dano: "2d10 área 3m", custo: "8 PC" }], efeitos: ["Gera 3 Lâminas.", "Inimigos ficam Congelados (metade movimento)."] },
        { nome: "ROKU NO KATA: TOKOYO KOGETSU - MUKEN / ETERNIDADE INEXISTENTE", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "4 x 1d8", custo: "4 PC" }, { nivel: 2, dano: "4 x 1d10", custo: "4 PC" }, { nivel: 3, dano: "4 x 1d12", custo: "5 PC" }, { nivel: 4, dano: "4 x 2d8", custo: "5 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "Alcance 6m.", "Objetos no caminho são destruídos."] },
        { nome: "SHICHI NO KATA: YAKKYŌ - ZUKIBAE / RESIDÊNCIA DA LUA", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d6", custo: "3 PC" }, { nivel: 2, dano: "1d8", custo: "4 PC" }, { nivel: 3, dano: "2d8", custo: "6 PC" }, { nivel: 4, dano: "2d10", custo: "8 PC" }], efeitos: ["Gera 2 Lâminas.", "Área em cone 6m.", "Ignora cobertura leve."] },
        { nome: "HACHI NO KATA: GETSURYŪ RINBI / DRAGÃO LUNAR", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10", custo: "4 PC" }, { nivel: 2, dano: "1d12", custo: "5 PC" }, { nivel: 3, dano: "2d8", custo: "7 PC" }, { nivel: 4, dano: "2d10", custo: "8 PC" }], efeitos: ["Gera 2 Lâminas.", "Alcance 9m.", "Causa Sangrando 1d6."] },
        { nome: "KU NO KATA: KUDARIZUKI - RENMEN / CADEIA DESCENDENTE", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "3 x 1d8", custo: "3 PC" }, { nivel: 2, dano: "3 x 1d10", custo: "3 PC" }, { nivel: 3, dano: "3 x 1d12", custo: "4 PC" }, { nivel: 4, dano: "3 x 2d8", custo: "4 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "Inimigos ficam Enraizados."] },
        { nome: "JŪ NO KATA: SENMENZAN - RAGETSU / MONTANHA RODOPIANTE", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "3 x 1d8", custo: "4 PC" }, { nivel: 2, dano: "3 x 1d10", custo: "4 PC" }, { nivel: 3, dano: "3 x 1d12", custo: "5 PC" }, { nivel: 4, dano: "3 x 2d8", custo: "5 PC" }], efeitos: ["Gera 3 Lâminas.", "Move-se 3m durante ataque.", "+1 Defesa durante movimento."] },
        { nome: "JŪ ICHI NO KATA: KOZUMIKKU INFERU NEDO / INFERNO CÓSMICO", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10 área 3m", custo: "5 PC" }, { nivel: 2, dano: "1d12 área 3m", custo: "5 PC" }, { nivel: 3, dano: "2d8 área 3m", custo: "6 PC" }, { nivel: 4, dano: "2d10 área 3m", custo: "6 PC" }], efeitos: ["Gera 4 Lâminas.", "Inimigos sofrem Atordoado e são puxados 3m."] },
        { nome: "JŪ NI NO KATA: NOBORU DZUKI GECCHŌSEKI / PICO DA LUA ASCENDENTE", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d12", custo: "8 PC" }, { nivel: 2, dano: "2d8", custo: "9 PC" }, { nivel: 3, dano: "2d10", custo: "10 PC" }, { nivel: 4, dano: "2d12", custo: "11 PC" }], efeitos: ["Gera 2 Lâminas.", "Inimigo é Derrubado.", "Área 3m sofre 1d6 de dano."] },
        { nome: "JŪ SAN NO KATA: MAYONAKA MUCHITSUJŌ, TEKI'I / CAOS DA MEIA-NOITE", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "5 x 1d8", custo: "5 PC" }, { nivel: 2, dano: "5 x 1d10", custo: "5 PC" }, { nivel: 3, dano: "5 x 1d12", custo: "6 PC" }, { nivel: 4, dano: "5 x 2d8", custo: "6 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "Inimigo fica Ferido (−1 testes físicos)."] },
        { nome: "JŪ SHI NO KATA: TENMAN SENGETSU / LUNA CHEIA CELESTIAL", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "1d12 área 6m", custo: "6 PC" }, { nivel: 3, dano: "2d8 área 6m", custo: "7 PC" }, { nivel: 4, dano: "2d10 área 6m", custo: "7 PC" }], efeitos: ["Gera 5 Lâminas.", "Inimigos ficam Cegos por 1 turno."] },
        { nome: "JŪ GO NO KATA: SHŪKAI HAKAI, SŌZŌ / CRIAÇÃO E DESTRUIÇÃO", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bonus: "+2", custo: "6 PC" }, { nivel: 2, dano: "-", bonus: "+4", custo: "6 PC" }, { nivel: 3, dano: "-", bonus: "+6", custo: "7 PC" }, { nivel: 4, dano: "-", bonus: "+8", custo: "7 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "+2 Defesa durante turno."] },
        { nome: "JŪ ROKU NO KATA: GEKKŌ - KATAWAREZUKI / LUNA MINGUANTE", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "6 x 1d10", custo: "6 PC" }, { nivel: 2, dano: "6 x 1d12", custo: "6 PC" }, { nivel: 3, dano: "6 x 2d8", custo: "7 PC" }, { nivel: 4, dano: "6 x 2d10", custo: "7 PC" }], efeitos: ["Gera 6 Lâminas por golpe."] },
        { nome: "JŪ SHICHI NO KATA: KUROMARU, GESSHOKU / ECLIPSE LUNAR", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10 área 3m", custo: "5 PC" }, { nivel: 2, dano: "1d12 área 3m", custo: "5 PC" }, { nivel: 3, dano: "2d8 área 3m", custo: "6 PC" }, { nivel: 4, dano: "2d10 área 3m", custo: "6 PC" }], efeitos: ["Gera 3 Lâminas.", "Inimigos ficam Confusos.", "Escuridão por 1 turno."] },
        { nome: "JŪ HACHI NO KATA: ITSUWARI NO RAKUEN, USUGURAI TSUKIAKARI / PARAÍSO ILUSÓRIO", tipo: "Ação Principal + Ação de Movimento", niveis: [{ nivel: 1, dano: "1d12", custo: "4 PC" }, { nivel: 2, dano: "2d8", custo: "6 PC" }, { nivel: 3, dano: "2d10", custo: "7 PC" }, { nivel: 4, dano: "2d12", custo: "8 PC" }], efeitos: ["Gera 2 Lâminas.", "Ataque é crítico automático se inimigo estiver desprevenido."] },
        { nome: "JŪ KYU NO KATA: GIN NO SERENĀDE, RYUUZA NO MAI (SERENATA PRATEADA)", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "8 x 1d12", custo: "8 PC" }, { nivel: 3, dano: "8 x 2d8", custo: "9 PC" }, { nivel: 4, dano: "8 x 2d10", custo: "9 PC" }], efeitos: ["Gera 1 Lâmina por golpe.", "Inimigos sofrem Amedrontado.", "Usuário ganha +2 Esquiva."] },
        { nome: "NI JŪ NO KATA: TSUKIKAMI KAGURA (DANÇA DO DEUS LUNAR)", tipo: "Ação Principal", niveis: [{ nivel: 4, dano: "10 x 3d12", custo: "10 PC" }], efeitos: ["Requer 4 Fases Lunares.", "Gera 10 Lâminas Caóticas.", "Aplica todos os efeitos de status das formas usadas.", "Pós-uso: Exausto Nível 4 por 3 turnos."] }
    ]
  },
  {
    id: 'mist',
    nome: "Respiração da Névoa: 霞の呼吸 (Kasumi no Kokyū)",
    conceito: "Velocidade etérea e ilusão tática.",
    historia: {
      titulo: "Muichiro Tokito: A Mente Vazia",
      paragrafos: [
        "Muichiro Tokito, o Pilar da Névoa, desenvolveu esta respiração através de seu estilo de luta único que funde velocidade etérea e ilusão tática. Sua mente vazia e natureza distante permitiram que ele dominasse a arte de confundir inimigos com movimentos intermitentes e ataques evasivos, criando um estilo que parece mais um sonho do que realidade."
      ]
    },
    passiva: {
      nome: "Kasumikage / Véu Etéreo (Oboro)",
      descricao: "Movimentos furtivos e esquivas acumulam Oboro (Máx: 9), camadas de névoa que confundem e permitem reposicionamento.",
      acumulo: "+1 por técnica/esquiva, +2 por ataque surpresa. Perde -1 ao errar, -2 ao ser atingido. Zera se agarrado/derrubado.",
      reset: "Zera se agarrado/derrubado.",
      efeitos: [
        { oboro: 3, descricao: "Véu Sutil: +1 Esquiva, inimigos com desvantagem para mirar." },
        { oboro: 6, descricao: "Passo Esfumado: 1x/rodada, mover-se sem detecção + ataque surpresa (consome 1 Oboro)." },
        { oboro: 9, descricao: "Névoa Total: Invisível +2 Esquiva por 1 rodada (consome 9 Oboro). Pós-uso: Oboro zera e Exausto Nível 1." }
      ]
    },
    formas: [
        { nome: "ICHI NO KATA: SUITEN TŌGASUMI / NÉVOA CELESTIAL", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8", custo: "1 PC" }, { nivel: 2, dano: "1d10", custo: "3 PC" }, { nivel: 3, dano: "1d12", custo: "5 PC" }, { nivel: 4, dano: "2d8", custo: "6 PC" }], efeitos: ["Gera 1 Oboro.", "Se mover antes do ataque, +2 de acerto."] },
        { nome: "NI NO KATA: YAEKASUMI / OITO CAMADAS DE NÉVOA", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "8 + 1d8", custo: "4 PC" }, { nivel: 3, dano: "8 + 1d10", custo: "5 PC" }, { nivel: 4, dano: "8 x 1d12", custo: "5 PC" }], efeitos: ["Gera 1 Oboro por golpe (máx. 4).", "Inimigo fica Confuso com 5+ acertos."] },
        { nome: "SAN NO KATA: KASAN NO SHIBUKI / RESPINGO EM CAMADAS", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bonus: "+2", custo: "2 PC" }, { nivel: 2, dano: "-", bonus: "+4", custo: "3 PC" }, { nivel: 3, dano: "-", bonus: "+6", custo: "4 PC" }, { nivel: 4, dano: "-", bonus: "+8", custo: "5 PC" }], efeitos: ["Gera 2 Oboro ao esquivar/bloquear.", "Contra-ataque automático 1d6 se defender CàC."] },
        { nome: "SHI NO KATA: IRYŪGIRI / CORTE DO DRAGÃO ERRANTE", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6", custo: "1 PC" }, { nivel: 2, dano: "1d8", custo: "1 PC" }, { nivel: 3, dano: "1d10", custo: "2 PC" }, { nivel: 4, dano: "1d12", custo: "2 PC" }], efeitos: ["Gera 1 Oboro.", "Inimigo fica com Restrição de Movimentos."] },
        { nome: "GO NO KATA: KAUN NO UMI / MAR DE NUVENS", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "3 + 1d8", custo: "3 PC" }, { nivel: 2, dano: "3 + 1d10", custo: "3 PC" }, { nivel: 3, dano: "3 + 1d12", custo: "4 PC" }, { nivel: 4, dano: "3 x 2d8", custo: "4 PC" }], efeitos: ["Gera 1 Oboro por golpe.", "Inimigo fica Desorientado com 2+ acertos."] },
        { nome: "ROKU NO KATA: TSUKI NO KASHł / CANÇÃO LUNAR", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 2, dano: "1d12 área 3m", custo: "4 PC" }, { nivel: 3, dano: "2d10 área 3m", custo: "5 PC" }, { nivel: 4, dano: "2d12 área 3m", custo: "5 PC" }], efeitos: ["Gera 3 Oboro + 1 por inimigo acertado.", "Inimigos ficam Atordoados."] },
        { nome: "SHICHI NO KATA: OBORO / VÉU ILUSÓRIO", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "1d10", custo: "3 PC" }, { nivel: 3, dano: "1d12", custo: "4 PC" }, { nivel: 4, dano: "2d8", custo: "4 PC" }], efeitos: ["Gera 3 Oboro.", "Inimigo fica Confuso e Desorientado por 2 turnos."] }
    ]
  },
  {
    id: 'stone',
    nome: "Respiração da Pedra: 岩の呼吸 (Iwa no Kokyū)",
    conceito: "Resistência ativa: suportar, concentrar e devolver força.",
    historia: {
      titulo: "Kazuyoshi Iwamoto: O Monge da Montanha",
      paragrafos: [
        "Seu criador foi um monge chamado Kazuyoshi Iwamoto. Enquanto outros monges buscavam iluminação no vazio, Kazuyoshi encontrou-a na densidade. Ao golpear rochas, percebeu padrões de som e reverberação, transpondo esse conhecimento para o combate. Seus golpes não atravessam, eles esmagam, enraízam e transferem a força do ataque de volta ao chão."
      ]
    },
    passiva: {
      nome: "SEKISHIN (CORAÇÃO DE PEDRA)",
      descricao: "Cada bloqueio, impacto pesado e momento de firmeza acumula Pedra (Máx. 9), uma reserva de estabilidade que transforma resistência em poder.",
      acumulo: "+1 ao receber ataque, +2 por golpe pesado, +1 por não se mover. Perde -1 ao mover >5m. Zera se Derrubado.",
      reset: "Zera se Derrubado.",
      efeitos: [
        { pedra: 3, descricao: "Pele de Rocha: +2 Defesa contra ataques físicos." },
        { pedra: 6, descricao: "Coluna Inabalável: Imune a Empurrado/Derrubado, ataques pesados +2 dano." },
        { pedra: 9, descricao: "Tremor do Monge: Gaste 9 Pedra para Atordoar inimigos em 3m e recuperar 1d8 PV." }
      ]
    },
    formas: [
        { nome: "ICHI NO KATA: JAMONGAN - SŌKYOKU / PERFURADOR DA ROCHA", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10", custo: "2 PC" }, { nivel: 2, dano: "1d12", custo: "4 PC" }, { nivel: 3, dano: "2d8", custo: "6 PC" }, { nivel: 4, dano: "2d10", custo: "7 PC" }], efeitos: ["Gera 1 Pedra.", "Ignora 3 de Armadura.", "Gaste 2 Momentum: causa Sangramento 1d4."] },
        { nome: "NI NO KATA: TENMEN KUDAKI / ESMAGADOR CELESTIAL", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "1d8 + 1d6", custo: "2 PC" }, { nivel: 2, dano: "1d10 + 1d8", custo: "4 PC" }, { nivel: 3, dano: "1d12 + 1d10", custo: "6 PC" }, { nivel: 4, dano: "2d8 + 1d12", custo: "8 PC" }], efeitos: ["Gera 1 Pedra por acerto.", "Inimigo fica Desorientado se falhar teste CORPO CD 10+ESP."] },
        { nome: "SAN NO KATA: GANKU NO HADAE / CORTINA ROCHOSA", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bonus: "+2", custo: "1 PC" }, { nivel: 2, dano: "-", bonus: "+4", custo: "2 PC" }, { nivel: 3, dano: "-", bonus: "+6", custo: "4 PC" }, { nivel: 4, dano: "-", bonus: "+8", custo: "6 PC" }], efeitos: ["Gera 2 Pedra ao bloquear.", "Contra-ataque automático 1d6 se bloquear com sucesso."] },
        { nome: "SHI NO KATA: RYŪMONGAN - SOKUSEI / DRAGÃO ROCHOSO", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "1d8 em 2 alvos", custo: "3 PC" }, { nivel: 2, dano: "1d10 em 2 alvos", custo: "3 PC" }, { nivel: 3, dano: "1d12 em 2 alvos ou 1d8 em 3", custo: "5 PC" }, { nivel: 4, dano: "2d8 em 2 alvos ou 1d10 em 3", custo: "6 PC" }], efeitos: ["Gera 1 Pedra por alvo.", "Inimigos com Restrição de Movimentos se falharem teste CORPO CD 13."] },
        { nome: "GO NO KATA: GARIN GYŌBU / SALÃO ROCHOSO DO JULGAMENTO", tipo: "Ação Principal + Ação Bônus", niveis: [{ nivel: 3, dano: "3d10", custo: "6 PC" }, { nivel: 4, dano: "3d12", custo: "9 PC" }], efeitos: ["Causa Atordoado e Derrubado.", "Gera 3 Pedra.", "Requer 6+ Pedra para usar."] }
    ]
  },
  {
    id: 'serpent',
    nome: "Respiração da Serpente: 蛇の呼吸 (Hebi no Kokyū)",
    conceito: "Paciência, posicionamento e golpes que contornam defesas.",
    historia: {
      titulo: "Obanai Iguro: A Lâmina Ondulada",
      paragrafos: [
        "Na Era Taisho, Obanai Iguro, de corpo frágil, buscou uma arte que se adequasse à sua realidade. Observando serpentes, notou sua astúcia e movimentos espiralados. Treinou com uma katana ondulada, fundindo movimentos circulares com a lâmina. Sua respiração tornou-se sibilante e ritmada, canalizando a velocidade de ataque da serpente."
      ]
    },
    passiva: {
      nome: "Fio da Serpente (Jakuei)",
      descricao: "Ataques em arco e esquivas acumulam Uroko (Escama, Máx 9), que representa fluidez e tensão para contornar defesas.",
      acumulo: "+1 por ataque em arco/esquiva, +2 por ataque de flanco/costas. Perde -1 ao ser atingido. Zera se preso/derrubado.",
      reset: "Zera se preso/derrubado.",
      efeitos: [
        { uroko: 3, descricao: "Corte que Escorrega: Golpes em arco ignoram bloqueios frontais. Esquiva perfeita dá +1 Acerto." },
        { uroko: 6, descricao: "Enrosco: Primeiro ataque +2 dano perfurante. Após acerto, pode reposicionar e atacar flancos (consome 1 Uroko)." },
        { uroko: 9, descricao: "Presa Final: Consome 9 Uroko para garantir Crítico e +3 dano. Pós-uso: Fadiga leve no turno seguinte." }
      ]
    },
    formas: [
        { nome: "Ichi no Kata: Idagiri", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d6", custo: "1 PC" }, { nivel: 2, dano: "1d8", custo: "3 PC" }, { nivel: 3, dano: "1d10", custo: "4 PC" }, { nivel: 4, dano: "1d12", custo: "6 PC" }], efeitos: ["Gera 1 Uroko.", "Com 3+ Uroko, alvo fica Marcado Espiritualmente."] },
        { nome: "Ni no Kata: Kyōzu no Dokuga", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8", custo: "3 PC" }, { nivel: 2, dano: "1d10", custo: "4 PC" }, { nivel: 3, dano: "2d6", custo: "6 PC" }, { nivel: 4, dano: "2d8", custo: "8 PC" }], efeitos: ["Gera 2 Uroko.", "Gaste 2 Momentum: causa Sangramento (1d4)."] },
        { nome: "San no Kata: Toguro Jime", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d4", custo: "1 PC" }, { nivel: 2, dano: "1d6", custo: "1 PC" }, { nivel: 3, dano: "1d8", custo: "2 PC" }, { nivel: 4, dano: "1d10", custo: "2 PC" }], efeitos: ["Gera 1 Uroko por acerto (máx. 2).", "Com 6+ Uroko, aplica Restrição de Movimentos (-50%)."] },
        { nome: "Shi no Kata: Keija Sōsei", tipo: "Ação Bônus", niveis: [{ nivel: 1, dano: "1d6", custo: "1 PC" }, { nivel: 2, dano: "1d8", custo: "1 PC" }, { nivel: 3, dano: "1d10", custo: "2 PC" }, { nivel: 4, dano: "1d12", custo: "2 PC" }], efeitos: ["Gera 1 Uroko.", "Gaste 1 Momentum: ignora ataques de oportunidade."] },
        { nome: "Go no Kata: En'en Chōda", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "1d6 em 2 alvos", custo: "3 PC" }, { nivel: 2, dano: "1d8 em 2 / 1d6 em 3", custo: "3 PC" }, { nivel: 3, dano: "1d10 em 2 / 1d8 em 3 / 1d6 em 4", custo: "4 PC" }, { nivel: 4, dano: "1d12 em 2 / 1d10 em 3 / 1d8 em 4", custo: "4 PC" }], efeitos: ["Gera 1 Uroko por alvo (máx. 3).", "Gaste 3 Momentum: Ação Bônus 1x/combate."] }
    ]
  },
  {
    id: 'flower',
    nome: "Respiração das Flores: 花の呼吸 (Hana no Kokyū)",
    conceito: "Estilo da Graça Mortal - Foco em Velocidade, Precisão e Combos.",
    historia: {
      titulo: "Kanae Kochou: A Flor que Dançou Contra a Corrente",
      paragrafos: [
        "Kanae Kochou, treinando sob a Respiração da Água, achou o estilo rígido para sua constituição frágil. Observando flores balançando ao vento, ela entendeu que a força está em acompanhar o movimento, não resistir. Ela refinou os fundamentos da Água em algo mais leve e elegante, criando um fluxo de cortes graciosos e imprevisíveis. Sua lâmina dança, não luta."
      ]
    },
    passiva: {
      nome: "Dança das Mil Pétalas / Sakura Sanka",
      descricao: "Movimentos liberam pétalas de energia. Cada Forma ou acerto concede 1 Pétala Rubra (máx. 6), que concede poder progressivo.",
      acumulo: "+1 Pétala por acerto/Forma. Zera ao errar ou ser interrompido.",
      reset: "Zera ao errar ou ser interrompido.",
      efeitos: [
        { petala: 3, descricao: "Ativa Passos de Neve Rubra: +3m movimento, +1 Acerto, +5 Dano, -1 no crítico base." },
        { petala: 6, descricao: "Ativa Explosão Carmesim (consome 6 Pétalas): +8 dano por 1 turno, 1 ataque adicional gratuito. Pós-uso: Fadiga Floral (-5m movimento, -3 acerto)." }
      ]
    },
    formas: [
        { nome: "Primeira Forma: Flor de Gelo / Ichi no kata: Kōri no Hana", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "1d8 em raio 3m", custo: "3 PC" }, { nivel: 2, dano: "1d10 em raio 3m", custo: "4 PC" }, { nivel: 3, dano: "2d6 em raio 3m", custo: "5 PC" }, { nivel: 4, dano: "2d8 em raio 3m", custo: "6 PC" }], efeitos: ["Inimigos testam CORPO CD 10 ou ficam Lentos.", "Gera 2 Pétalas Rubras."] },
        { nome: "Segunda Forma: Ume Sombria / Ni no kata: Mikage Ume", tipo: "Reação", niveis: [{ nivel: 1, dano: "-", bonus: "+2 Esq/+2 Prec", custo: "1 PC" }, { nivel: 2, dano: "-", bonus: "+4 Esq/+4 Prec", custo: "2 PC" }, { nivel: 3, dano: "-", bonus: "+6 Esq/+6 Prec", custo: "4 PC" }, { nivel: 4, dano: "-", bonus: "+8 Esq/+8 Prec", custo: "6 PC" }], efeitos: ["Se esquivar com sucesso, contra-ataque com Vantagem.", "Gera 1 Pétala Rubra."] },
        { nome: "Terceira Forma: Luz Fantasma do Damasco / San no kata: Ume no Shiranui", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "6 x 1d4", custo: "2 PC" }, { nivel: 2, dano: "6 x 1d6", custo: "4 PC" }, { nivel: 3, dano: "6 x 1d8", custo: "6 PC" }, { nivel: 4, dano: "6 x 1d10", custo: "8 PC" }], efeitos: ["Ignora 2 de Defesa.", "Gera 1 Pétala Rubra por acerto (máx. 3)."] },
        { nome: "Quarta Forma: Véu Carmesim / Shi no kata: Beni Hanagoromo", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "1d8", custo: "2 PC" }, { nivel: 2, dano: "1d10", custo: "3 PC" }, { nivel: 3, dano: "2d6", custo: "4 PC" }, { nivel: 4, dano: "2d8", custo: "5 PC" }], efeitos: ["Se Bônus: 1 PC, aplica Sangramento 1d4/rodada por 2 turnos.", "Gera 1 Pétala Rubra."] },
        { nome: "Quinta Forma: Peônia Carmesim / Go no kata: Ada no Shakuyaku", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "9 x 1d4", custo: "2 PC" }, { nivel: 2, dano: "9 x 1d6", custo: "4 PC" }, { nivel: 3, dano: "9 x 1d8", custo: "6 PC" }, { nivel: 4, dano: "9 x 1d10", custo: "8 PC" }], efeitos: ["Se 5+ golpes acertarem, Atordoa por 1 turno.", "Gera 1 Pétala Rubra por acerto (máx. 4)."] },
        { nome: "Sexta Forma: Girassol Oculto / Roku no kata: Uzumomo", tipo: "Ação Bônus (após esquiva) / Principal", niveis: [{ nivel: 3, dano: "1d10 + 1d8 perfurante", custo: "5 PC" }, { nivel: 4, dano: "1d12 + 1d10 perfurante", custo: "6 PC" }], efeitos: ["Se usado após esquiva: +2 de Precisão.", "Gera 2 Pétalas Rubras."] },
        { nome: "Sétima Forma: Fluxo da Flor Eterna / Shichi no kata: Mugunghwa no Nagare", tipo: "Ação Principal ou Bônus", niveis: [{ nivel: 1, dano: "3 x 1d6", custo: "4 PC" }, { nivel: 2, dano: "3 x 1d8", custo: "5 PC" }, { nivel: 3, dano: "3 x 1d10", custo: "6 PC" }, { nivel: 4, dano: "3 x 1d12", custo: "7 PC" }], efeitos: ["Recupera 1 PC por acerto.", "Gera 1 Pétala Rubra por acerto.", "Combo não quebra por 1 turno."] },
        { nome: "Oitava Forma: Visão do Outro Lado / Hachi no kata: Higan Shugan", tipo: "Ação Bônus / Passivo", niveis: [{ nivel: 1, dano: "-", bonus: "+2 Prec", custo: "3 PC" }, { nivel: 2, dano: "-", bonus: "+4 Prec", custo: "4 PC" }, { nivel: 3, dano: "-", bonus: "+6 Prec", custo: "5 PC" }, { nivel: 4, dano: "-", bonus: "+8 Prec", custo: "6 PC" }], efeitos: ["Vantagem em todos os ataques por 1 turno.", "Gera 1 Pétala Rubra extra por ataque.", "A cada turno, teste de CORPO (CD 14+) ou sofre Cegueira. Risco de dano permanente com d100."] }
    ]
  },
  {
    id: 'love',
    nome: "Respiração do Amor: 恋の呼吸 (Koi no Kokyū)",
    conceito: "Mobilidade, proteção de aliados e cortes de suporte.",
    historia: {
      titulo: "Mitsuri Kanroji: O Coração Elástico",
      paragrafos: [
        "Mitsuri nasceu com uma fisiologia anômala: músculos densos e articulações elásticas. Sua personalidade afetuosa amplificava sua força ao proteger alguém. Treinada por Rengoku, ela pegou a disciplina da Respiração das Chamas e a contorceu com sua elasticidade corporal e emocional, criando a Respiração do Amor. Sua lâmina Nichirin ultrafina e maleável funciona como uma extensão de seus músculos, um chicote letal."
      ]
    },
    passiva: {
      nome: "CORAÇÃO ARDENTE / MOERU KOKORO",
      descricao: "Cada acerto com uma forma do Amor gera 1 Laço (Máx: 3). Laços fortalecem o usuário e podem ser consumidos para defesa.",
      acumulo: "+1 Laço por acerto. Zera se Atordoado/Inconsciente.",
      reset: "Zera se Atordoado/Inconsciente.",
      efeitos: [
        { laco: 1, descricao: "+1 Reflexo e Precisão." },
        { laco: 2, descricao: "+1 Dano e +1 Defesa." },
        { laco: 3, descricao: "Paixão Devastadora (1 rodada): +2 Ataque, críticos curam 1d6 PV, inimigos que acertarem sofrem Empurrado. Pós-uso: Coração Partido (-1 atributos físicos por 1 turno)." }
      ]
    },
    formas: [
        { nome: "ICHI NO KATA: HATSUKOI NO WANANAK / PRIMEIRO AMOR INESQUECÍVEL", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8", custo: "1 PC" }, { nivel: 2, dano: "1d10", custo: "1 PC" }, { nivel: 3, dano: "1d12", custo: "2 PC" }, { nivel: 4, dano: "2d8", custo: "2 PC" }], efeitos: ["Gera 1 Laço.", "Alvo fica Marcado (visível apenas para o usuário)."] },
        { nome: "NI NO KATA: ŌNŌ MEGURU KOI / AMOR QUE ENVOLVE TUDO", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d10", custo: "2 PC" }, { nivel: 2, dano: "2d6", custo: "3 PC" }, { nivel: 3, dano: "2d8", custo: "4 PC" }, { nivel: 4, dano: "2d10", custo: "6 PC" }], efeitos: ["Gera 1 Laço.", "Inimigo fica com Restrição de Movimentos (teste CORPO CD 12)."] },
        { nome: "SAN NO KATA: KOI NEKO SHIGURE / CHUVA DE GATOS AMOROSOS", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "3 x 1d6", custo: "3 PC" }, { nivel: 2, dano: "3 x 1d8", custo: "3 PC" }, { nivel: 3, dano: "3 x 1d10", custo: "4 PC" }, { nivel: 4, dano: "3 x 1d12", custo: "4 PC" }], efeitos: ["Gera 1 Laço por golpe (máx. 2).", "Inimigo fica Desorientado (teste CORPO CD 10+ESP)."] },
        { nome: "SHI NO KATA: REN'AI NO CHŌRINKEN / ESPIRAL DO AMOR", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8 área 3m", custo: "3 PC" }, { nivel: 2, dano: "1d10 área 3m", custo: "3 PC" }, { nivel: 3, dano: "1d12 área 3m", custo: "4 PC" }, { nivel: 4, dano: "2d8 área 3m", custo: "4 PC" }], efeitos: ["Gera 1 Laço.", "Inimigos são Empurrados 2m."] },
        { nome: "GO NO KATA: YURAMEKU RENJŌ - MIDAREZUME / TURBILHÃO DE EMOÇÕES", tipo: "Ação Principal", niveis: [{ nivel: 3, dano: "4 x 1d12", custo: "5 PC" }, { nivel: 4, dano: "4 x 2d8", custo: "5 PC" }], efeitos: ["Gera 1 Laço por golpe (máx. 3).", "Inimigos ficam Confusos (teste MENTE CD 10+MENTE)."] },
        { nome: "ROKU NO KATA: NEKO ASHI KOI KAZE / VENTO DO AMOR DA PATA DE GATO", tipo: "Ação Bônus ou Principal", niveis: [{ nivel: 2, dano: "2 x 1d8", custo: "2 PC" }, { nivel: 3, dano: "2 x 1d10", custo: "3 PC" }, { nivel: 4, dano: "2 x 1d12", custo: "3 PC" }], efeitos: ["Gera 1 Laço.", "Alcance +3m.", "Gaste 1 Momentum: Ação Bônus."] },
        { nome: "SHICHI NO KATA: AI NO ENBU / DANÇA DO AFEIÇÃO", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "3 x 1d10", custo: "4 PC" }, { nivel: 3, dano: "3 x 1d12", custo: "5 PC" }, { nivel: 4, dano: "3 x 2d8", custo: "5 PC" }], efeitos: ["Gera 1 Laço por golpe.", "Inimigo é puxado se acertado no último golpe.", "+2 Defesa durante execução."] },
        { nome: "HACHI NO KATA: KETSUEN NO ITTO / CORTE DO ELO CARMESIM", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 4, dano: "2d12", cura: "1d12", custo: "6 PC" }], efeitos: ["Gera 2 Laços.", "Inimigo fica Sangrando (1d6/turno) e com Restrição de Movimentos.", "Usuário cura PV igual ao dano do sangramento."] }
    ]
  },
  {
    id: 'insect',
    nome: "Respiração do Inseto: 蟲の呼吸 (Mushi no Kokyū) 🦋",
    conceito: "Velocidade extrema, precisão cirúrgica e acúmulo de toxinas.",
    historia: {
      titulo: "Shinobu Kocho: A Borboleta Venenosa",
      paragrafos: [
        "Shinobu Kocho desenvolveu a Respiração do Inseto para compensar sua força física limitada. Inspirada pela precisão de insetos venenosos, ela fundiu esgrima com movimentos de agulha, criando um estilo que enfatiza velocidade, precisão e acúmulo de toxinas com sua espada fina como um ferrão."
      ]
    },
    passiva: {
      nome: "FERRÕES VENENOSOS",
      descricao: "Golpes precisos acumulam Ferrões (Máx: 9), camadas de veneno que aumentam a letalidade.",
      acumulo: "+1 por estocada precisa, +2 por ataque de surpresa/crítico. Perde -1 ao errar. Zera se alvo receber antídoto.",
      reset: "Zera se alvo receber antídoto.",
      efeitos: [
        { ferrao: 3, descricao: "Irritação: Alvo sofre Envenenado (1d4/turno). A cada 3 acertos seguidos, 1 ataque extra." },
        { ferrao: 6, descricao: "Envenenamento Profundo: +2 Destreza, veneno causa 1d6/turno, alvo -1 Defesa." },
        { ferrao: 9, descricao: "Sinapse Letal (gaste 9): Por 2 rodadas, vantagem em ataques e +2 dano. Pós-uso: Ferrões zeram e Exausto Nível 1." }
      ]
    },
    formas: [
        { nome: "CHŌ NO MAI: TAWAMURE / DANÇA DA BORBOLETA: BRINCADEIRA", tipo: "Ação Principal + Movimento", niveis: [{ nivel: 1, dano: "1d6 + 1d4 veneno", custo: "2 PC" }, { nivel: 2, dano: "1d8 + 1d4 veneno", custo: "3 PC" }, { nivel: 3, dano: "1d10 + 1d6 veneno", custo: "5 PC" }, { nivel: 4, dano: "1d12 + 1d6 veneno", custo: "6 PC" }], efeitos: ["Gera 1 Ferrão.", "Alvo Envenenado 1d4/turno por 1d3 turnos.", "Gaste 1 Momentum: +2 acerto."] },
        { nome: "HŌGA NO MAI: MANABIKI / DANÇA DA VESPA: ATRAÇÃO", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "1d8 + 1d4 veneno", custo: "2 PC" }, { nivel: 2, dano: "1d10 + 1d4 veneno", custo: "2 PC" }, { nivel: 3, dano: "1d12 + 1d6 veneno", custo: "3 PC" }, { nivel: 4, dano: "2d8 + 1d6 veneno", custo: "3 PC" }], efeitos: ["Gera 2 Ferrões.", "Veneno Envenenado 1d4/turno por 1d3 turnos.", "Gaste 2 Momentum: veneno dura +1 turno."] },
        { nome: "MŌKA NO MAI: SESSAKU NO SASOI / DANÇA DA MARIPOSA: CONVITE À MORTE", tipo: "Ação Principal", niveis: [{ nivel: 1, dano: "3 + 1d6 + 1d6 veneno", custo: "4 PC" }, { nivel: 2, dano: "3 + 1d8 + 1d8 veneno", custo: "4 PC" }, { nivel: 3, dano: "3 + 1d10 + 1d10 veneno", custo: "5 PC" }, { nivel: 4, dano: "3 x 1d12 + 1d12 veneno", custo: "5 PC" }], efeitos: ["Gera 1 Ferrão por golpe.", "Último golpe Envenenado 1d6/turno por 2 turnos.", "Inimigo Desorientado com 2+ acertos."] },
        { nome: "SEIREI NO MAI: FUKUGAN ROKKAKU / DANÇA DO ESPÍRITO: HEXÁGONO COMPOSTO", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "6 + 1d8", custo: "5 PC" }, { nivel: 3, dano: "6 + 1d10", custo: "6 PC" }, { nivel: 4, dano: "6 x 1d12", custo: "6 PC" }], efeitos: ["Gera 1 Ferrão por golpe (máx. 3).", "Cada acerto aplica Envenenado = 1d4/turno cumulativo."] },
        { nome: "GOKO NO MAI: HYAKUSOKU JABARA / DANÇA DO INSETO VENENOSO: SERPENTE DE CEM PATAS", tipo: "Ação Principal", niveis: [{ nivel: 2, dano: "2d10 + 1d10 veneno", custo: "4 PC" }, { nivel: 3, dano: "2d12 + 1d12 veneno", custo: "5 PC" }, { nivel: 4, dano: "3d10 + 2d10 veneno", custo: "5 PC" }], efeitos: ["Gera 3 Ferrões.", "Alvo fica Envenenado = 1d10/turno por 3 turnos e Atordoado por 1 turno.", "Requer 6+ Ferrões."] }
    ]
  }
];
