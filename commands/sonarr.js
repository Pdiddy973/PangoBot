var nameToImdb = require("name-to-imdb");

module.exports = {
    name: 'sonarr',
    description: 'Adds Shows to Sonarr Queue',
    async execute(client, message, args, Discord) {
        const channel = process.env.REQUEST_CHANNEL;
        const requestLog = process.env.REQUEST_LOG_CHANNEL
        const yes = '✅';
        const no = '🚫';
        const imdb_query = args.join(' ')

        if (!imdb_query) return message.reply("please add a show to the command")

        nameToImdb(`${imdb_query}`, function(err, res, inf) {
            sonarrid = inf.meta.id
            sonarrshow = inf.meta.name
            sonarryear = inf.meta.year
            sonarrtype = inf.meta.type
            sonarrimage = inf.meta.image.src
            derpaf()
        })

        async function derpaf() {
            if (sonarrtype === 'TV series') {
                let embed = new Discord.MessageEmbed()
                    .setColor('#00ccff')
                    .setTitle(`Add ${sonarrshow} - (${sonarryear}) to Sonarr`)
                    .setURL(`https://www.imdb.com/title/${sonarrid}/`)
                    .setThumbnail(`${sonarrimage}`)
                    .setDescription(`Make sure this looks correct before confirming with ${yes}\n\n`)

                let messageEmbed = await message.channel.send(embed);
                messageEmbed.react(yes);
                messageEmbed.react(no);

                client.on('messageReactionAdd', async (reaction, user) => {
                    if (reaction.message.partial) await reaction.message.fetch();
                    if (reaction.partial) await reaction.fetch();
                    if (user.bot) return;
                    if (!reaction.message.guild) return;

                    if (reaction.message.channel.id == channel) {
                        if (reaction.emoji.name === yes) {
                            //sonarr api

                            //log embed
                            let logEmbed = new Discord.MessageEmbed()
                                .setColor('#00ccff')
                                .setTitle(`Requested ${sonarrshow} - (${sonarryear}) to Sonarr`)
                                .setURL(`https://www.imdb.com/title/${sonarrid}/`)
                                .setThumbnail(`${sonarrimage}`)
                                .setDescription(`${user} has Requested ${sonarrshow}`)
                            //if request log has a channel ID, send log
                            if (!requestLog) {

                            } else {
                                client.channels.cache.get(requestLog).send(logEmbed);
                            }

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

            } else {
                message.reply(`${sonarrshow} is not a TV Seris`)
                    .then(msg => {
                        msg.delete({
                            timeout: 5000
                        })
                    })
            }
        }
    }
}