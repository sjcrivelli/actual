import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { DesktopTaggedNotes } from './DesktopTaggedNotes';
import { MobileTaggedNotes } from './MobileTaggedNotes';
export function NotesTagFormatter({ notes, onNotesTagClick, }) {
    const { isNarrowWidth } = useResponsive();
    const words = notes.split(' ');
    return (_jsx(_Fragment, { children: words.map((word, i, arr) => {
            const separator = arr.length - 1 === i ? '' : ' ';
            if (word.includes('#') && word.length > 1) {
                let lastEmptyTag = -1;
                // Treat tags in a single word as separate tags.
                // #tag1#tag2 => (#tag1)(#tag2)
                // not-a-tag#tag2#tag3 => not-a-tag(#tag2)(#tag3)
                return word.split('#').map((tag, ti) => {
                    if (ti === 0) {
                        return tag;
                    }
                    if (!tag) {
                        lastEmptyTag = ti;
                        return '#';
                    }
                    if (lastEmptyTag === ti - 1) {
                        return `${tag} `;
                    }
                    lastEmptyTag = -1;
                    const validTag = `#${tag}`;
                    if (isNarrowWidth) {
                        return (_jsx(MobileTaggedNotes, { content: validTag, tag: tag, separator: separator }, `${validTag}${ti}`));
                    }
                    else {
                        return (_jsx(DesktopTaggedNotes, { onPress: onNotesTagClick, content: validTag, tag: tag, separator: separator }, `${validTag}${ti}`));
                    }
                });
            }
            return `${word}${separator}`;
        }) }));
}
