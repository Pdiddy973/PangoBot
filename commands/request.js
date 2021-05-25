var nameToImdb = require("name-to-imdb");

module.exports = {
    name: 'request',
    description: 'Adds Shows to Sonarr Queue',
    async execute(client, message, args, Discord) {
        const requestChannel = process.env.REQUEST_CHANNEL
        const requestLog = process.env.REQUEST_LOG_CHANNEL
        const yes = '✅';
        const no = '🚫';
        const imdb_query = args.join(' ')

        //Checks to make sure args are added
        if (!imdb_query) return message.reply("please add a show to the command")

        //Scrapes IMDB for data
        nameToImdb(imdb_query, (err, res, inf) => {
            let id = inf.meta.id
            let media = inf.meta.name
            let year = inf.meta.year
            let type = inf.meta.type
            let image = inf.meta.image.src
            callback(id, media, year, type, image)
        })

        async function callback(id, media, year, type, image) {
            const color = '#00ccff' ? type === 'TV series' : '#ffc231'
            const process_ = 'Sonarr' ? type === 'TV series' : 'Radarr'

            //Confirm Embed
            const confirmEmbed = new Discord.MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Add ${media} - (${year}) to ${process_}`)
                .setURL(`https://www.imdb.com/title/${id}/`)
                .setThumbnail(`${image}`)
                .setDescription(`Make sure this looks correct before confirming with ${yes}\n\n`)

            //Send Confirm Embed and React
            const messageEmbed = await message.channel.send(confirmEmbed);
            messageEmbed.react(yes);
            messageEmbed.react(no);

            //Run Based on Reaction
            client.on('messageReactionAdd', async (reaction, user) => {
                //Checks
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;

                if (reaction.message.channel.id == requestChannel) {
                    if (reaction.emoji.name === yes) {
                        //Sonarr API
                        if (type == 'TV series') {
                            console.log('sent to sonarr')
                        }
                        //Radarr API
                        if (type == 'feature') {
                            console.log('sent to radarr')
                        }
                        //If Request log has a channel ID, send log
                        if (!!requestLog) {
                            //log embed
                            const logEmbed = new Discord.MessageEmbed()
                                .setColor(`${color}`)
                                .setTitle(`Requested ${media} - (${year}) to ${process_}`)
                                .setURL(`https://www.imdb.com/title/${id}/`)
                                .setThumbnail(`${image}`)
                                .setDescription(`${user} has Requested ${media}`)
                            client.channels.cache.get(requestLog).send(logEmbed);
                        }
                        //Remove From Request Channel
                        message.channel.messages.fetch({
                            limit: 2
                        }).then(messages => {
                            message.channel.bulkDelete(messages);
                        });
                    }
                    if (reaction.emoji.name === no) {
                        message.channel.messages.fetch({
                            limit: 2
                        }).then(messages => {
                            message.channel.bulkDelete(messages);
                        });
                    }
                } else {
                    return;
                }
            });
        }
    }
}