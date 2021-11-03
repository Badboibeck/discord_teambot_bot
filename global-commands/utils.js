const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { embedGold } = require('../statics.json');
const lib = require('../lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('utils')
		.setDescription('Utility commands')
		.addSubcommand(subcommand =>
			subcommand
				.setName('get')
				.setDescription('Retrieves info on given objects.')
				.addUserOption(option =>
					option.setName('user')
						.setDescription('Gets User Info')
						.setRequired(false))
				.addRoleOption(option =>
					option.setName('role')
						.setDescription('Gets Role Info')
						.setRequired(false))
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Gets Channel Info')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('message')
						.setDescription('Gets Message Info')
						.setRequired(false))
				.addStringOption(option =>
					option.setName('reactions')
						.setDescription('Gets Reaction Info')
						.setRequired(false)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('ping')
				.setDescription('Replies with bot Latency!'),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const role = interaction.options.getRole('role');
		const channel = interaction.options.getChannel('channel');
		const message = interaction.options.getString('message');
		const reactions = interaction.options.getString('reactions');
		let data;
		if (interaction.commandName === 'utils') {
			if (interaction.options.getSubcommand() === 'ping') {
				const ts = interaction.createdTimestamp;
				await interaction.reply('Measuring please wait');
				const pingMessage = await interaction.fetchReply();
				return interaction.editReply(`🏓Latency is ${pingMessage.createdTimestamp - ts}ms.`);
			}
			else if (interaction.options.getSubcommand() === 'get') {
				if (user) {
					data = `**Username :: ** ${user.tag}\n**ID :: ** ${user.id}`;
				}
				else if (role) {
					const timestamp = lib.convertMilliseconds(`${role.createdTimestamp}`);
					data = `**Role :: ** ${role.name}\n**ID :: ** ${role.id}\n**Mentionable :: ** ${role.mentionable}\n**Guild :: **${role.guild}\n**Hex Color :: **${role.hexColor}\n**Created on :: **<t:${timestamp}:D>`;
				}
				else if (channel) {
					const timestamp = lib.convertMilliseconds(`${channel.createdTimestamp}`);
					data = `**Channel :: **${channel.id}\n**ID :: **${channel.id}\n**Type :: **${channel.type}\n**Created on :: **<t:${timestamp}:D>`;
				}
				else if (reactions) {
					const reactionRegexp = /<a?:(?<reactionName>.*):(?<reactionId>\d*)>/g;
					const reactionResults = reactions.matchAll(reactionRegexp);
					for (const reactionResult of reactionResults) {
						const { reactionName, reactionId } = reactionResult.groups;
						data = `**Name ::** ${reactionName}\n**ID ::** ${reactionId}`;
					}
					if (data === undefined) {
						data = 'Please provide a proper reaction/emote. Thanks.';
					}
				}
				else if (message) {
					const messageUrlRegexp = /https:\/\/discord\.com\/channels\/+(?<guildId>\d+)\/+(?<channelId>\d+)\/(?<messageId>\d+)/g;
					const results = message.matchAll(messageUrlRegexp);
					for (const result of results) {
						const { guildId, channelId, messageId } = result.groups;
						data = `**Guild ID :: ** ${guildId}\n**Channel ID :: ** ${channelId} *(aka... <#${channelId}>)*\n**Message ID :: ** ${messageId}`;
					}
					if (data === undefined) {
						data = 'Please provide a proper message URL. Thanks.';
					}
				}
				else {
					data = 'Please select a option for this command. Thanks.';
				}
				const utilsInfoEmbed = new MessageEmbed()
					.setColor(`${embedGold}`)
					.setDescription(`${data}`)
					.setTimestamp()
					.setFooter('Team Bot :: A Never Play Alone Project');
				return interaction.reply({
					embeds: [utilsInfoEmbed],
					ephemeral: true,
				});
			}
		}
	},
};
