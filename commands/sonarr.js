module.exports = {
    name: 'sonarr',
    description: 'Adds Shows to Sonarr Queue',
    async execute(client, message, args, Discord) {
        const channel = '842850107422801941';
        const yes = '✅';
        const no = '🚫';

        if (!args[0]) return message.reply("Please type in a Show Name like `!sonarr <TV Show>`")

        let nameToImdb = require("name-to-imdb");
        nameToImdb(`${args}`, function (err, res, inf) {
            let id = inf.meta.id
            let names = inf.meta.name
            let year = inf.meta.year
            let type = inf.meta.type
            let image = inf.meta.image.src
            console.log(id)
            console.log(names)
            console.log(year)
            console.log(type)
            console.log(image)
            //console.log(inf)
        })
        let embed = new Discord.MessageEmbed()
            .setColor('#00ccff')
            .setTitle(`Adding  to Sonarr`)
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .setDescription('Choosing a team will allow you to interact with your teammates!\n\n' +
                `${yes} For Correct\n` +
                `${no} For Incorrect`);

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
                    console.log(`${user} has selceted Correct`)
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
    }
}