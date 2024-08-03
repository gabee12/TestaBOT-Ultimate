const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Randomiza a ordem das músicas na fila'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        
        if (voiceChannel == null) {
            return interaction.reply('É preciso estar em um canal de voz para usar esse comando');
        }

        if (interaction.client.size <= 1) {
            return interaction.reply('Não há músicas suficientes na fila');
        }

        const queue = [];
        for (const song of interaction.client.queue) {
            queue.push(song);
        }

        for (const i = 0; i <= queue.length - 2; i++) {
            const j = getRandomInt(i, queue.length);
            const temp = queue[i];
            queue[i] = queue[j];
            queue[j] = temp;
        }

        return interaction.reply('A fila foi randomizada com sucesso');
    }

}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}