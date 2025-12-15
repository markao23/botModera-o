const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Mostra a lista de comandos e categorias.",
  aliases: ["ajuda", "comandos"],
  execute(message, args) {
    // --- 🎨 CONFIGURAÇÃO VISUAL ---

    // Aqui você coloca os emojis que montou usando o truque acima
    // O nome da chave ('geral', 'verificacao') TEM que ser igual ao nome da pasta
    const emojisCategoria = {
      geral: "😵‍💫", // Exemplo animado
      verificacao: "🛡️", // Pode misturar com emoji normal
      moderacao: "<a:sirene:1234567890123456>", // Exemplo animado
      economia: "💰",
    };

    const corEmbed = 0x5865f2; // Blurple (Cor padrão do Discord)

    // ------------------------------

    const embed = new EmbedBuilder()
      .setTitle("🤖 Painel de Comandos")
      .setDescription(
        `Olá **${message.author.username}**! Abaixo estão meus sistemas.\nUse \`!comando\` para interagir.`
      )
      .setColor(corEmbed)
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true })) // Avatar do bot animado
      .setFooter({
        text: `Pedido por ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // --- 📂 LEITURA AUTOMÁTICA ---

    // Pega o caminho da pasta "commands"
    const commandsPath = path.join(__dirname, "../../commands");
    const commandFolders = fs.readdirSync(commandsPath);

    // Varre cada pasta
    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);

      // Verifica se é pasta mesmo
      if (!fs.lstatSync(folderPath).isDirectory()) continue;

      // Pega os arquivos .js dentro da pasta
      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"));

      // Se a pasta estiver vazia, ignora
      if (!commandFiles.length) continue;

      // Formata o nome da categoria (ex: "geral" vira "Geral")
      const categoryName = folder.charAt(0).toUpperCase() + folder.slice(1);

      // Pega o emoji do nosso dicionário ou usa um padrão
      const emoji = emojisCategoria[folder] || "📁";

      // Lista os comandos bonitinho com crase (`)
      const commandsList = commandFiles
        .map((file) => {
          const cmd = require(path.join(folderPath, file));
          return `\`${cmd.name}\``;
        })
        .join(", ");

      // Adiciona a categoria no Embed
      embed.addFields({
        name: `${emoji} ${categoryName}`,
        value: commandsList,
        inline: false, // Deixe false para uma lista vertical limpa
      });
    }

    // Envia
    message.reply({ embeds: [embed] });
  },
};
