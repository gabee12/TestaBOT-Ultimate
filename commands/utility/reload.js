const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Recarrega um comando (APENAS PARA TESTES)')
        .addStringOption(option =>
            option.setName('comando')
                .setDescription('Comando a ser recarregado')
                .setRequired(true)
        ),
    async execute(interaction) {

        if (interaction.user.id != 411152912379805699) {
            return interaction.reply(`Você não possui permissão para executar este comando!`);
        }

        const commandName = interaction.options.getString('comando', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`Nenhum comando com o nome \`${commandName}\`!`);
        }

        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
            const newCommand = require(`./${command.data.name}.js`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Comando \`${newCommand.data.name}\` recarregado!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`Houve um error ao tentar recarregar o comando \`${command.data.name}\`:\n\`${error.message}\``);
        }
    },
};