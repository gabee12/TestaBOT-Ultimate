const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');
const ytpl = require('@distube/ytpl');
const ytsr = require('@distube/ytsr');

const audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: "pause" } });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Adiciona uma música a fila')
        .addStringOption(option =>
            option.setName('musica')
                .setDescription('Música a ser adicionada a fila ou URL de uma playlist do youtube')
                .setRequired(true)
        ),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        
        if (voiceChannel == null) {
            return interaction.reply('É preciso estar em um canal de voz para usar esse comando');
        }

        const link = interaction.options.getString('musica', true);
        const regex = /https:\/\/www\.youtube\.com\/shorts\/|www\.youtube\.com\/shorts\/|youtube\.com\/shorts\//;
        if (regex.test(link)) {
            link = link.replace(regex, "https://www.youtube.com/watch?v=");
        }


        try {
            if (ytpl.validateID(link)) {
                const playlistId = await ytpl.getPlaylistID(link);
                const playlist = await ytpl(playlistId);
    
                for (const song of playlist.items) {
                    const queueItem = {
                        url: song.url,
                        title: song.title
                    }
                    interaction.client.queue.enqueue(queueItem);
                }
    
                await interaction.reply(`${playlist.total_items} músicas adicionadas a fila!`);
            } 
            else if (validateURL(link)) {
                const videoInfo = await ytdl.getBasicInfo(link);
                const song = {
                    url: link,
                    title: videoInfo.videoDetails.title,
                };
                interaction.client.queue.enqueue(song);
                await interaction.reply(`\`${song.title}\` adicionado a fila!`);
            }
            else {
                const result = await ytsr(link, { limit: 1 });
                if (!result || result.items.length === 0) {
					return interaction.editReply('Nenhum resultado encontrado para essa pesquisa');
				}
                const song = {
                    url: result.items[0].url,
                    title: result.items[0].name,
                };
                interaction.client.queue.enqueue(song);
                await interaction.reply(`\`${song.title}\` adicionado a fila!`);
            }
        } catch (error) {
            console.error(error);
            return interaction.reply(`Houve um erro ao processar o pedido. ${error.message}`);
        }

        try {
            if (!interaction.client.isPlaying) {
                if (interaction.client.timeoutId != null) {
                    clearTimeout(interaction.client.timeoutId);
                }

                const connection = joinVoiceChannel({
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                });
                interaction.client.guildId = interaction.guild.id;
                interaction.client.connection = connection;
                await player(interaction.client, interaction.channel);
                interaction.client.isPlaying = true;
            }
        } catch (error) {
            interaction.client.queue.clear();
            await interaction.followUp('Houve um erro ao tentar conectar com o canal de voz');
            console.error(error);
        }
    },
    player,
    audioPlayer
}

async function player(client, channel) {
    if (client.queue.size <= 0 && client.guildId != null) {
        client.isPlaying = false;
        client.timeoutId = setTimeout(() => {
            audioPlayer.stop;
            getVoiceConnection(client.guildId).destroy();
            interaction.client.currentSong = null;
            client.connection = null;
            client.isPlaying = false;
        }, 15 * 60 * 1000);
        return;
    }

    const nextSong = client.queue.dequeue();

    try {
        client.connection.subscribe(audioPlayer);
        client.player = audioPlayer;
        const stream = await ytdl(nextSong.url, { highWaterMark: 1 << 62, liveBuffer: 1 << 62 });
        
        const resource = createAudioResource(stream, { inputType: StreamType.Opus});

        resource.playStream.on('end', async () => {
            player(client, channel);
        });

        resource.playStream.on('error', (error) => {
            console.error('Audio Stream Error:', error);
            channel.send('Ocorreu um erro ao tocar esse audio. Pulando...');
            player(client, channel);
        });

        audioPlayer.play(resource);
        client.currentSong = nextSong;
        channel.send(`Tocando: ${nextSong.title} (${nextSong.url})`);
    }
    catch (error) {
        console.error(error);
        client.isPlaying = false;
        client.queue.clear();
        return;
    }
}

function getURLVideoID(link) {
    const PARSED = new URL(link.trim());
    let id = PARSED.searchParams.get('v');
    if (VALID_PATH_DOMAINS.test(link.trim()) && !id) {
        const PATHS = PARSED.pathname.split('/');
        id = PARSED.host === 'youtu.be' ? PATHS[1] : PATHS[2];
    }
    else if (PARSED.hostname && !VALID_QUERY_DOMAINS.has(PARSED.hostname)) {
        throw new Error('Not a YouTube domain');
    }
    if (!id) {
        throw new Error(`No video id found: "${link}"`);
    }
    id = id.substring(0, 11);
    if (!this.validateID(id)) {
        throw new TypeError(`Video id (${id}) does not match expected format (${ID_REGEX.toString()})`);
    }
    return id;
}

function validateURL(url) {
    try {
        this.getURLVideoID(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
