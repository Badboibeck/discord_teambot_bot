const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./global-commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./global-commands/${file}`);
	command.data.setDefaultPermission(false);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	}
	catch (error) {
		console.error(error);
	}
})();
