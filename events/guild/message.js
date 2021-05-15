module.exports = (Discord, client, message) =>{
    const prefix = '~';
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix,this.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.command.get(cmd);

    if(command) command.exacute(client, message, args, Discord);
}