import React, { useState, useRef, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { send } from 'loot-core/platform/client/fetch';
import { type FormulaWidget } from 'loot-core/types/models';

import { FormulaEditor } from './formula/FormulaEditor';
import { QueryManager } from './formula/QueryManager';

import { EditablePageHeaderTitle } from '@desktop-client/components/EditablePageHeaderTitle';
import { MobileBackButton } from '@desktop-client/components/mobile/MobileBackButton';
import {
  MobilePageHeader,
  Page,
  PageHeader,
} from '@desktop-client/components/Page';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { useFormulaExecution } from '@desktop-client/hooks/useFormulaExecution';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useWidget } from '@desktop-client/hooks/useWidget';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';

export function Formula() {
  const params = useParams();
  const { data: widget, isLoading } = useWidget<FormulaWidget>(
    params.id ?? '',
    'formula-card',
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <FormulaInner widget={widget} />;
}

type FormulaInnerProps = {
  widget?: FormulaWidget;
};

function FormulaInner({ widget }: FormulaInnerProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isNarrowWidth } = useResponsive();

  const queriesRef = useRef(widget?.meta?.queries || {});
  const [queriesVersion, setQueriesVersion] = useState(0);

  const [formula, setFormula] = useState(
    widget?.meta?.formula || '=SUM(1, 2, 3)',
  );

  const title = widget?.meta?.name || t('Formula');

  const {
    result,
    isLoading: isExecuting,
    error,
  } = useFormulaExecution(formula, queriesRef.current, queriesVersion);

  const handleQueriesChange = useCallback(
    (newQueries: typeof queriesRef.current) => {
      queriesRef.current = newQueries;
      setQueriesVersion(v => v + 1);
    },
    [],
  );

  const onSaveWidgetName = async (newName: string) => {
    if (!widget) {
      dispatch(
        addNotification({
          notification: {
            type: 'error',
            message: t('Cannot save: No widget available.'),
          },
        }),
      );
      return;
    }

    const name = newName || t('Formula');
    await send('dashboard-update-widget', {
      id: widget.id,
      meta: {
        ...(widget.meta ?? {}),
        name,
        formula,
        queries: queriesRef.current,
      },
    });
  };

  async function onSaveWidget() {
    if (!widget) {
      dispatch(
        addNotification({
          notification: {
            type: 'error',
            message: t('Cannot save: No widget available.'),
          },
        }),
      );
      return;
    }

    await send('dashboard-update-widget', {
      id: widget.id,
      meta: {
        ...(widget.meta ?? {}),
        formula,
        queries: queriesRef.current,
      },
    });

    dispatch(
      addNotification({
        notification: {
          type: 'message',
          message: t('Dashboard widget successfully saved.'),
        },
      }),
    );
  }

  const displayValue = useCallback(() => {
    if (isExecuting) return t('Calculating...');
    if (error) return `${error}`;
    if (result === null || result === undefined) return '0';

    if (typeof result === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(result);
    }

    return String(result);
  }, [result, isExecuting, error, t])();

  return (
    <Page
      header={
        isNarrowWidth ? (
          <MobilePageHeader
            title={title}
            leftContent={
              <MobileBackButton onPress={() => navigate('/reports')} />
            }
          />
        ) : (
          <PageHeader
            title={
              widget ? (
                <EditablePageHeaderTitle
                  title={title}
                  onSave={onSaveWidgetName}
                />
              ) : (
                title
              )
            }
          />
        )
      }
      padding={0}
    >
      {widget && (
        <View
          style={{
            padding: 20,
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            background: theme.pageBackground,
          }}
        >
          <Button
            variant="primary"
            onPress={onSaveWidget}
            style={{ width: 100 }}
          >
            <Trans>Save widget</Trans>
          </Button>
        </View>
      )}
      <View
        style={{
          width: '100%',
          height: '100%',
          background: theme.pageBackground,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <View
            style={{
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: theme.pageTextSubdued,
                marginBottom: 8,
              }}
            >
              <Trans>Result:</Trans>
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: error ? theme.errorText : theme.pageText,
              }}
            >
              {displayValue}
            </div>
          </View>

          <View
            style={{
              flex: 1,
              minHeight: 300,
              margin: 20,
              overflow: 'hidden',
            }}
          >
            <FormulaEditor
              value={formula}
              onChange={setFormula}
              mode="query"
              queries={queriesRef.current}
              singleLine={false}
              showLineNumbers={true}
            />
          </View>
        </View>

        <View
          style={{
            overflowY: 'auto',
          }}
        >
          <QueryManager
            queries={queriesRef.current}
            onQueriesChange={handleQueriesChange}
          />
        </View>
      </View>
    </Page>
  );
}
