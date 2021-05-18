var nameToImdb = require("name-to-imdb");

module.exports = {
    name: 'request',
    description: 'Adds Shows to Sonarr Queue',
    async execute(client, message, args, Discord) {
        const channel = process.env.REQUEST_CHANNEL;
        const requestLog = process.env.REQUEST_LOG_CHANNEL
        const yes = '✅';
        const no = '🚫';
        const imdb_query = args.join(' ')

        //Checks to make sure args are added
        if (!imdb_query) return message.reply("please add a show to the command")

        //Scrapes IMDB for data
        nameToImdb(`${imdb_query}`, function (err, res, inf) {
            id = inf.meta.id
            names = inf.meta.name
            year = inf.meta.year
            type = inf.meta.type
            image = inf.meta.image.src
            derpaf()
        })

        async function derpaf() {
            if (type === 'TV series') {
                var color = '#00ccff'
                var process = 'Sonarr'
            }
            if (type === 'feature') {
                var color = '#ffc231'
                var process = 'Radarr'
            }

            let embed = new Discord.MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Add ${names} - (${year}) to ${process}`)
                .setURL(`https://www.imdb.com/title/${id}/`)
                .setThumbnail(`${image}`)
                .setDescription(`Make sure this looks correct before confirming with ${yes}\n\n`)

            let messageEmbed = await message.channel.send(embed);
            messageEmbed.react(yes);
            messageEmbed.react(no);

            client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
                console.log('test1')
                if (reaction.message.channel.id == channel) {
                    console.log('test2')
                    if (reaction.emoji.name === yes) {
                        //log embed
                        let logEmbed = new Discord.MessageEmbed()
                            .setColor(`${color}`)
                            .setTitle(`Requested ${names} - (${year}) to ${process}`)
                            .setURL(`https://www.imdb.com/title/${id}/`)
                            .setThumbnail(`${image}`)
                            .setDescription(`${user} has Requested ${names}`)
                        //Sonarr API
                        if (type == 'TV series') {
                            console.log('sent to sonarr')
                        }
                        //Radarr API
                        if (type == 'feature') {
                            console.log('sent to radarr')
                        }
                        //If Request log has a channel ID, send log
                        if (!requestLog) {} else {
                            client.channels.cache.get(requestLog).send(logEmbed);
                        }
                        //Remove From Request Channel
                        await message.channel.messages.fetch({
                            limit: 2
                        }).then(messages => {
                            message.channel.bulkDelete(messages);
                        });
                    }
                    if (reaction.emoji.name === no) {
                        await message.channel.messages.fetch({
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