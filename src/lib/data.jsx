// ============================================================
// Figurinos TJA — dados mockados do protótipo
// Valores ilustrativos. Aluguel fixo configurável; caução R$ 50 fixos.
// ============================================================
const VALOR_ALUGUEL = 35;   // por peça (config. admin)
const VALOR_CAUCAO = 50;    // fixo por locação

const USERS = {
  figurinista: { name: 'Conceição Dantas', role: 'Figurinista', perfil: 'figurinista' },
  admin: { name: 'Raimundo Filho', role: 'Administração', perfil: 'admin' },
};

// Locatários
const LOCATARIOS = [
  { id: 'L1', nome: 'Companhia Pavilhão da Magnólia', cpf: '472.118.330-09', tel: '(85) 99841-2207', email: 'producao@pavilhaomagnolia.art.br' },
  { id: 'L2', nome: 'Bando de Teatro Solar', cpf: '218.905.774-51', tel: '(85) 98162-7740', email: 'contato@bandosolar.com.br' },
  { id: 'L3', nome: 'Mariana Qutinho', cpf: '901.334.628-72', tel: '(85) 99730-1185', email: 'mari.q@gmail.com' },
  { id: 'L4', nome: 'Escola de Dança Lia Mara', cpf: '550.471.203-88', tel: '(85) 99204-5512', email: 'secretaria@liamara.com.br' },
];

// Peças do acervo
const PECAS = [
  { id: 'P1', nome: 'Vestido Belle Époque', categoria: 'Vestido', tamanho: 'M', cor: 'Marfim', material: 'Renda e cetim', estado: 'disponivel', conservacao: 'Bom', local: 'Arara A · Prateleira 2', foto: 'https://placehold.co/400x500/e8e0ce/5c4a2a?text=Vestido+Belle+Epoque' },
  { id: 'P2', nome: 'Casaca de Veludo Bordô', categoria: 'Casaco', tamanho: 'G', cor: 'Bordô', material: 'Veludo', estado: 'em_uso', conservacao: 'Ótimo', local: 'Arara C · Prateleira 1', foto: 'https://placehold.co/400x500/7a1e2e/fce8ec?text=Casaca+de+Veludo+Bordo' },
  { id: 'P3', nome: 'Capa Imperial Dourada', categoria: 'Capa', tamanho: 'Único', cor: 'Dourado', material: 'Brocado', estado: 'em_uso', conservacao: 'Bom', local: 'Arara C · Prateleira 1', foto: 'https://placehold.co/400x500/b8860b/fff8dc?text=Capa+Imperial+Dourada' },
  { id: 'P4', nome: 'Saia de Cancan', categoria: 'Saia', tamanho: 'P', cor: 'Vermelho', material: 'Tule', estado: 'manutencao', conservacao: 'Regular', local: 'Costura · Banca 2', foto: 'https://placehold.co/400x500/c0392b/fef9f9?text=Saia+de+Cancan' },
  { id: 'P5', nome: 'Colete Vitoriano', categoria: 'Colete', tamanho: 'M', cor: 'Cinza-chumbo', material: 'Lã', estado: 'disponivel', conservacao: 'Bom', local: 'Arara B · Prateleira 3', foto: 'https://placehold.co/400x500/5a6a7a/ecf0f4?text=Colete+Vitoriano' },
  { id: 'P6', nome: 'Vestido de Baile Esmeralda', categoria: 'Vestido', tamanho: 'G', cor: 'Verde', material: 'Seda', estado: 'disponivel', conservacao: 'Ótimo', local: 'Arara A · Prateleira 4', foto: 'https://placehold.co/400x500/1a6b3c/e8f5ee?text=Vestido+de+Baile+Esmeralda' },
  { id: 'P7', nome: 'Fraque Preto Clássico', categoria: 'Terno', tamanho: 'G', cor: 'Preto', material: 'Lã fria', estado: 'em_uso', conservacao: 'Bom', local: 'Arara D · Prateleira 1', foto: 'https://placehold.co/400x500/1a1a2e/e8e8f0?text=Fraque+Preto+Classico' },
  { id: 'P8', nome: 'Chapéu Cartola', categoria: 'Acessório', tamanho: 'Único', cor: 'Preto', material: 'Feltro', estado: 'disponivel', conservacao: 'Bom', local: 'Acessórios · Gaveta 5', foto: 'https://placehold.co/400x500/2d2d2d/eeeeee?text=Chapeu+Cartola' },
  { id: 'P9', nome: 'Anágua Rendada', categoria: 'Roupa de baixo', tamanho: 'M', cor: 'Branco', material: 'Algodão e renda', estado: 'em_uso', conservacao: 'Regular', local: 'Arara B · Prateleira 1', foto: 'https://placehold.co/400x500/f4f0ea/6a5a4a?text=Nagua+Rendada' },
  { id: 'P10', nome: 'Túnica Grega', categoria: 'Túnica', tamanho: 'Único', cor: 'Marfim', material: 'Linho', estado: 'disponivel', conservacao: 'Bom', local: 'Arara E · Prateleira 2', foto: 'https://placehold.co/400x500/ede8d5/5a4a2a?text=Tunica+Grega' },
];

