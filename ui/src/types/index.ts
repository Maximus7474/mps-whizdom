export * from './letter-grid';

export type DeviceType = 'phone' | 'tablet';

export interface IPageProps {
    device: DeviceType;
}
