const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config')

let State = {
    isInVoice: false
}

bot.on('message', msg => {
    console.log(msg.author.id);
    if (msg.author.id == config.myId) {
        let message = msg.content

        if (message.indexOf('!joinVoice') == 0) {
            if (!State.isInVoice) {
                let channel = message.split(' ')[1]
                try {
                    voiceChannel = msg.guild.channels.get(channel)
                    voiceChannel.join()
                } catch (e) {
                    console.log(e);
                    message.reply(e)
                } finally {
                    State.isInVoice = true
                }

            }
        }

        if (message.indexOf('!play') == 0) {

            console.log(audioRequest);
        }

        if (message.indexOf('!test') == 0) {
            console.log(msg.guild.channels);
            console.log('\n\n####\n\n');
            console.log();
        }
    }
});



bot.login(config.token)
