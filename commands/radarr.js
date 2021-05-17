let nameToImdb = require("name-to-imdb");
module.exports = {
    name: 'radarr',
    description: 'Adds Shows to radarr Queue',
    async execute(client, message, args, Discord) {
        const channel = process.env.REQUEST_CHANNEL;
        const yes = '✅';
        const no = '🚫';
        const imdb_query = args.join(' ')
        if (!imdb_query) return message.reply("please add a show to the command")

        nameToImdb(`${imdb_query}`, function (err, res, inf) {
            radarrid = inf.meta.id
            radarrshow = inf.meta.name
            radarryear = inf.meta.year
            radarrtype = inf.meta.type
            radarrimage = inf.meta.image.src
            derpaf()
        })
        async function derpaf() {
            if (radarrtype === 'feature') {
                let embed = new Discord.MessageEmbed()
                    .setColor('#ffc231')
                    .setTitle(`Add ${radarrshow} - (${radarryear}) to Radarr`)
                    .setURL(`https://www.imdb.com/title/${radarrid}/`)
                    .setThumbnail(`${radarrimage}`)
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
                            console.log(`${user} has selceted ${radarrshow} is Correct`)
                            //radarr api
                            await message.channel.messages.fetch({
                                limit: 2
                            }).then(messages => {
                                message.channel.bulkDelete(messages);
                            });
                        }
                        if (reaction.emoji.name === no) {
                            console.log(`${user} has selceted Incorrect`)
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
                message.reply(`${radarrshow} is not a Movie`)
                    .then(msg => {
                        msg.delete({
                            timeout: 5000
                        })
                    })
            }
        }
    }
}