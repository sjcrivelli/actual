import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { View } from '@actual-app/components/view';
import { useAuth } from './AuthProvider';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useSelector } from '@desktop-client/redux';
export const ProtectedRoute = ({ element, permission, validateOwner, }) => {
    const { hasPermission } = useAuth();
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [cloudFileId] = useMetadataPref('cloudFileId');
    const allFiles = useSelector(state => state.budgetfiles.allFiles || []);
    const remoteFiles = allFiles.filter((f) => f.state === 'remote' || f.state === 'synced' || f.state === 'detached');
    const currentFile = remoteFiles.find(f => f.cloudFileId === cloudFileId);
    const userData = useSelector(state => state.user.data);
    useEffect(() => {
        const hasRequiredPermission = hasPermission(permission);
        setPermissionGranted(hasRequiredPermission);
        if (!hasRequiredPermission && validateOwner) {
            if (currentFile) {
                setPermissionGranted(currentFile.usersWithAccess.some(u => u.userId === userData?.userId));
            }
        }
    }, [
        cloudFileId,
        permission,
        validateOwner,
        hasPermission,
        currentFile,
        userData,
    ]);
    return permissionGranted ? (element) : (_jsx(View, { style: {
            margin: '50px',
        }, children: _jsx("h3", { children: _jsx(Trans, { children: "You don\u2019t have permission to view this page" }) }) }));
};
