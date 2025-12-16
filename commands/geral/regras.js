const {
  EmbedBuilder,
  PermissionFlagsBit,
  AttachmentBuilder,
} = require("discord.js");
const path = require('path');

module.exports = {
  name: "regras",
  description: "Envia o painel de regras do servidor manualmente",
  type: "CHAT_INPUT",

  // O código abaixo assume que seu handler passa (client, message, args)
  // Se for Slash Command, seria (client, interaction)
  execute: async (client, message, args) => {
    // 1. Verificação de Segurança (Apenas Admins podem rodar esse comando)
    //if (!message.member.permissions.has(PermissionFlagsBit.Administrator)) {
    //  return message.reply("❌ Você não tem permissão para postar as regras.");
    //}

    // 2. Apagar a mensagem do comando para o chat ficar limpo
    // (Envolvemos em try/catch caso o bot não tenha permissão de gerenciar mensagens)
    try {
      await message.delete();
    } catch (e) {
      console.log("Erro ao apagar mensagem: ", e);
    }

    const caminho = path.join(__dirname, '../../images/standard.gif');
    const arquivo = new AttachmentBuilder(caminho, { name: 'standard.gif' });

    // 3. Construção do Embed
    const embedRegras = new EmbedBuilder()
      .setColor("#2B2D31") // Uma cor escura e moderna (estilo VS Code/Discord)
      .setTitle("🛡️ Regras da InfinityStudios | Equipe")
      .setDescription(
        `Seja bem-vindo ao hub de desenvolvimento **InfinityStudios**! \nPara mantermos um ambiente produtivo para criadores de Bots, Apps e Games, siga as diretrizes abaixo:`
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true }) || null) // Pega o ícone do servidor
      .addFields(
        {
          name: "🤝 1. Conduta e Respeito",
          value:
            "Mantenha o profissionalismo. Discursos de ódio, assédio ou toxicidade não serão tolerados. Críticas construtivas aos projetos alheios são bem-vindas; ataques pessoais, não.",
        },
        {
          name: "📢 2. Divulgação e Spam",
          value:
            "A auto-divulgação de seus projetos (Bots/Games) é permitida **apenas nos canais designados** (ex: `#projetos`). Proibido enviar convites de outros servidores ou links suspeitos na DM dos membros.",
        },
        {
          name: "💻 3. Código e Segurança (Importante)",
          value:
            "• Proibido compartilhar **malware**, **token grabbers** ou scripts maliciosos.\n• Não peça nem compartilhe dados sensíveis (senhas, tokens de bots, API keys) nos chats públicos.",
        },
        {
          name: "⚖️ 4. Direitos Autorais e Plágio",
          value:
            "Respeite a propriedade intelectual. Não poste códigos vazados (leaks) ou assuma autoria de projetos que não são seus. Dê os créditos devidos.",
        },
        {
          name: "📂 5. Organização",
          value:
            "Utilize os canais corretos para cada assunto. Dúvidas de código em `#suporte-dev`, conversas aleatórias em `#geral`.",
        }
      )
      .setImage("attachment://standard.gif") // DICA: Coloque aqui um banner legal do seu servidor ou remova essa linha
      .setFooter({
        text: `InfinityStudios © ${new Date().getFullYear()} • O descumprimento pode resultar em Ban.`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    // 4. Enviar o Embed
    await message.channel.send({ embeds: [embedRegras], files: [arquivo] });
  },
};
