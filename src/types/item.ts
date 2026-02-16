export interface WheelItem {
  id: string;
  label: string;
  weight: number;
  enabled: boolean;
  removeAfterSpin: boolean;
  cooldownSpins: number;
  cooldownTimeMs: number;
  cooldownSpinsRemaining: number;
  cooldownExpiresAt: number;
  temporarilyEliminated: boolean;
}

export type WheelItemConfig = Pick<
  WheelItem,
  'id' | 'label' | 'weight' | 'enabled' | 'removeAfterSpin' | 'cooldownSpins' | 'cooldownTimeMs'
>;

export const DEFAULT_WHEEL_ITEM: Omit<WheelItem, 'id' | 'label'> = {
  weight: 1,
  enabled: true,
  removeAfterSpin: false,
  cooldownSpins: 0,
  cooldownTimeMs: 0,
  cooldownSpinsRemaining: 0,
  cooldownExpiresAt: 0,
  temporarilyEliminated: false,
};
