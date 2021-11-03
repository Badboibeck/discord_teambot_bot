const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { embedGold, jumperRole } = require('../statics.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('Utility commands')
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup
				.setName('get')
				.setDescription('Retrieves info on given objects.')
				.addSubcommand(subcommand =>
					subcommand
						.setName('pending_status')
						.setDescription('Retrieves user pending status.')
						.addUserOption(option =>
							option.setName('user')
								.setDescription('Gets user pending status.')
								.setRequired(false)),
				),
		)
		.addSubcommandGroup(subcommandGroup =>
			subcommandGroup
				.setName('jumper')
				.setDescription('Retrieves jumpers for thumping.')
				.addSubcommand(subcommand =>
					subcommand
						.setName('thumper')
						.setDescription('Jumper thumper will add jumpers to ever member without the role.'),
				),
		),
	async execute(interaction) {
		const user = interaction.options.getMember('user');
		let data;
		if (interaction.commandName === 'admin') {
			if (interaction.options.getSubcommand() === 'pending_status') {
				data = `${user} pending status is ${user.pending}.`;
			}
			else if (interaction.options.getSubcommand() === 'thumper') {
				guild.members.forEach(member => {
					if (!(member.roles.has('role')) && !(user.bot)) {
						member.roles.add(jumperRole, 'Jumper Thumper had to thump away');
					}
				});
			}
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
	},
};
