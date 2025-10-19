import { getNormalisedString } from '../../../shared/normalisation';
export function normalise(value) {
    if (!value) {
        return null;
    }
    return getNormalisedString(value);
}
