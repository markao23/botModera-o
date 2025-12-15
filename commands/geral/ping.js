module.exports = {
  name: "ping", // Nome do comando (o que a pessoa digita)
  description: "Responde com Pong!",
  execute(message, args) {
    // A lógica do comando fica aqui
    message.reply("🏓 Pong! (Lido automaticamente pelo fs)");
  },
};
