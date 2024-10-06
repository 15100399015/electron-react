import { DisplayObject } from '@antv/g-lite';
import {
  ExtensionCategory,
  Label,
  LabelStyleProps,
  Rect,
  register,
  Badge,
  RectStyleProps,
} from '@antv/g6';
import { uColorTheme } from '../../constant';

function truncateString(str?: unknown) {
  if (typeof str === 'string' && str.length > 9) {
    return str.slice(0, 9) + '...';
  } else {
    return str;
  }
}

function toG6Gradation(colors: string[]) {
  return `l(45) 0:${colors[0]} 1:${colors[1]}`;
}

/**
 * 自定义节点
 */
class ChartNode extends Rect {
  get data(): API.DataModel.Member {
    return this.context.model.getElementDataById(this.id).data!;
  }

  protected getKeyStyle(attributes: Required<RectStyleProps>) {
    const colors = uColorTheme[this.data.highlight || 7];
    const fillColor = toG6Gradation([...colors]);
    const strokeColor = toG6Gradation([...colors].reverse());
    return {
      ...super.getKeyStyle(attributes),
      fill: fillColor,
      stroke: strokeColor,
      radius: 5,
      lineWidth: 1,
    };
  }

  protected getLabelStyle(): LabelStyleProps {
    const text = this.data.name!;
    return {
      text,
      fill: '#2078B4',
      fontSize: 14,
      fontWeight: 400,
      textAlign: 'left',
      transform: 'translate(-45, -15)',
    };
  }

  getSpouseSurnameStyle(): DisplayObject['attributes'] {
    const text = `${this.data.spouseSurname || '*'}氏`;
    return {
      text: text,
      fontSize: 8,
      fontWeight: 400,
      fill: '#343f4a',
      textAlign: 'left',
      transform: 'translate(-45, 0)',
    };
  }

  getRemarkStyle(): DisplayObject['attributes'] {
    const text = `备注：${truncateString(this.data.remark) || ''}`;
    return {
      text: text,
      fontSize: 5,
      fontWeight: 400,
      fill: '#343f4a',
      textAlign: 'left',
      transform: 'translate(-45, 20)',
    };
  }

  getGenerationStyle(): DisplayObject['attributes'] {
    const text = `${this.data.generation}代`;
    return {
      text: text,
      fontSize: 8,
      fontWeight: 400,
      fill: '#343f4a',
      textAlign: 'left',
      transform: `translate(${42 - text.length * 8}, -18)`,
      backgroundFill: `#ffffff`,
      padding: [1, 4],
    };
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);

    const spouseSurnameStyle = this.getSpouseSurnameStyle();
    this.upsert('spouseSurname', Label, spouseSurnameStyle, container);

    const remarkStyle = this.getRemarkStyle();
    this.upsert('remark', Label, remarkStyle, container);

    const generationStyle = this.getGenerationStyle();
    this.upsert('generation', Badge, generationStyle, container);
  }
}

// 注册自定义 g6 节点
register(ExtensionCategory.NODE, 'chart-node', ChartNode);
