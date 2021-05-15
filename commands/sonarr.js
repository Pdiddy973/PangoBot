module.exports = {
    name: 'sonarr',
    description: 'Adds Shows to Sonarr Queue',
    async execute(client, message, args, Discord) {
        const channel = '842850107422801941';
        const yes = '✅';
        const no = '🚫';

        if (!args[0]) return message.reply("Please type in a Show Name like `!sonarr <TV Show>`")

        const { searchMovies } = require('imdb-scraper');
 
        searchMovies('star wars episode').then(response => console.log(response))
        let embed = new Discord.MessageEmbed()
            .setColor('#00ccff')
            .setTitle(`Adding ${args} to Sonarr`)
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