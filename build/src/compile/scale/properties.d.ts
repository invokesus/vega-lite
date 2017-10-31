import { Channel } from '../../channel';
import { Config } from '../../config';
import { FieldDef } from '../../fielddef';
import { BarConfig, MarkDef } from '../../mark';
import { Domain, NiceTime, Scale, ScaleConfig, ScaleType } from '../../scale';
import { SortField, SortOrder } from '../../sort';
import { Model } from '../model';
import { ScaleComponentProps } from './component';
export declare function parseScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export declare function getDefaultValue(property: keyof Scale, channel: Channel, fieldDef: FieldDef<string>, sort: SortOrder | SortField<string>, scaleType: ScaleType, scalePadding: number, scalePaddingInner: number, specifiedDomain: Scale['domain'], markDef: MarkDef, config: Config): any;
export declare function parseNonUnitScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export declare function nice(scaleType: ScaleType, channel: Channel, fieldDef: FieldDef<string>): boolean | NiceTime;
export declare function padding(channel: Channel, scaleType: ScaleType, scaleConfig: ScaleConfig, fieldDef: FieldDef<string>, markDef: MarkDef, barConfig: BarConfig): number;
export declare function paddingInner(padding: number, channel: Channel, scaleConfig: ScaleConfig): number;
export declare function paddingOuter(padding: number, channel: Channel, scaleType: ScaleType, paddingInner: number, scaleConfig: ScaleConfig): number;
export declare function reverse(scaleType: ScaleType, sort: SortOrder | SortField<string>): boolean;
export declare function zero(channel: Channel, fieldDef: FieldDef<string>, specifiedScale: Domain): boolean;
