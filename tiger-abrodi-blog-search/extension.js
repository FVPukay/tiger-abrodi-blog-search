const vscode = require('vscode');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	const res = await axios.get('https://tigerabrodi.blog/rss.xml');
	const parser = new XMLParser();
	const articles = parser.parse(res.data).rss.channel.item.map(
		article => {
			return {
				label: article.title,
				detail: article.description,
				link: article.link,
			};
		});

		const disposable = vscode.commands.registerCommand(
			'tiger-abrodi-blog-search.searchTigersBlog', async () => {
				const article = await vscode.window.showQuickPick(articles, {
					matchOnDetail: true,
			});
	
			if (article == null) return;
			vscode.env.openExternal(article.link);
	
		});
		
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