// Locações (vinculam locatário + peças + estado da máquina)
const LOCACOES = [
  {
    id: 'LOC-204', locatarioId: 'L1', estado: 'aguardando_pgto',
    criadaEm: '09/06/2026', previsao: '23/06/2026',
    pecasIds: ['P2', 'P3'], criadaPor: 'Conceição Dantas',
  },
  {
    id: 'LOC-205', locatarioId: 'L3', estado: 'aguardando_pgto',
    criadaEm: '10/06/2026', previsao: '17/06/2026',
    pecasIds: ['P7'], criadaPor: 'Conceição Dantas',
  },
  {
    id: 'LOC-198', locatarioId: 'L2', estado: 'em_uso',
    criadaEm: '28/05/2026', previsao: '11/06/2026',
    pecasIds: ['P9'], criadaPor: 'Conceição Dantas',
    pagamento: { aluguel: 35, caucao: 50, em: '28/05/2026', por: 'Raimundo Filho' },
  },
  {
    id: 'LOC-187', locatarioId: 'L4', estado: 'atrasada',
    criadaEm: '15/05/2026', previsao: '05/06/2026',
    pecasIds: ['P3'], criadaPor: 'Conceição Dantas',
    pagamento: { aluguel: 35, caucao: 50, em: '15/05/2026', por: 'Raimundo Filho' },
    diasAtraso: 5,
  },
];

// Devoluções aguardando decisão de caução (admin)
const DEVOLUCOES = [
  {
    id: 'DEV-061', locacaoId: 'LOC-176', locatarioId: 'L2',
    conferidaPor: 'Conceição Dantas', conferidaEm: '09/06/2026',
    caucao: 50,
    itens: [
      { pecaId: 'P5', avaliacao: 'ok', obs: '' },
      { pecaId: 'P10', avaliacao: 'ok', obs: '' },
    ],
  },
  {
    id: 'DEV-060', locacaoId: 'LOC-169', locatarioId: 'L1',
    conferidaPor: 'Conceição Dantas', conferidaEm: '08/06/2026',
    caucao: 50,
    itens: [
      { pecaId: 'P1', avaliacao: 'danificada', obs: 'Bainha descosturada e mancha na lateral.' },
    ],
  },
];

// Receita mensal (apenas aluguel — caução nunca entra)
const RECEITA_MESES = [
  { mes: 'Jan', valor: 980 }, { mes: 'Fev', valor: 1120 }, { mes: 'Mar', valor: 1435 },
  { mes: 'Abr', valor: 1260 }, { mes: 'Mai', valor: 1680 }, { mes: 'Jun', valor: 1015 },
];

const find = (arr, id) => arr.find(x => x.id === id);
const locatario = (id) => find(LOCATARIOS, id);
const peca = (id) => find(PECAS, id);

const METRICAS = {
  receitaMes: RECEITA_MESES[RECEITA_MESES.length - 1].valor,
  pecasFora: PECAS.filter(p => p.estado === 'em_uso').length,
  locacoesAtivas: LOCACOES.filter(l => l.estado === 'em_uso' || l.estado === 'atrasada').length,
  atrasadasHoje: LOCACOES.filter(l => l.estado === 'atrasada').length,
};

Object.assign(window, {
  VALOR_ALUGUEL, VALOR_CAUCAO, USERS, LOCATARIOS, PECAS, LOCACOES, DEVOLUCOES,
  RECEITA_MESES, METRICAS, find, locatario, peca,
});
