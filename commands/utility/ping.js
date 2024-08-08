const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Realiza uma checagem do ping do bot'),
    async execute(interaction) {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`\`Client: ${ping} ms\`\n\`Websocket: ${interaction.client.ws.ping} ms\``)
    }     
}