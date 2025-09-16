import { commands, EventEmitter, ExtensionContext, ThemeIcon, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from "vscode";

export default class NotesTreeDataProvider implements TreeDataProvider<DemoTreeItem> {
    private _onDidChangeTreeData = new EventEmitter<DemoTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    private static VIEW_ID = 'notes';
    private folders: Folder[] = [];

    private constructor(context: ExtensionContext) {
        context.subscriptions.push(
            commands.registerCommand('demo-extension.refreshNotes', async () => {
                this.refresh();
            }),

            commands.registerCommand('demo-extension.addFolder', async () => {
                // Prompt for folder name
                const name = await window.showInputBox({
                    prompt: 'Enter the folder name',
                    placeHolder: 'Folder name'
                });
                if (!name) {
                    return;
                }

                // Generate a random ID for the folder
                const id = Math.floor(10000 + Math.random() * 90000);

                // Add folder to the list
                this.folders.push({
                    id: id,
                    name: name,
                    notes: []
                });
                this.refresh();
            }),

            commands.registerCommand('demo-extension.addNote', async (folderTreeItem: FolderTreeItem) => {
                // Prompt for note name
                const name = await window.showInputBox({
                    prompt: 'Enter the note name',
                    placeHolder: 'Note name'
                });
                if (!name) {
                    return;
                }

                // Prompt for note text
                const text = await window.showInputBox({
                    prompt: 'Enter the note text',
                    placeHolder: 'Note text'
                });
                if (!text) {
                    return;
                }

                // Add note to the folder
                const folderData = this.folders.find(f => f.id === folderTreeItem.folder.id);
                if (folderData) {
                    folderData.notes.push({
                        name: name,
                        text: text
                    });
                    this.refresh();
                } else {
                    window.showErrorMessage(`Folder not found: ${folderTreeItem.folder.name}`);
                }
            }),

            commands.registerCommand('demo-extension.deleteFolder', async (folderTreeItem: FolderTreeItem) => {
                // Remove folder from the list
                this.folders = this.folders.filter(f => f.id !== folderTreeItem.folder.id);
                this.refresh();
            }),

            commands.registerCommand('demo-extension.deleteNote', async (noteTreeItem: NoteTreeItem) => {
                // Remove note from the folder
                const folder = this.folders.find(f => f.id === noteTreeItem.folder.id);
                if (folder) {
                    folder.notes = folder.notes.filter(n => n !== noteTreeItem.note);
                    this.refresh();
                } else {
                    window.showErrorMessage(`Folder not found: ${noteTreeItem.folder.name}`);
                }
            })
        );
    }

    static registerTreeView(context: ExtensionContext) {
        // Register the tree view
        const notesTreeDataProvider = new NotesTreeDataProvider(context);
        window.createTreeView(NotesTreeDataProvider.VIEW_ID, {
            treeDataProvider: notesTreeDataProvider,
            showCollapseAll: true
        });
    }

    refresh(element?: DemoTreeItem) {
        this._onDidChangeTreeData.fire(element);
    }

    getTreeItem(element: DemoTreeItem): DemoTreeItem | Thenable<DemoTreeItem> {
        return element;
    }

    async getChildren(element?: DemoTreeItem): Promise<DemoTreeItem[]> {
        if (element) {
            // Get the children of an arbitrary tree item
            return element.getChildren();
        } else {
            // Get the root level tree items
            return this.folders.map(folder => new FolderTreeItem(folder));
        }
    }
}

export interface DemoTreeItem extends TreeItem {
    getChildren: () => DemoTreeItem[] | Promise<DemoTreeItem[]>;
}

export class FolderTreeItem extends TreeItem implements DemoTreeItem {
    folder: Folder;

    constructor(folder: Folder) {
        super(folder.name, TreeItemCollapsibleState.Collapsed);
        this.folder = folder;
        this.description = `${folder.notes.length} notes`;
        this.contextValue = `demo-extension.folder`;
        this.iconPath = new ThemeIcon('folder');
    }

    async getChildren(): Promise<NoteTreeItem[]> {
        return this.folder.notes.map(note => new NoteTreeItem(this.folder, note));
    }
}

export class NoteTreeItem extends TreeItem implements DemoTreeItem {
    folder: Folder;
    note: Note;

    constructor(folder: Folder, note: Note) {
        super(note.name, TreeItemCollapsibleState.None);
        this.folder = folder;
        this.note = note;
        this.tooltip = note.text;
        this.contextValue = `demo-extension.note`;
        this.iconPath = new ThemeIcon('note');
    }

    async getChildren(): Promise<DemoTreeItem[]> {
        return [];
    }
}

interface Folder {
    id: number;
    name: string;
    notes: Note[];
}

interface Note {
    name: string;
    text: string
}