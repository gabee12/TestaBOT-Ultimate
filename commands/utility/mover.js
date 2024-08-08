const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('mover')
		.setDescription('altera a ordem das músicas na fila')
        .addIntegerOption(option =>
            option.setName('num1')
            .setDescription('Número da música a ser movida na fila')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('num2')
            .setDescription('Número para qual a música vai ser movida')
            .setRequired(true)
        ),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
			return interaction.reply('É preciso estar em um canal de voz!');
		}
        
        let num1 = interaction.options.getInteger('num1', true);
        let num2 = interaction.options.getInteger('num2', true);
        const size = interaction.client.queue.size;
        let queueArray = [];
        for (const song of interaction.client.queue) {
            queueArray.push(song);
        }
        if (size == 0) {
            return interaction.reply('Não há músicas na fila');
        }

        if (num1 <= 0 || num1 > size) {
            return interaction.reply(`O número inserido (${num1}) esta fora do alcance da fila atual (1 até ${size})`);
        }
        if (num2 <= 0) {
            return interaction.reply(`O número inserido (${num2}) é invalido ( < que 0 )`);
        }
        if (num2 == num1) {
            return interaction.reply('Os dois números inseridos são iguais! Não é preciso fazer nenhuma alteração na fila!');
        }

        num1--;
        num2--;
        try {
            if (num2 >= size) {
                const removedSong = queueArray.splice(num1, 1);
                queueArray.push(removedSong);
                interaction.client.queue.clear();
                for (const song of queueArray) {
                    interaction.client.queue.enqueue(song)
                }
                return interaction.reply(`Música número ${num1 + 1} movida para o final da fila`);
            } else {
                const removedSong = queueArray.splice(num1, 1);
                const remaining = queueArray.splice(num2);
                queueArray = queueArray.concat(removedSong).concat(remaining);
                interaction.client.queue.clear();
                for (const song of queueArray) {
                    interaction.client.queue.enqueue(song)
                }
                return interaction.reply(`Música número ${num1 + 1} movida para a posição ${num2}.`);
            }
        } catch (error) {
            console.error(error);
            return interaction.reply(`Ocorreu um erro ao tentar mover a música: ${error}`);
        }
    }     
}