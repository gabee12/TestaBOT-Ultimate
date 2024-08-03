const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Nenhum comando com o nome ${interaction.commandName} foi encontrado`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Houve um erro ao tentar executar esse comando, tente novamente', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Houve um erro ao tentar executar esse comando, tente novamente', ephemeral: true });
            }
        }
    },
};