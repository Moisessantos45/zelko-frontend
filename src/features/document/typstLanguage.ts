import { StreamLanguage } from '@codemirror/language';

export const typstLanguage = StreamLanguage.define({
  name: 'typst',
  startState() {
    return {
      inBlockComment: false,
      inString: false,
      inRawBlock: false,
      inMath: false,
    };
  },
  token(stream, state) {
    if (state.inBlockComment) {
      if (stream.match('*/')) {
        state.inBlockComment = false;
        return 'comment';
      }
      stream.next();
      return 'comment';
    }

    if (state.inRawBlock) {
      if (stream.match('```')) {
        state.inRawBlock = false;
        return 'monospace';
      }
      stream.next();
      return 'monospace';
    }

    if (state.inString) {
      if (stream.match('\\"')) {
        return 'string';
      }
      if (stream.match('"')) {
        state.inString = false;
        return 'string';
      }
      stream.next();
      return 'string';
    }

    if (stream.eatSpace()) return null;

    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }

    if (stream.match('/*')) {
      state.inBlockComment = true;
      return 'comment';
    }

    if (stream.match('```')) {
      state.inRawBlock = true;
      return 'monospace';
    }

    if (stream.match(/^`[^`]+`/)) {
      return 'monospace';
    }

    if (stream.match('"')) {
      state.inString = true;
      return 'string';
    }

    if (stream.sol() && stream.match(/^={1,6}\s+/)) {
      stream.skipToEnd();
      return 'heading';
    }

    if (stream.match(/^\$[^\$]+\$/)) {
      return 'special(variableName)';
    }

    if (stream.match(/^#(let|set|show|import|include|if|else|for|while|return|context|break|continue)\b/)) {
      return 'keyword';
    }

    if (stream.match(/^#[a-zA-Z_][a-zA-Z0-9_.-]*/)) {
      return 'keyword';
    }

    if (stream.match(/^<[a-zA-Z0-9_:-]+>/)) {
      return 'labelName';
    }

    if (stream.match(/^@[a-zA-Z0-9_:-]+/)) {
      return 'link';
    }

    if (stream.match(/^\*[^*]+\*/)) {
      return 'strong';
    }

    if (stream.match(/^_[^_]+_/)) {
      return 'emphasis';
    }

    if (stream.match(/^[0-9]+(\.[0-9]+)?(pt|mm|cm|in|em|%|deg|rad)?\b/)) {
      return 'number';
    }

    if (stream.sol() && stream.match(/^[-+]\s+/)) {
      return 'operator';
    }

    stream.next();
    return null;
  },
});
