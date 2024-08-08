const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { audioPlayer } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Para o bot'),
    async execute(interaction) {
        audioPlayer.stop();
        interaction.client.isPlaying = false;
        interaction.client.currentSong = null;
        getVoiceConnection(interaction.guild.id).destroy();
        interaction.client.connection = null;
        interaction.player = null;
        return interaction.reply('Parando...');
    }     
}