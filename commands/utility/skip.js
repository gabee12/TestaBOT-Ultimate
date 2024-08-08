const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { player, audioPlayer } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula algumas músicas')
        .addIntegerOption(option =>
            option.setName('num')
            .setDescription('Quantas músicas pular?')
        ),
    async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;
        
        if (voiceChannel == null) {
            return interaction.reply('É preciso estar em um canal de voz para usar esse comando');
        }

        let num = interaction.options.getInteger('num', false);
        const currentSong = interaction.client.currentSong;
        const isPlaying = interaction.client.isPlaying;
        const queueSize = interaction.client.queue.size;

        if (!isPlaying && currentSong == null && queueSize <= 0) {
            return interaction.reply('Nenhuma música tocando no momento');
        }

        if (!isPlaying && currentSong != null && queueSize <= 0) {
            return interaction.reply('A fila está vazia!');
        }

        if (!isPlaying && currentSong != null && queueSize > 0) {
            if (num == null || num <= 1) {
                player(interaction.client, interaction.channel);
                return interaction.reply('Música pulada!');
            }
            else {
                num = num - 1
                if (queueSize < num) {
                    audioPlayer.stop();
                    interaction.client.isPlaying = false;
                    interaction.client.currentSong = null;
                    getVoiceConnection(interaction.guild.id).destroy();
                    interaction.client.connection = null;
                    return interaction.reply('O número inserido é maior que o tamanho atual da fila! Pulando todas as músicas...');
                }
                for (const i = 0; i < num; i++) {
                    interaction.client.queue.dequeue();
                    player(interaction.client, interaction.channel);
                    return interaction.reply('Música pulada!');
                }
                return interaction.reply(`${num + 1} músicas puladas!`);
            }
        }

        if (isPlaying && queueSize > 0) {
            if (num == null || num <= 1) {
                player(interaction.client, interaction.channel);
                return interaction.reply('Música pulada!');
            }
            else {
                num = num - 1
                if (queueSize < num) {
                    audioPlayer.stop();
                    interaction.client.isPlaying = false;
                    interaction.client.currentSong = null;
                    getVoiceConnection(interaction.guild.id).destroy();
                    interaction.client.connection = null;
                    interaction.player = null;
                    return interaction.reply('O número inserido é maior que o tamanho atual da fila! Pulando todas as músicas...');
                }
                for (const i = 0; i < num; i++) {
                    interaction.client.queue.dequeue();
                    player(interaction.client, interaction.channel);
                    return interaction.reply('Música pulada!');
                }
                return interaction.reply(`${num + 1} músicas puladas!`);
            }
        } else if (isPlaying) {
            audioPlayer.stop();
            interaction.client.isPlaying = false;
            interaction.client.currentSong = null;
            getVoiceConnection(interaction.guild.id).destroy();
            interaction.client.connection = null;
            interaction.player = null;
            return interaction.reply('Parando de tocar...');
        }
    }
}