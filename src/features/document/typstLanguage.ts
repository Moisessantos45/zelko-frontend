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

    // Line comment
    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }

    // Block comment start
    if (stream.match('/*')) {
      state.inBlockComment = true;
      return 'comment';
    }

    // Raw block
    if (stream.match('```')) {
      state.inRawBlock = true;
      return 'monospace';
    }

    // Inline raw code
    if (stream.match(/^`[^`]+`/)) {
      return 'monospace';
    }

    // String literal
    if (stream.match('"')) {
      state.inString = true;
      return 'string';
    }

    // Headings: = Titulo, == Subtitulo
    if (stream.sol() && stream.match(/^={1,6}\s+/)) {
      stream.skipToEnd();
      return 'heading';
    }

    // Inline Math: $ E = mc^2 $
    if (stream.match(/^\$[^\$]+\$/)) {
      return 'special(variableName)';
    }

    // Keywords in Typst code mode
    if (stream.match(/^#(let|set|show|import|include|if|else|for|while|return|context|break|continue)\b/)) {
      return 'keyword';
    }

    // Functions / Identifiers starting with #
    if (stream.match(/^#[a-zA-Z_][a-zA-Z0-9_.-]*/)) {
      return 'keyword';
    }

    // Labels <label>
    if (stream.match(/^<[a-zA-Z0-9_:-]+>/)) {
      return 'labelName';
    }

    // References @ref
    if (stream.match(/^@[a-zA-Z0-9_:-]+/)) {
      return 'link';
    }

    // Bold text *bold*
    if (stream.match(/^\*[^*]+\*/)) {
      return 'strong';
    }

    // Italic text _italic_
    if (stream.match(/^_[^_]+_/)) {
      return 'emphasis';
    }

    // Numbers & CSS/Typst dimensions
    if (stream.match(/^[0-9]+(\.[0-9]+)?(pt|mm|cm|in|em|%|deg|rad)?\b/)) {
      return 'number';
    }

    // Bullet lists
    if (stream.sol() && stream.match(/^[-+]\s+/)) {
      return 'operator';
    }

    stream.next();
    return null;
  },
});
