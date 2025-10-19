import { useState } from 'react';
export function useContextMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [asContextMenu, setAsContextMenu] = useState(false);
    const [position, setPosition] = useState({ crossOffset: 0, offset: 0 });
    const handleContextMenu = e => {
        e.preventDefault();
        setAsContextMenu(true);
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            crossOffset: e.clientX - rect.left,
            offset: e.clientY - rect.bottom,
        });
        setMenuOpen(true);
    };
    const resetPosition = (crossOffset = 0, offset = 0) => {
        setPosition({ crossOffset, offset });
    };
    return {
        menuOpen,
        setMenuOpen: (open) => {
            setMenuOpen(open);
            setAsContextMenu(false);
        },
        position,
        handleContextMenu,
        resetPosition,
        asContextMenu,
    };
}
