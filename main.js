import * as Discord from "discord.js"
import * as fs from "fs"
import * as Utility from "./utility.js"
import * as commands from "./commands.js"

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"] })
var channels = {};
var status
const prefix = "-"
var token = null

try {
    var data = fs.readFileSync('token.token', 'utf8')
    console.log(data.toString())
    token = data.toString()
} catch(e) {
    console.log('Error:', e.stack)
}
client.login(token)
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})
client.on("messageCreate", msg => {
    if(!(msg.toString().charAt(0) === prefix)){
        return;
    }else{
        var cmddecompiled = msg.toString().split(' ')
        var command = msg.toString().slice(1)
        switch(command){
            case "lockdown":
                if((typeof msg === Discord.Message)){
                    throw new Error("Invalid Parameter for function commandLockdown!")
                }else{
                    var command = Object.assign(msg, Discord.Message)
                    var channel = msg.channel.id
                    if(!msg.member.permissions.has("ADMINISTRATOR")){
                        command.reply("You don't have permission to do that.")
                        return;
                    }
                    if(!channels.hasOwnProperty(channel)){
                        channels[channel] = true
                        status = true
                    }else{
                        status = !channels[channel]
                    }
                    if(status){
                        var embed = Utility.basicEmbed("Channel Lockdown", "#FF0000", "This channel is locked down.", "btelnyy-bot")
                        msg.channel.send({ embeds: [embed]})
                        msg.channel.permissionOverwrites.create(msg.channel.guild.roles.everyone, { SEND_MESSAGES: false , EMBED_LINKS: false, ATTACH_FILES: false, SEND_MESSAGES_IN_THREADS: false, USE_APPLICATION_COMMANDS: false, CREATE_PUBLIC_THREADS: false});
                    }else{
                        var embed = Utility.basicEmbed("Channel Lockdown Lifted", "00FF00", "This channel can be used as normal.", "btelnyy-bot")
                        msg.channel.send({ embeds: [embed]})
                        msg.channel.permissionOverwrites.edit(msg.channel.guild.roles.everyone, { SEND_MESSAGES: null , EMBED_LINKS: null, ATTACH_FILES: null, SEND_MESSAGES_IN_THREADS: null, USE_APPLICATION_COMMANDS: null, CREATE_PUBLIC_THREADS: null});
                    }
                }
                break
            case "ping":
                msg.channel.send(`Latency is ${Date.now() - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
                break
        }
    }
})
