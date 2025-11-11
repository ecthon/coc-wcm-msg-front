'use client';
import { api } from "@/api/api";
import React from "react";

interface PlayerData {
  name: string;
  tag: string;
  townHallLevel: number;
  expLevel: number;
  warStars: number;
  clan?: {
    name: string;
  };
  heroes?: Array<{
    name: string;
    level: number;
    maxLevel: number;
  }>;
}

export default function Home() {
  const [playerData, setPlayerData] = React.useState<PlayerData | null>(null);
  const [playerId, setPlayerId] = React.useState('');
  const [welcomeMessage, setWelcomeMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  function generateWelcomeMessage(data: PlayerData): string {
    const name = data.name || 'Jogador';
    const thLevel = data.townHallLevel || 0;
    const expLevel = data.expLevel || 0;
    const warStars = data.warStars || 0;
    const clanName = data.clan?.name || 'Insanos';

    // Obter níveis dos heróis
    const heroes = data.heroes || [];
    const king = heroes.find(h => h.name === 'Barbarian King')?.level || 0;
    const queen = heroes.find(h => h.name === 'Archer Queen')?.level || 0;
    const warden = heroes.find(h => h.name === 'Grand Warden')?.level || 0;
    const champion = heroes.find(h => h.name === 'Royal Champion')?.level || 0;
    const prince = heroes.find(h => h.name === 'Minion Prince')?.level || 0;

    const kingMax = king >= 95;
    const queenMax = queen >= 95;
    const wardenMax = warden >= 70;
    const championMax = champion >= 45;

    // Gerar mensagem
    let message = `🎉 E AÍ, GALERA! Chegou reforço!\n\n`;
    message += `Recebam @${name} no clã ${clanName}! 🔥\n\n`;
    message += `📊 PERFIL DO GUERREIRO:\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `🏰 Vila: CV${thLevel}\n`;
    message += `⭐ Level: ${expLevel}\n`;

    if (king > 0) message += `👑 Rei Bárbaro: ${king}${kingMax ? ' (MAX)' : ''}\n`;
    if (queen > 0) message += `🏹 Rainha Arqueira: ${queen}${queenMax ? ' (MAX)' : ''}\n`;
    if (warden > 0) message += `🧙 Grande Guardião: ${warden}${wardenMax ? ' (MAX)' : ''}\n`;
    if (champion > 0) message += `⚔️ Campeã Real: ${champion}${championMax ? ' (MAX)' : ''}\n`;
    if (prince > 0) message += `👿 Príncipe Lacaio: ${prince}\n`;

    message += `⚔️ Estrelas de Guerra: ${warStars}\n`;
    message += `━━━━━━━━━━━━━━━━\n\n`;

    if (warStars >= 1000) {
      message += `🔥 VETERANO DE GUERRA! Esse aqui já viu muita batalha!\n\n`;
    } else if (warStars >= 500) {
      message += `💪 Experiência de guerra não falta! Vai somar demais!\n\n`;
    } else if (warStars >= 100) {
      message += `⚡ Já tem bagagem! Vem com tudo!\n\n`;
    } else {
      message += `🌟 Preparado pra fazer história! Vamos nessa!\n\n`;
    }

    message += `📜 REGRAS DE OURO:\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `🎯 Curta a enquete = Tá na guerra\n`;
    message += `💚 Liga = Todos os heróis UP\n`;
    message += `🤝 Doe sempre que possível\n`;
    message += `👥 Traga os parças!\n`;
    message += `📋 Regras completas na descrição\n\n`;
    message += `BORA DOMINAR! 💀👊`;

    return message;
  }

  async function fetchData(id: string) {
    if (!id) {
      console.error("Player ID is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/players/${id}`);
      setPlayerData(response.data);
      const message = generateWelcomeMessage(response.data);
      setWelcomeMessage(message);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Erro ao buscar dados do jogador. Verifique a tag e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(playerId);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Erro ao copiar mensagem");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            ⚔️ Gerador de Boas-Vindas
          </h1>
          <p className="text-gray-600 mb-8">
            Clash of Clans - Clã Insanos
          </p>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                name="id"
                id="id"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Digite a tag do jogador (ex: #289C0P8Q8)"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !playerId}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? '⏳ Buscando...' : '🎯 Gerar'}
              </button>
            </div>
          </form>

          {welcomeMessage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Mensagem Gerada:
                </h2>
                <button
                  onClick={handleCopy}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${copied
                      ? 'bg-green-500 text-white'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                    }`}
                >
                  {copied ? '✅ Copiado!' : '📋 Copiar Mensagem'}
                </button>
              </div>

              <div className="bg-gray-50 border-2 border-purple-300 rounded-lg p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                  {welcomeMessage}
                </pre>
              </div>

              {playerData && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    📌 Dados do Jogador:
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Nome:</span> {playerData.name}
                    </div>
                    <div>
                      <span className="font-medium">Tag:</span> {playerData.tag}
                    </div>
                    <div>
                      <span className="font-medium">CV:</span> {playerData.townHallLevel}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span> {playerData.expLevel}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}