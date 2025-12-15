module.exports = {
  name: "verificar",
  description: "Sistema de verificação anti-robô (Captcha Matemático)",
  async execute(message, args) {
    // 1. Verifica se o usuário já tem o cargo
    // Mude "Verificado" para o nome exato do cargo no seu servidor
    const roleName = "Verificado";
    const role = message.guild.roles.cache.find((r) => r.name === roleName);

    if (!role) {
      return message.reply(
        `❌ Erro: Não encontrei o cargo **${roleName}**. Peça ao admin para criar.`
      );
    }

    if (message.member.roles.cache.has(role.id)) {
      return message.reply("✅ Você já está verificado!");
    }

    // 2. Gera o Captcha (Números aleatórios)
    const num1 = Math.floor(Math.random() * 10) + 1; // 1 a 10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1 a 10
    const resultadoCorreto = num1 + num2;

    // 3. Envia a pergunta
    await message.reply(
      `🤖 **Verificação de Segurança**\nPara provar que você não é um robô, responda: **Quanto é ${num1} + ${num2}?**\nVocê tem 15 segundos.`
    );

    // 4. Cria um coletor para esperar a resposta do usuário
    const filter = (response) => {
      // Só aceita mensagem do mesmo usuário que usou o comando
      return response.author.id === message.author.id;
    };

    try {
      // Espera 1 resposta, por no máximo 15 segundos (15000ms)
      const collected = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 15000,
        errors: ["time"],
      });

      const respostaDoUsuario = collected.first().content;

      // 5. Validação
      if (parseInt(respostaDoUsuario) === resultadoCorreto) {
        // Acertou! Dá o cargo
        await message.member.roles.add(role);
        message.reply(
          "✅ **Correto!** Você foi verificado e agora tem acesso ao servidor."
        );
      } else {
        // Errou
        message.reply(
          "❌ **Resposta errada!** Tente novamente usando `!verificar`."
        );
      }
    } catch (e) {
      // O tempo acabou
      message.reply(
        "⏰ **Tempo esgotado!** Tente novamente usando `!verificar`."
      );
    }
  },
};
