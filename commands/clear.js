module.exports = {
    name: 'clear',
    description: "Clears x amount of messages",
    async execute(client, message, args) {
        if (!args[0]) return message.reply("Please type in a how many messages to clear");
        if (isNaN(args[0])) return message.reply(`${args} is not a valid Number`);
        if (args[0] > 100) return message.reply(`${args} is not a valid Number`);
        if (args[0] < 1) return message.reply(`${args} is not a valid Number`);

        await message.channel.messages.fetch({
            limit: args[0]
        }).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
}