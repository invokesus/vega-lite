import {normalizeimputeProperties} from '../../impute';
import {ImputeSequence, ImputeTransform, isImputeSequence} from '../../transform';
import {duplicate} from '../../util';
import {VgFormulaTransform, VgImputeTransform, VgSignalRef, VgWindowTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

// TODO Rename to ImputeNode
export class ImputeTransformNode extends DataFlowNode {
  public clone() {
    return new ImputeTransformNode(this.parent, duplicate(this.transform));
  }

  public producedFields() {
    // typescript detects true as boolean type
    return {[this.transform.impute]: true as true};
  }

  constructor(parent: DataFlowNode, private transform: ImputeTransform) {
    super(parent);

  }

  private processSequence(keyvals: ImputeSequence): VgSignalRef {
    const {start, stop, step=1} = keyvals;
    return {signal: `sequence(${start}, ${stop}, ${step})`};
  }

  public static makeFromTransform(parent: DataFlowNode, imputeTransform: ImputeTransform): ImputeTransformNode {
    return new ImputeTransformNode (parent, imputeTransform);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: UnitModel) {
    const transformRepresentation = normalizeimputeProperties(model.encoding);
    if (transformRepresentation === undefined) {
      return null;
    }
    return new ImputeTransformNode(parent, transformRepresentation);
  }

  public assemble(): [VgImputeTransform] | [VgImputeTransform, VgWindowTransform, VgFormulaTransform] {
    const {impute, key, keyvals, method, groupby, value, frame} = this.transform;
    if (method !== 'value' && frame !== undefined) {
      const initialImpute: VgImputeTransform = {
        type: 'impute',
        field: impute,
        key,
        ...(keyvals ? {keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals}: {}),
        method: 'value',
        ...(groupby ? {groupby}: {}),
        value: null
      };

      const deriveNewField: VgWindowTransform = {
        type: 'window',
        as: ['derived_field'],
        ops: [method],
        fields: [impute],
        frame,
        ignorePeers: false,
        ...(groupby ? {groupby}: {})
      };

      const replaceOriginal: VgFormulaTransform = {
        type: 'formula',
        expr: `datum.${impute} === null ? datum.derived_field : datum.${impute}`,
        as: impute
      };

      return [initialImpute, deriveNewField, replaceOriginal];
    } else {
      return [{
        type: 'impute',
        field: impute,
        key,
        ...(keyvals ? {keyvals: isImputeSequence(keyvals) ? this.processSequence(keyvals) : keyvals}: {}),
        ...(method ? {method}: {}),
        ...(groupby ? {groupby}: {}),
        ...(value ? {value}: {})
      }];
    }

  }
}
