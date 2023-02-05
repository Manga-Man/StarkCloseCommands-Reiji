const { prefix, token } = require("./config.json");
const { fetch } = require('fetch-nodejs')

const { Client, Intents, Collection, MessageEmbed, mess} = require('discord.js');
const bot = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ] 
});

const fs = require("fs");

const express = require("express");
const app = express();
const port = 3000;

const newEmbed = new MessageEmbed()
.setColor('#2ab8a0')
.setDescription('uwu')


bot.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'))
for (const file of commandFiles) {
    const props = require(`./commands/${file}`)
    console.log(`${file} loaded`)
    bot.commands.set(props.config.name, props)
}

const commandSubFolders = fs.readdirSync('./commands/').filter(f => !f.endsWith('.js'))

commandSubFolders.forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith('.js'))
    for (const file of commandFiles) {
        const props = require(`./commands/${folder}/${file}`)
        console.log(`${file} loaded from ${folder}`)
        bot.commands.set(props.config.name, props)
    }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if(event.once) {
        bot.once(event.name, (...args) => {
            event.execute(...args, bot)
            app.get("/", (req, res) => res.type('html').send('html'));
            app.listen(port, () => console.log(`Example app listening on port ${port}!`));


        
        })

    } else {
        bot.on(event.name, (...args) => {
            event.execute(...args, bot)
            
            app.get("/", (req, res) => res.type('html').send(html));
            app.listen(port, () => console.log(`Example app listening on port ${port}!`));
        }
            )
    }
}

//Command Manager
bot.on("messageCreate", async message => {
    //Check if author is a bot or the message was sent in dms and return
    if(message.author.bot) return;
    //if(message.channel.type === "dm") return;

    if(message.attachments.size > 0) {
        message.reply('sent ' + message.attachments.size + ' images to album channel.')
        message.attachments.forEach(a => {
            const channel = bot.channels.cache.find(channel => channel.name === 'album-2')
            newEmbed.setFooter({iconURL:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`, text: message.author.tag})
            newEmbed.setImage(a.proxyURL)
            channel.send({embeds: [newEmbed]})
        });
    }

    //get prefix from config and prepare message so it can be read as a command
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


    //Check for prefix
    if(!cmd.startsWith(prefix)) return;

    if(cmd.startsWith(prefix) && message.content.includes('sauce')) {
        fetch('https://yande.re/post.json?limit=1000')
.then((response) => response.json())
.then((data) => {
  console.log(data[Math.floor((Math.random() * 1000) + 1)].jpeg_url)
  newEmbed.setImage(data[Math.floor((Math.random() * 1000) + 1)].jpeg_url)
  message.reply({embeds: [newEmbed]})
})

        
    }

    //Get the command from the commands collection and then if the command is found run the command file
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);

});


//Token needed in config.json
bot.login('OTYwMzYyNTQ4NDE3Mzk2NzU3.GwQO_E.5zBKvGqcLw-CchE' + 'CeoXVOoedtOt1' + 'j0h_sMFhkc');

//...Discord Bot Code Above ^^

