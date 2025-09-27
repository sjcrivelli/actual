import { GridList, GridListItem } from 'react-aria-components';
import { Trans } from 'react-i18next';

import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { type PayeeEntity } from 'loot-core/types/models';

import { PayeesListItem } from './PayeesListItem';

import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';

type PayeesListProps = {
  payees: PayeeEntity[];
  ruleCounts: Map<string, number>;
  isLoading?: boolean;
  onPayeePress: (payee: PayeeEntity) => void;
  onPayeeDelete?: (payee: PayeeEntity) => void;
  onPayeeEdit?: (payee: PayeeEntity) => void;
};

export function PayeesList({
  payees,
  ruleCounts,
  isLoading = false,
  onPayeePress,
  onPayeeDelete,
  onPayeeEdit,
}: PayeesListProps) {
  if (isLoading && payees.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 100,
        }}
      >
        <AnimatedLoading style={{ width: 25, height: 25 }} />
      </View>
    );
  }

  if (payees.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: theme.pageTextSubdued,
            textAlign: 'center',
          }}
        >
          <Trans>No payees found.</Trans>
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, paddingBottom: MOBILE_NAV_HEIGHT, overflow: 'auto' }}
    >
      <GridList
        className="relative flex-1 overflow-auto"
        aria-label="Payees"
        items={payees}
      >
        {payee => (
          <GridListItem key={payee.id} id={payee.id} textValue={payee.name}>
            <PayeesListItem
              payee={payee}
              ruleCount={ruleCounts.get(payee.id) ?? 0}
              onPress={() => onPayeePress(payee)}
              onDelete={onPayeeDelete ? () => onPayeeDelete(payee) : undefined}
              onEdit={onPayeeEdit ? () => onPayeeEdit(payee) : undefined}
            />
          </GridListItem>
        )}
      </GridList>
      {isLoading && (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 20,
          }}
        >
          <AnimatedLoading style={{ width: 20, height: 20 }} />
        </View>
      )}
    </View>
  );
}
