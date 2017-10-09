'use babel';

// import FoldWhateverView from './fold-whatever-view';
import {
  CompositeDisposable,
  Point,
  Range,
  TextEditor
} from 'atom';

export default {

  subscriptions: null,
  regexStrings: [],
  regexes: [],
  areRegionsFoldedOnLoad: false,

  config: {
    areRegionsFoldedOnLoad: {
      title: 'Auto fold on file open?',
      description: 'If checked, regions start in their folded state when a file is opened.',
      type: 'boolean',
      default: false,
      order: 7
    },
    configRegexes: {
      title: 'regexes of foldable regions',
      description: `A list of regexes that identifies a foldable region in a file. When the regex has 3 reagions only the middle one will be folded`,
      type: 'string',
      default: "/(\\[)([^\\]]*?\\@.+?)(\\])/g /(\\^\\[)([^\\]]*?)(\\])/g",
      order: 8
    },
  },

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'fold-whatever:fold-all': () => this.foldAll(),
        'fold-whatever:unfold-all': () => this.unfoldAll(),
        'fold-whatever:fold-line': () => this.foldLine(),
        'fold-whatever:unfold-line': () => this.unfoldLine(),
        'fold-whatever:fold-here': () => this.foldHere(),
        'fold-whatever:unfold-here': () => this.unfoldHere()
      }));

    const foldWhatever = this; // don't know how else to make the callback function to know what "this" is.
    atom.config.observe('fold-whatever.configRegexes', function(line) {
      foldWhatever.regexStrings = [];
      var re = /\/(.*?[^\\])\/([gimuy]*)/g;
      while (m = re.exec(line)) {
        foldWhatever.regexStrings.push([m[1], m[2]]);
        }
      }
    );

    atom.config.observe('fold-whatever.areRegionsFoldedOnLoad', function(change) {
        foldWhatever.areRegionsFoldedOnLoad = change;
      }
    );

    this.subscriptions.add(atom.workspace.onDidAddTextEditor(event => {
      if (foldWhatever.areRegionsFoldedOnLoad) {
        event.textEditor.tokenizedBuffer.onDidTokenize(() => {
          foldWhatever.foldAll(event.textEditor);
        });
      }
    }));

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  },

  makeFoldIter(editor) {
    return function(match) {
      var range = match.range;
      if (match.match.length == 4) { //when the regex has 3 regions only the middle one will be folded
        var p1 = (match.range.start.column + match.match[1].length);
        var p2 = (match.range.end.column - match.match[3].length);
        range = new Range(new Point(match.range.start.row, p1), new Point(match.range.end.row, p2));
      };
      editor.setSelectedBufferRange(range);
      editor.getLastSelection().fold();
    };
  },

  foldAll(currentEditor=undefined) {
    // When called from keyboard binding, some arguments get sent in. We're only interested if the argument is the editor.
    let editor;
    if (!(currentEditor instanceof TextEditor)) {
      currentEditor = undefined;
      editor = atom.workspace.getActiveTextEditor();
    } else {
      editor = currentEditor;
    }

    const buffer = editor.getBuffer();
    var iter = this.makeFoldIter(editor);
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScan(r, iter);
    }
  },

  foldLine() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var row = bufferPosition.row;
    var iter = this.makeFoldIter(editor);
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScanInRange(r, new Range(new Point(row, 0), new Point(row, Number.MAX_SAFE_INTEGER)), iter);
    }
  },

  foldHere() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var row = bufferPosition.row;
    var c = bufferPosition.column;
    var iter = function(match) {// i don't use the make Iter function because i added a test here
      var range = match.range;
      if (match.match.length == 4) { //when the regex has 3 regions only the middle one will be folded
        var p1 = (range.start.column + match.match[1].length);
        var p2 = (range.end.column - match.match[3].length);
        range = new Range(new Point(range.start.row, p1), new Point(range.end.row, p2));
      };
      if (range.start.column <= c && range.end.column >= c) {
        editor.setSelectedBufferRange(range);
        editor.getLastSelection().fold();
      }
    };
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScanInRange(r, new Range(new Point(row, 0), new Point(row, Number.MAX_SAFE_INTEGER)), iter);
    }
  },


  unfoldAll() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    var iter = function(match) {
      editor.destroyFoldsIntersectingBufferRange(match.range);
    };
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScan(r, iter);
    }
  },

  unfoldLine() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var row = bufferPosition.row;
    var iter = function(match) {
      editor.destroyFoldsIntersectingBufferRange(match.range);
    };
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScanInRange(r, new Range(new Point(row, 0), new Point(row, Number.MAX_SAFE_INTEGER)), iter);
    }
  },

  unfoldHere() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var row = bufferPosition.row;
    var c = bufferPosition.column;
    var iter = function(match) {
      if (match.range.start.column <= c && match.range.end.column >= c) {
        editor.destroyFoldsIntersectingBufferRange(Range(bufferPosition, bufferPosition));
      }
    };
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScanInRange(r, new Range(new Point(row, 0), new Point(row, Number.MAX_SAFE_INTEGER)), iter);
    }
  },
};
