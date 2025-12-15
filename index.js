// 1. Importar as ferramentas necessárias
require("dotenv").config();
const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const path = require("path");
const fs = require("fs");

// 2. Configurar o Cliente
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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

// 4. Evento: Mensagem
client.on(Events.MessageCreate, (message) => {
  if (message.author.bot || !message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("Houve um erro ao tentar executar esse comando!");
  }
});

// 5. Login
client.login(process.env.DISCORD_TOKEN);
