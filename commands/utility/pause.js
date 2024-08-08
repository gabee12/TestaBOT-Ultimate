const { SlashCommandBuilder } = require('discord.js');
const { audioPlayer } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pausa a música'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        
        if (voiceChannel == null) {
            return interaction.reply('É preciso estar em um canal de voz para usar esse comando');
        }

        try {
            audioPlayer.pause(true);
            interaction.client.isPlaying = false;
            return interaction.reply('Pausado!');
        } catch (error) {
            console.log(error);
            return interaction.reply('Ocorreu um erro ao tentar pausar!')
        }

    }     
}