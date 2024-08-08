const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Limpa a fila atual, removendo todas as músicas dela e parando o bot.'),
    async execute(interaction) {
            
        if (interaction.client.isPlaying) {
            getVoiceConnection(interaction.guild.id).destroy();
            await interaction.reply('Parando bot!');
        }

        if (interaction.client.queue.size > 0) {
            const size = interaction.client.queue.size;
            interaction.client.queue.clear();
            return interaction.followUp(`Removidas ${size} músicas!`);
        }

        return;
    }
}