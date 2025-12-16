const { EmbedBuilder, PermissionsBitField } = require("discord.js");
// Se quiser garantir que o caminho funcione sempre, pode usar o 'path' (opcional, mas recomendado)
const path = require("path");
const caminho = path.join(process.cwd(), "image.gif");

const CONFIG = {
  cor: "#2F3136",
  // Caminho do arquivo no seu PC
  caminhoImagem: caminho,
  // Nome exato do arquivo para o Discord reconhecer
  nomeArquivo: "image.gif",
  canalRegras: "1450186826412331210",
  canalChat: "1442508536520376537",
};

module.exports = {
  name: "bemvindo",
  description: "Testa o sistema de boas-vindas (Apenas Admins)",
  aliases: ["bv", "testarboasvindas"],

  execute: async (client, message, args) => {
    console.log("--- TENTATIVA DE COMANDO BEM-VINDO ---");

    if (!message.guild) return;
    if (!message.member) return;

    // VERIFICAÇÃO DE PERMISSÃO
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      console.log(`❌ Cancelado: Sem permissão.`);
      return;
    }

    try {
      console.log("✅ Passou nas verificações. Gerando Embed...");

      const embed = new EmbedBuilder()
        .setColor(CONFIG.cor)
        .setTitle(`🚀 Bem-vindo(a) à ${message.guild.name}!`)
        .setDescription(
          `Olá **${message.author}**, é uma honra ter você aqui!\nAgora fazemos parte da mesma equipe.`
        )
        .setThumbnail(
          message.author.displayAvatarURL({ dynamic: true, size: 512 }) || null
        )
        .addFields(
          {
            name: "📜 Primeiros Passos",
            value: `> Leia as <#${CONFIG.canalRegras}> para evitar punições.\n> Respeite todos os membros da staff.`,
            inline: false,
          },
          {
            name: "💬 Interaja",
            value: `> Apresente-se no canal <#${CONFIG.canalChat}>.\n> Entre nas calls para conversar!`,
            inline: false,
          },
          {
            name: "📅 Informações da Conta",
            value: `**Criada:** <t:${parseInt(
              message.author.createdTimestamp / 1000
            )}:R>\n**Entrou:** <t:${parseInt(
              message.member.joinedTimestamp / 1000
            )}:R>`,
            inline: false,
          }
        )
        // MUDANÇA 1: Usamos attachment:// + o nome do arquivo
        .setImage(`attachment://${CONFIG.nomeArquivo}`)
        .setFooter({
          text: `ID do Usuário: ${message.author.id} • Membro nº ${message.guild.memberCount}`,
          iconURL: message.guild.iconURL(),
        })
        .setTimestamp();

      await message.reply({
        content: `||${message.author}|| (Modo Teste)`,
        embeds: [embed],
        // MUDANÇA 2: Enviamos o arquivo fisicamente junto com a mensagem
        files: [
          {
            attachment: CONFIG.caminhoImagem,
            name: CONFIG.nomeArquivo,
          },
        ],
      });

      console.log("✅ Sucesso: Mensagem enviada!");
    } catch (err) {
      console.error("❌ Erro ao tentar enviar:", err);
    }
  },
};
