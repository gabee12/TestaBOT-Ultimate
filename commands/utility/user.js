const { SlashCommandBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Informação sobre o usuário'),
    async execute(interaction) {

        const timeString = time(interaction.member.joinedAt);
        const relative = time(interaction.member.joinedAt, TimestampStyles.RelativeTime);
        await interaction.reply(`Comando enviado por: ${interaction.user.username}\nData de entrada no servidor: ${timeString} (${relative}).`);
    },
};