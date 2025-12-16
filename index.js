// 1. Importar as ferramentas necessárias
require("dotenv").config();
const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const path = require("path");
const fs = require("fs");

// 2. Configurar o Cliente
const client = new Client({
  intents: [
    // 1. Permite o bot ver que o servidor existe (CORRIGE SEU ERRO ATUAL)
    GatewayIntentBits.Guilds,

    // 2. Permite o bot ler as mensagens
    GatewayIntentBits.GuildMessages,

    // 3. Permite o bot ler o CONTEÚDO (!comando)
    GatewayIntentBits.MessageContent,

    // 4. Permite o bot ver quem entra (PARA O BOAS-VINDAS FUNCIONAR)
    GatewayIntentBits.GuildMembers, // ADICIONEI ISSO: Necessário para dar cargos (roles)
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

// 2.1 Leitura das SUBPASTAS (Ex: verificacao, geral)
// Lê tudo que tem na pasta commands
const commandFolders = fs.readdirSync(commandsPath);

console.log(`📂 Lendo pastas de comandos...`);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  if (fs.lstatSync(folderPath).isDirectory()) {
    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if ("name" in command && "execute" in command) {
        client.commands.set(command.name, command);
        console.log(`  ✅ Comando carregado: ${command.name} (em ${folder})`);
      } else {
        console.log(`  ⚠️ Aviso: ${file} está faltando "name" ou "execute".`);
      }
    }
  }
}

// 3. Evento: Bot Online
client.once(Events.ClientReady, (c) => {
  console.log(`🤖 Bot online! Logado como: ${c.user.tag}`);
});

// No topo do index.js certifique-se de importar EmbedBuilder
// const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const CANAL_BOAS_VINDAS_ID = "1388136541532065822"; 

client.on('guildMemberAdd', async (member) => {
    // Busca o canal
    const canal = member.guild.channels.cache.get(CANAL_BOAS_VINDAS_ID);
    if (!canal) return;

    // Recria o mesmo design bonito (Consistência)
    const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`🚀 Bem-vindo(a) à ${member.guild.name}!`)
        .setDescription(`Olá **${member.user}**, é uma honra ter você aqui!\nAgora fazemos parte da mesma equipe.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .addFields(
            { 
                name: '📜 Primeiros Passos', 
                value: `> Leia as regras para evitar punições.\n> Respeite todos os membros da staff.`, 
                inline: false 
            },
            { 
                name: '💬 Interaja', 
                value: `> Apresente-se no chat geral.\n> Entre nas calls para conversar!`, 
                inline: false 
            },
            { 
                name: '📊 Estatísticas', 
                value: `Você é o membro número **${member.guild.memberCount}**!`, 
                inline: false 
            }
        )
        .setImage('https://i.imgur.com/mWyvD8B.png') // Mesmo link do banner
        .setFooter({ 
            text: `ID: ${member.id}`, 
            iconURL: member.guild.iconURL() 
        })
        .setTimestamp();

    // Envia no canal
    await canal.send({ content: `Olá ${member}, olhe aqui!`, embeds: [embed] });
});

// 4. Evento: Mensagem
client.on(Events.MessageCreate, (message) => {
  if (message.author.bot || !message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply("Houve um erro ao tentar executar esse comando!");
  }
});

// 5. Login
client.login(process.env.DISCORD_TOKEN);
