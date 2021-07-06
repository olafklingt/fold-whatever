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
        'fold-whatever:unfold-here': () => this.unfoldHere(),
        'fold-whatever:toggle-all': () => this.toggleAll(),
        'fold-whatever:toggle-line': () => this.toggleLine(),
        'fold-whatever:toggle-here': () => this.toggleHere(),
        'fold-whatever:toggle-all-1st': () => this.toggleAll1st(),
        'fold-whatever:toggle-all-2nd': () => this.toggleAll2nd(),
        'fold-whatever:toggle-all-3rd': () => this.toggleAll3rd(),
        'fold-whatever:toggle-all-4th': () => this.toggleAll4th(),
        'fold-whatever:toggle-all-5th': () => this.toggleAll5th(),
        'fold-whatever:toggle-all-6th': () => this.toggleAll6th(),
        'fold-whatever:toggle-all-7th': () => this.toggleAll7th(),
        'fold-whatever:toggle-all-8th': () => this.toggleAll8th(),
        'fold-whatever:toggle-all-9th': () => this.toggleAll9th(),
        'fold-whatever:fold-all-1st': () => this.foldAll1st(),
        'fold-whatever:fold-all-2nd': () => this.foldAll2nd(),
        'fold-whatever:fold-all-3rd': () => this.foldAll3rd(),
        'fold-whatever:fold-all-4th': () => this.foldAll4th(),
        'fold-whatever:fold-all-5th': () => this.foldAll5th(),
        'fold-whatever:fold-all-6th': () => this.foldAll6th(),
        'fold-whatever:fold-all-7th': () => this.foldAll7th(),
        'fold-whatever:fold-all-8th': () => this.foldAll8th(),
        'fold-whatever:fold-all-9th': () => this.foldAll9th(),
        'fold-whatever:unfold-all-1st': () => this.unfoldAll1st(),
        'fold-whatever:unfold-all-2nd': () => this.unfoldAll2nd(),
        'fold-whatever:unfold-all-3rd': () => this.unfoldAll3rd(),
        'fold-whatever:unfold-all-4th': () => this.unfoldAll4th(),
        'fold-whatever:unfold-all-5th': () => this.unfoldAll5th(),
        'fold-whatever:unfold-all-6th': () => this.unfoldAll6th(),
        'fold-whatever:unfold-all-7th': () => this.unfoldAll7th(),
        'fold-whatever:unfold-all-8th': () => this.unfoldAll8th(),
        'fold-whatever:unfold-all-9th': () => this.unfoldAll9th(),
      }));

    const foldWhatever = this; // don't know how else to make the callback function to know what "this" is.
    atom.config.observe('fold-whatever.configRegexes', function(line) {
      foldWhatever.regexStrings = [];
      var re = /\/(.*?[^\\])\/([gimuy]*)/g;
      while (m = re.exec(line)) {
        foldWhatever.regexStrings.push([m[1], m[2]]);
      }
    });

    atom.config.observe('fold-whatever.areRegionsFoldedOnLoad', function(change) {
      foldWhatever.areRegionsFoldedOnLoad = change;
    });

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

  serialize() {},

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

  foldAllNthRegex(nth,currentEditor = undefined) {
    let editor;
    if (!(currentEditor instanceof TextEditor)) {
      currentEditor = undefined;
      editor = atom.workspace.getActiveTextEditor();
    } else {
      editor = currentEditor;
    }
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var iter = this.makeFoldIter(editor);
    let s = this.regexStrings[nth];
    if (s != undefined){
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScan(r, iter);
      editor.setCursorBufferPosition(bufferPosition);
    }
  },

  foldAll(currentEditor = undefined) {
    let editor;
    if (!(currentEditor instanceof TextEditor)) {
      currentEditor = undefined;
      editor = atom.workspace.getActiveTextEditor();
    } else {
      editor = currentEditor;
    }
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var iter = this.makeFoldIter(editor);
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScan(r, iter);
    }
    editor.setCursorBufferPosition(bufferPosition);
  },
  foldAll1st(currentEditor = undefined) {
    this.foldAllNthRegex(0,currentEditor)
  },
  foldAll2nd(currentEditor = undefined) {
    this.foldAllNthRegex(1,currentEditor)
  },
  foldAll3rd(currentEditor = undefined) {
    this.foldAllNthRegex(2,currentEditor)
  },
  foldAll4th(currentEditor = undefined) {
    this.foldAllNthRegex(3,currentEditor)
  },
  foldAll5th(currentEditor = undefined) {
    this.foldAllNthRegex(4,currentEditor)
  },
  foldAll6th(currentEditor = undefined) {
    this.foldAllNthRegex(5,currentEditor)
  },
  foldAll7th(currentEditor = undefined) {
    this.foldAllNthRegex(6,currentEditor)
  },
  foldAll8th(currentEditor = undefined) {
    this.foldAllNthRegex(7,currentEditor)
  },
  foldAll9th(currentEditor = undefined) {
    this.foldAllNthRegex(8,currentEditor)
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
    editor.setCursorBufferPosition(bufferPosition);
  },

  foldHere() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const bufferPosition = editor.getCursorBufferPosition();
    var row = bufferPosition.row;
    var c = bufferPosition.column;
    var iter = function(match) { // i don't use the make Iter function because i added a test here
      var range = match.range;
      if (match.match.length == 4) { //when the regex has 3 regions only the middle one will be folded
        var p1 = (range.start.column + match.match[1].length);
        var p2 = (range.end.column - match.match[3].length);
        range = new Range(new Point(range.start.row, p1), new Point(range.end.row, p2));
      };
      if (match.range.start.column <= c && match.range.end.column >= c) {
        editor.setSelectedBufferRange(range);
        editor.getLastSelection().fold();
      }
    };
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScanInRange(r, new Range(new Point(row, 0), new Point(row, Number.MAX_SAFE_INTEGER)), iter);
    }
  },

  unfoldAllNthRegex(nth) {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    var iter = function(match) {
      editor.destroyFoldsIntersectingBufferRange(match.range);
    };
    let s = this.regexStrings[nth];
    if(s != undefined){
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScan(r, iter);
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

  unfoldAll1st() {
    this.unfoldAllNthRegex(0,)
  },
  unfoldAll2nd() {
    this.unfoldAllNthRegex(1,)
  },
  unfoldAll3rd() {
    this.unfoldAllNthRegex(2,)
  },
  unfoldAll4th() {
    this.unfoldAllNthRegex(3,)
  },
  unfoldAll5th() {
    this.unfoldAllNthRegex(4,)
  },
  unfoldAll6th() {
    this.unfoldAllNthRegex(5,)
  },
  unfoldAll7th() {
    this.unfoldAllNthRegex(6,)
  },
  unfoldAll8th() {
    this.unfoldAllNthRegex(7,)
  },
  unfoldAll9th() {
    this.unfoldAllNthRegex(8,)
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
        // editor.destroyFoldsIntersectingBufferRange(Range(bufferPosition, bufferPosition));
        editor.destroyFoldsIntersectingBufferRange(match.range);
      }
    };
    for (let s of this.regexStrings) {
      let r = new RegExp(s[0], s[1]);
      buffer.backwardsScanInRange(r, new Range(new Point(row, 0), new Point(row, Number.MAX_SAFE_INTEGER)), iter);
    }
  },

  toggleHere() {
    const editor = atom.workspace.getActiveTextEditor();
    const bufferPosition = editor.getCursorBufferPosition();
    const r = new Range(bufferPosition,bufferPosition);
    const i = editor.displayLayer.foldsIntersectingBufferRange(r);
    if (i.length == 0) {
      this.foldHere(editor);
    } else {
      this.unfoldHere();
      // editor.destroyFoldsIntersectingBufferRange(r)
    }
  },

  toggleLine() {
    const editor = atom.workspace.getActiveTextEditor();
    const bufferPosition = editor.getCursorBufferPosition();
    const row = bufferPosition.row;
    const r = new Range(new Point(row, 0), Point(row,Number.MAX_SAFE_INTEGER));
    const i = editor.displayLayer.foldsIntersectingBufferRange(r);
    if (i.length == 0) {
      this.foldLine(editor);
    } else {
      this.unfoldLine();
      // editor.destroyFoldsIntersectingBufferRange(r)
    }
  },

  toggleAllNthRegex(nth) {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const r = new Range(new Point(0, 0), Point(buffer.getLastRow(),Number.MAX_SAFE_INTEGER));
    const i = editor.displayLayer.foldsIntersectingBufferRange(r);
    if (i.length == 0) {
      this.foldAllNthRegex(nth,editor);
    } else {
      this.unfoldAllNthRegex(nth);

      //i thought this would avoid the unfolding of other folds but it does not work like that.
      // editor.destroyFoldsIntersectingBufferRange(r);
    }
  },

  toggleAll() {
    const editor = atom.workspace.getActiveTextEditor();
    const buffer = editor.getBuffer();
    const r = new Range(new Point(0, 0), Point(buffer.getLastRow(),Number.MAX_SAFE_INTEGER));
    const i = editor.displayLayer.foldsIntersectingBufferRange(r);
    console.log(i);
    if (i.length == 0) {
      this.foldAll(editor);
    } else {
      this.unfoldAll();
      //i thought this would avoid the unfolding of other folds but it does not work like that.
      // editor.destroyFoldsIntersectingBufferRange(r);
    }
  },

  toggleAll1st() {
    this.toggleAllNthRegex(0)
  },
  toggleAll2nd() {
    this.toggleAllNthRegex(1)
  },
  toggleAll3rd() {
    this.toggleAllNthRegex(2)
  },
  toggleAll4th() {
    this.toggleAllNthRegex(3)
  },
  toggleAll5th() {
    this.toggleAllNthRegex(4)
  },
  toggleAll6th() {
    this.toggleAllNthRegex(5)
  },
  toggleAll7th() {
    this.toggleAllNthRegex(6)
  },
  toggleAll8th() {
    this.toggleAllNthRegex(7)
  },
  toggleAll9th() {
    this.toggleAllNthRegex(8)
  },


};
