const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.commands = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./Handlers/${handler}`)(client, Discord)
})
client.login(process.env.DISCORD_TOKEN);