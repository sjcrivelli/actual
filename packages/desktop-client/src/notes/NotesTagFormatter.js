"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesTagFormatter = NotesTagFormatter;
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var DesktopTaggedNotes_1 = require("./DesktopTaggedNotes");
var MobileTaggedNotes_1 = require("./MobileTaggedNotes");
function NotesTagFormatter(_a) {
    var notes = _a.notes, onNotesTagClick = _a.onNotesTagClick;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var words = notes.split(' ');
    return (<>
      {words.map(function (word, i, arr) {
            var separator = arr.length - 1 === i ? '' : ' ';
            if (word.includes('#') && word.length > 1) {
                var lastEmptyTag_1 = -1;
                // Treat tags in a single word as separate tags.
                // #tag1#tag2 => (#tag1)(#tag2)
                // not-a-tag#tag2#tag3 => not-a-tag(#tag2)(#tag3)
                return word.split('#').map(function (tag, ti) {
                    if (ti === 0) {
                        return tag;
                    }
                    if (!tag) {
                        lastEmptyTag_1 = ti;
                        return '#';
                    }
                    if (lastEmptyTag_1 === ti - 1) {
                        return "".concat(tag, " ");
                    }
                    lastEmptyTag_1 = -1;
                    var validTag = "#".concat(tag);
                    if (isNarrowWidth) {
                        return (<MobileTaggedNotes_1.MobileTaggedNotes key={"".concat(validTag).concat(ti)} content={validTag} tag={tag} separator={separator}/>);
                    }
                    else {
                        return (<DesktopTaggedNotes_1.DesktopTaggedNotes key={"".concat(validTag).concat(ti)} onPress={onNotesTagClick} content={validTag} tag={tag} separator={separator}/>);
                    }
                });
            }
            return "".concat(word).concat(separator);
        })}
    </>);
}
