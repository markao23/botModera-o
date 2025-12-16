const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "verificar",
  description: "Sistema de verificação anti-robô (Captcha Matemático)",
  type: "CHAT_INPUT",

  run: async (client, message, args) => {
    // --- CONFIGURAÇÃO ---
    const roleName = "Verificado"; // O nome EXATO do cargo no seu Discord
    // --------------------

    // 1. Verifica se o cargo existe
    const role = message.guild.roles.cache.find((r) => r.name === roleName);
    if (!role) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription(
          `⚠️ **Erro de Configuração:** O cargo **"${roleName}"** não foi encontrado. Contate um administrador.`
        );
      return message.reply({ embeds: [errorEmbed] });
    }

    // 2. Verifica se o usuário já tem o cargo
    if (message.member.roles.cache.has(role.id)) {
      const jaVerificado = new EmbedBuilder()
        .setColor("#2B2D31")
        .setDescription(
          "✅ Você já está verificado e possui acesso ao servidor."
        );
      return message.reply({ embeds: [jaVerificado], ephemeral: true });
    }

    // 3. Gera o Captcha
    const num1 = Math.floor(Math.random() * 20) + 1; // Aumentei um pouco a dificuldade (1 a 20)
    const num2 = Math.floor(Math.random() * 20) + 1;
    const resultadoCorreto = num1 + num2;

    // 4. Cria o Embed de Pergunta
    const embedPergunta = new EmbedBuilder()
      .setColor("#5865F2") // Cor "Blurple" do Discord
      .setTitle("🛡️ Verificação de Segurança")
      .setDescription(
        `Olá, **${message.author.username}**!\nPara garantir a segurança da **InfinityStudios**, responda ao desafio abaixo para liberar seu acesso.`
      )
      .addFields({
        name: "🧩 Desafio Matemático",
        value: `Quanto é **${num1} + ${num2}**?`,
        inline: false,
      })
      .setFooter({ text: "Você tem 30 segundos para responder no chat." })
      .setThumbnail(message.guild.iconURL({ dynamic: true }));

    // Envia a pergunta e guarda a referência da mensagem para editar depois se quiser
    const msgPergunta = await message.reply({ embeds: [embedPergunta] });

    // 5. Coletor de Resposta
    const filter = (m) => m.author.id === message.author.id;

    try {
      const collected = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 30000, // Aumentei para 30 segundos
        errors: ["time"],
      });

      const msgResposta = collected.first();
      const respostaUsuario = parseInt(msgResposta.content);

      // Tenta apagar a mensagem do usuário para limpar o chat (opcional)
      try {
        await msgResposta.delete();
      } catch (e) {}

      // 6. Validação
      if (respostaUsuario === resultadoCorreto) {
        // --- ACERTOU ---
        await message.member.roles.add(role);

        const embedSucesso = new EmbedBuilder()
          .setColor("#00FF7F") // Spring Green
          .setTitle("✅ Acesso Liberado")
          .setDescription(
            `Parabéns! Resposta correta.\nO cargo **@${roleName}** foi adicionado ao seu perfil.`
          )
          .setFooter({ text: "Bem-vindo à equipe!" });

        // Edita a mensagem original ou envia uma nova
        await msgPergunta.edit({ embeds: [embedSucesso] }); // Edita a pergunta para virar sucesso
      } else {
        // --- ERROU ---
        const embedErro = new EmbedBuilder()
          .setColor("#FF4500") // Orange Red
          .setTitle("❌ Acesso Negado")
          .setDescription(
            `Sua resposta (**${msgResposta.content}**) está incorreta.\nO resultado era **${resultadoCorreto}**.\n\nTente usar o comando novamente.`
          )
          .setFooter({ text: "Verificação falhou." });

        await msgPergunta.edit({ embeds: [embedErro] });
      }
    } catch (e) {
      // --- TEMPO ESGOTADO ---
      const embedTimeout = new EmbedBuilder()
        .setColor("#808080") // Grey
        .setTitle("⏰ Tempo Esgotado")
        .setDescription(
          "Você demorou muito para responder.\nPor favor, execute o comando novamente quando estiver pronto."
        );

      // Se a mensagem original ainda existir, edita ela
      if (msgPergunta.editable) {
        await msgPergunta.edit({ embeds: [embedTimeout] });
      }
    }
  },
};
