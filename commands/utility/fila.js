const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('fila')
		.setDescription('Mostra a fila de musicas atual'),
    async execute(interaction) {
        await interaction.deferReply();
            
        if (interaction.client.isPlaying && interaction.client.queue.size <= 0) {
            await interaction.editReply('Tocando agora: ');
        }

        const queue = [];
        for (const song of interaction.client.queue) {
            queue.push(song);
        }

        let queueText = queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
        const chunks = [];
		while (queueText.length > 2000) {
			for (let i = 1999; i > 0; i--) {
				if (queueText.charAt(i) == '\n') {
					const newText = queueText.slice(0, i);
					const rest = queueText.slice(i + 1);
					chunks.push(newText);
					queueText = rest;
					break;
				}
			}
		}
        chunks.push(queueText);
		await interaction.editReply(`Tocando agora: \`${interaction.client.currentSong.title}\`\n\nFila atual:\n`);
		chunks.forEach(item => {
			interaction.channel.send(item);
		});
    }
}