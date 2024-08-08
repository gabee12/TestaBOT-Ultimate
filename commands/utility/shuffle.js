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

        if (interaction.client.queue.size <= 1) {
            return interaction.reply('Não há músicas suficientes na fila');
        }

        let queue = [];
        for (const song of interaction.client.queue) {
            queue.push(song);
        }

        await shuffle(queue);
        
        interaction.client.queue.clear();

        for (const song of queue) {
            interaction.client.queue.enqueue(song);
        }

        return interaction.reply('A fila foi randomizada com sucesso');
    }

}

async function shuffle(array) {
	for (let i = array.length - 1; i >= 1; i--) {
		const j = randomInt(0, i + 1);
		[array[j], array[i]] = [array[i], array[j]];
	}
	return array;
}

function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}