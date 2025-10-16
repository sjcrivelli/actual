import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { View } from '@actual-app/components/view';

import { type FormulaWidget } from 'loot-core/types/models';

import { FormulaResult } from '@desktop-client/components/reports/FormulaResult';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { ReportCardName } from '@desktop-client/components/reports/ReportCardName';
import { useFormulaExecution } from '@desktop-client/hooks/useFormulaExecution';

type FormulaCardProps = {
  widgetId: string;
  isEditing?: boolean;
  meta?: FormulaWidget['meta'];
  onMetaChange: (newMeta: FormulaWidget['meta']) => void;
  onRemove: () => void;
};

export function FormulaCard({
  widgetId,
  isEditing,
  meta = {},
  onMetaChange,
  onRemove,
}: FormulaCardProps) {
  const { t } = useTranslation();
  const [nameMenuOpen, setNameMenuOpen] = useState(false);

  const formula = meta?.formula || '=SUM(1, 2, 3)';
  const fontSize = meta?.fontSize;

  const { result, isLoading, error } = useFormulaExecution(
    formula,
    meta?.queries || {},
    meta?.queriesVersion,
  );

  return (
    <ReportCard
      isEditing={isEditing}
      disableClick={nameMenuOpen}
      to={`/reports/formula/${widgetId}`}
      menuItems={[
        {
          name: 'rename',
          text: t('Rename'),
        },
        {
          name: 'remove',
          text: t('Remove'),
        },
      ]}
      onMenuSelect={item => {
        switch (item) {
          case 'rename':
            setNameMenuOpen(true);
            break;
          case 'remove':
            onRemove();
            break;
          default:
            console.warn(`Unrecognized menu selection: ${item}`);
            break;
        }
      }}
    >
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <View style={{ flexGrow: 0, flexShrink: 0, padding: 20 }}>
          <ReportCardName
            name={meta?.name || t('Formula')}
            isEditing={nameMenuOpen}
            onChange={newName => {
              onMetaChange({
                ...meta,
                name: newName,
              });
              setNameMenuOpen(false);
            }}
            onClose={() => setNameMenuOpen(false)}
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            flexShrink: 1,
          }}
        >
          <FormulaResult
            value={result}
            error={error}
            loading={isLoading}
            initialFontSize={fontSize}
            fontSizeChanged={newSize => {
              onMetaChange({
                ...meta,
                fontSize: newSize,
              });
            }}
            animate={isEditing ?? false}
          />
        </View>
      </View>
    </ReportCard>
  );
}
