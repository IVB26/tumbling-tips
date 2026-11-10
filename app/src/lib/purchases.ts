import { PURCHASES_ENABLED } from '../config';
import { money } from './player';

/** What to show where a price used to be. Paid items show "Coming soon" while purchases are off. */
export const priceLabel = (price: number, owned: boolean, enabled = PURCHASES_ENABLED): string =>
  owned ? 'Owned' : price === 0 ? 'Free' : enabled ? money(price) : 'Coming soon';

/** Whether a Buy button may be shown for this item. */
export const canBuy = (price: number, owned: boolean, enabled = PURCHASES_ENABLED): boolean => !owned && price > 0 && enabled;

/** Free items can always be added to the library. */
export const canGetFree = (price: number, owned: boolean): boolean => !owned && price === 0;
