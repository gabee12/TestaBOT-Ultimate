const { SlashCommandBuilder } = require('discord.js');
const { audioPlayer } = require('./play.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Despausa a música'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        
        if (voiceChannel == null) {
            return interaction.reply('É preciso estar em um canal de voz para usar esse comando');
        }

        try {
            audioPlayer.unpause();
            interaction.client.isPlaying = true;
            return interaction.reply('Despausado!');
        } catch (error) {
            console.log(error);
            return interaction.reply('Ocorreu um erro ao tentar despausar!')
        }
        
    }     
}