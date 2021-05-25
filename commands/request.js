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
        if (!imdb_query) return message.reply("Please Add a Media to Look For")

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
            const color = type === 'TV series' ? '#00ccff' : '#ffc231'
            const process_ = type === 'TV series' ? 'Sonarr' : 'Radarr'

            //Confirm Embed
            const confirmEmbed = new Discord.MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`Add ${media} - (${year}) to ${process_}`)
                .setURL(`https://www.imdb.com/title/${id}/`)
                .setThumbnail(`${image}`)
                .setDescription(`Make sure this looks correct before confirming with ${yes}\n\n`)

            message.channel.send(confirmEmbed).then(m => {
                m.react(yes);
                const filter = (reaction, user) => reaction.emoji.name === yes && user.id === message.author.id
                const collector = m.createReactionCollector(filter, {
                    max: 1,
                    time: 5 * 60 * 1000
                })
                collector.on('collect', async (reaction, user) => {
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
                        message.channel.bulkDelete(messages)
                    })
                })

                m.react(no)
                const filter2 = (reaction, user) => reaction.emoji.name === yes && user.id === message.author.id
                const collector2 = m.createReactionCollector(filter2, {
                    max: 1,
                    time: 5 * 60 * 1000
                })
                collector2.on('collect', async (reaction, user) => {
                    message.channel.messages.fetch({
                        limit: 2
                    }).then(messages => {
                        message.channel.bulkDelete(messages)
                    })
                })
            })
        }
    }
}