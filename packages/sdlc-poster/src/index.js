'use strict';

const nodemailer = require('nodemailer');

const EamilTemplate = {
	'account-created': ({ accountId, accountName, date }) => {
		return {
			subject: '[SDLC]账号创建成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功创建用户${accountName}(用户ID:${accountId})!</p>
			`
		};
	},
	'account-updated': ({ accountId, accountName, date }) => {
		return {
			subject: '[SDLC]账号更新成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功更新用户${accountName}(用户ID:${accountId})!</p>
			`
		};
	},
	'account-deleted': ({ accountId, accountName, date }) => {
		return {
			subject: '[SDLC]账号删除成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功删除用户${accountName}(用户ID:${accountId})!</p>
			`
		};
	},
	'project-created': ({ projectId, projectName, date }) => {
		return {
			subject: '[SDLC]项目创建成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功创建项目${projectName}(项目ID:${projectId})!</p>
			`
		};
	},
	'project-updated': ({ projectId, projectName, date }) => {
		return {
			subject: '[SDLC]项目更新成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功更新项目${projectName}(项目ID:${projectId})!</p>
			`
		};
	},
	'project-deleted': ({ projectId, projectName, date }) => {
		return {
			subject: '[SDLC]项目删除成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功删除项目${projectName}(项目ID:${projectId})!</p>
			`
		};
	},
	'member-created': ({ projectId, projectName, memberId, memberName, accountId, date }) => {
		return {
			subject: '[SDLC]项目成员添加成功',
			html: `<h3>SDLC</h3>
			<p>您于${date}成功为项目${projectName}(项目ID：${projectId})添加项目成员${memberName}(项目成员ID:${memberId},账号ID:${accountId})!</p>
			`
		};
	},
	'member-deleted': ({ projectId, projectName, memberId, memberName, accountId, date }) => {
		return {
			subject: '[SDLC]项目成员删除成功',
			html: `<h3>SDLC</h3>
				<p>您于${date}成功为项目${projectName}(项目ID：${projectId})删除项目成员${memberName}(项目成员ID:${memberId},账号ID:${accountId})!</p>
			`
		};
	},
	'authentication-failed': ({ accountId, accountName, date }) => {
		return {
			subject: '[SDLC]用户登录失败',
			html: `<h3>SDLC</h3>
				<p>用户${accountName}(用户ID:${accountId})于${date}登录失败!</p>
			`
		};
	},
	'authentication-succeed': ({ accountId, accountName, date }) => {
		return {
			subject: '[SDLC]用户登录成功',
			html: `<h3>SDLC</h3>
			<p>用户${accountName}(用户ID:${accountId})于${date}登录成功!</p>
		`
		};
	},
};
const eventTypes = {
	account: async (channelName ,arg, Model, injection) => {
		const accountList = await injection.Model.AccountList.query({
			selector: 'all'
		});
		const recipientList = accountList.$data.map(async account => {
			const accountInfo = await Model.AccountInfo.query(account.id);

			if (accountInfo && accountInfo.$data.events.indexOf(channelName) >= 0) {
				return accountInfo.$data.email;
			}
		});

		return {
			recipientList,
			emailTemplate: EamilTemplate[channelName]({
				accountId: arg.id,
				accountName: arg.name,
				date: arg.createdAt.toLocaleString() || new Date().toLocaleString()
			}),
		};
	},
	project: async (channelName, arg, Model, injection) =>{
		const accountList = await injection.Model.AccountList.query({
			selector: 'all'
		});
		const recipientList = accountList.$data.map(async account => {
			const accountInfo = await Model.AccountInfo.query(account.id);

			if (accountInfo && accountInfo.$data.events.indexOf(channelName) >= 0) {
				return accountInfo.$data.email;
			}
		});

		return {
			recipientList,
			emailTemplate: EamilTemplate[channelName]({
				projectId: arg.id,
				projectName: arg.name,
				date: arg.createdAt.toLocaleString() || new Date().toLocaleString()
			}),
		};
	},
	member: async (channelName, arg, Model, injection) => {
		const accountList = await injection.Model.AccountList.query({
			selector: 'all'
		});
		const recipientList = accountList.$data.map(async account => {
			const accountInfo = await Model.AccountInfo.query(account.id);

			if (accountInfo && accountInfo.$data.events.indexOf(channelName) >= 0) {
				return accountInfo.$data.email;
			}
		});
		const account = await injection.Model.Account.query(arg.accountId);
		const project = await injection.Model.Project.query(arg.projectId);

		return {
			emailTemplate: EamilTemplate[channelName]({
				projectId: arg.projectId,
				projectName: project.name,
				memberId: arg.id,
				memberName: account.name,
				accountId: arg.accountId,
				date: arg.exitedAt ||arg.joinedAt
			}),
			recipientList
		};
	},
	authentication: async (channelName, arg, Model, injection) => {
		const accountList = await injection.Model.AccountList.query({
			selector: 'all'
		});
		const recipientList = accountList.$data.map(async account => {
			const accountInfo = await Model.AccountInfo.query(account.id);

			if (accountInfo && accountInfo.$data.events.indexOf(channelName) >= 0) {
				return accountInfo.$data.email;
			}
		});
		const account = await injection.Model.Account.query(arg.account.id);

		return {
			emailTemplate: EamilTemplate[channelName]({
				accountId: account.$data.id,
				accountName: account.$data.name,
				date: new Date().toLocaleString()
			}),
			recipientList
		};
	}
};

module.exports = function (options, { Model, injection }) {
	const { channelCenter } = injection;
	const sender = {
		email: function send(transportOptions, mailOptions) {
			const transporter = nodemailer.createTransport(transportOptions);
	
			return transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				}
	
				return console.log(info);
			});
		}
	};

	const { channels, subscribe} = channelCenter();
	
	channels.forEach(channelName => {
		subscribe(channelName, async function (arg) {
			const type = ['account', 'project', 'member', 'authentication'].find(type => type === channelName.substring(0, channelName.indexOf('-')));
			const { emailTemplate, recipientList } = await eventTypes[type](channelName, arg, Model, injection);

			recipientList.forEach(recipient => {
				recipient.then((email) => {
					if (email) {
						sender.email(options, {
							from: options.auth.user,
							to: email,
							subject: emailTemplate.subject, 
							html: emailTemplate.html
						});
					}
				});
			});
		});
	});
};