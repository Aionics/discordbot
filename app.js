const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config')
const tts = require('./tts')
const _path = 'Z:/=Imprtnt/DiscordMusic/'
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


const Help = require("./help.txt");
const audioList = ['invade1', 'invade2', 'invade3'];

let State = {
    isInVoice: false,
    isPlayingOrSpeaking: false,
    volume: 0.3
}
let Globals = {
    voiceConnection: null,
    musicDispatcher: null
}

const CommandList = {
    joinVoice: function (channelId) {
        try {
            voiceChannel = bot.channels.get(channelId);
            voiceChannel.join().then(connection => {
                Globals.voiceConnection = connection
            })
        } catch (e) {
            console.log(e);
            return e
        } finally {
            State.isInVoice = true
        }
    },
    summon: function () {
        let channel = this.member.voiceChannel
        if (typeof channel == 'undefined') {
            return 'you need to join voice first'
        } else {
            channel.join().then(connection => {
                Globals.voiceConnection = connection
                State.isInVoice = true
            }).catch(console.error);
        }
    },
    play: function (audioName) {
        // let audioName = message.content.split(' ')[1]
        if (State.isInVoice) {
            // console.log(Globals.voiceConnection);
            Globals.musicDispatcher = Globals.voiceConnection.playFile('tts-temp.mp3', { volume: State.volume });
            Globals.musicDispatcher.on('debug', i => {
                console.log(i);
            });
            Globals.musicDispatcher.on('start', () => {
                State.isPlayingOrSpeaking = true
                console.log('playing');
            });
            Globals.musicDispatcher.once('end', () => {
                State.isPlayingOrSpeaking = false
                console.log('end');
            });
            Globals.musicDispatcher.once('error', errWithFile => {
                State.isPlayingOrSpeaking = false
                console.log('err with file: ' + errWithFile);
                return ('err with file: ' + errWithFile)
            });
        } else {
            return 'join me to voice first \nuse !joinVoice <channelId> or !summon'
        }
    },
    tts: function (text) {
        tts(text, () => {
            CommandList.play('tts-temp')
        })
    },
    stop: function () {
        if (State.isPlaying) {
            Globals.musicDispatcher.end()
        } else {
            return 'sorry, nothing to stop'
        }
    },
    // playlist: function () {
    //     return '\n' + audioList.join('\n')
    // },
    setvol: function (volume) {
        State.volume = volume
    },
    status: function () {
        return '```json\n' + JSON.stringify(State, null, '\t') + '```'
    },
    help: function () {
        return '```' + Help + '```'
    }
}

function executeCommand(commandName, args, message) {
    let command = CommandList[commandName]
    let params
    if (args) {
        // console.log(args, typeof args);
        params = args.match(/(?:[^\s"]+|"[^"]*")+/g);
    } else {
        params = {
            length: 0
        }
    }
    if (params.length == command.length) {
        if (params.length != 0) {
            return command.apply(message, params);
        } else {
            return command.apply(message);
        }
    } else {
        // console.log(params);
        return `command ${commandName} takes ${command.length} arguments, but got ${params.length}: '${params.join(', ')}'.\n(example:   !command <arg1> <arg2>)`
        // return 'command \"' + commandName + '\" takes ' + command.length + ' arguments, but got ' + params.length + '.\n(example:   !command <arg1> <arg2>)'
    }
}

bot.on('message', message => {
    if (message.author.id == config.myId) {
        if (message.content.indexOf('!test') == 0) {
            console.log(message.guild.channels);
            console.log('\n\n####\n\n');
            console.log();
        }
    }

    if (message.content.indexOf('!') == 0) {
        let content = message.content.split(' ')
        let command = content[0].substr(1)
        let args
        if (content.length == 1) {
            args = null
        } else {
            args = content[1]
        }

        isCommandExists = false;
        for (commandName in CommandList) {
            if (command == commandName) {
                isCommandExists = true;
                answer = executeCommand(command, args, message)
                if (typeof answer !== 'undefined') {
                    message.reply(answer)
                }
                break
            }
        }
        if (!isCommandExists) {
            message.reply('Sorry, \"' + command + '\" is unknown command for me, use !help to see availible commands c:')
        }
    }
});
bot.login(config.token)
