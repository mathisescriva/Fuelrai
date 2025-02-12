import { KID } from '../components/KIDManager/types';
import kidData from './kid.json';

export const defaultKidData: Omit<KID, 'id' | 'name' | 'url' | 'file'> = kidData;

