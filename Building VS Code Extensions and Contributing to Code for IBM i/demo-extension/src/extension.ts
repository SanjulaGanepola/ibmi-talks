import { commands, ExtensionContext, window } from 'vscode';
import { SimpleDemos } from './demos/1_simpleDemos';
import { DemoListener } from './demos/4_listeners';
import NotesTreeDataProvider from './demos/5_treeView';

export function activate(context: ExtensionContext) {
	console.log('Congratulations, your extension "demo-extension" is now active!');

	const disposable = commands.registerCommand('demo-extension.helloWorld', () => {
		window.showInformationMessage('Hello World from Demo Extension!');
	});
	context.subscriptions.push(disposable);

	SimpleDemos.registerCommands(context);
	DemoListener.initialize(context);
	NotesTreeDataProvider.registerTreeView(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}