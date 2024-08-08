const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Comando apenas para desenvolvimento. Apenas usuarios autorizados podem utilizar este comando')
        .addStringOption(option =>
            option.setName('expression')
            .setDescription('Expressão para avaliar')
            .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.user.id !== "411152912379805699") {
            return interaction.reply(`Usuário ${interaction.user.tag} não autorizado!`);
        }

        const clean = async (client, text) => {
            if (text && text.constructor.name == "Promise") {
                text = await text;
            }

            if (typeof text !== "string") {
                text = require("util").inspect(text, { depth: 1 });
            }

            text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)).replaceAll(client.token, "[PRIVADO]");
            
            return text;
        }

        const args = interaction.options.getString('expression', true);

        try {
            const evaled = eval(args);

            const cleaned = await clean(interaction.client, evaled);

            return interaction.reply(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (error) {
            return interaction.reply(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
        }
    }
}