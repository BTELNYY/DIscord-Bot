import * as Discord from "discord.js"

export function basicEmbed(title, color, description, footer){
    var embed = new Discord.MessageEmbed()
	.setColor(color)
	.setTitle(title)
	.setDescription(description)
	.setTimestamp()
	.setFooter(footer);
    return embed
}