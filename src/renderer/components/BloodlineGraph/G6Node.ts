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

/**
 * 自定义节点
 */
class ChartNode extends Rect {
  get data(): API.DataModel.Member {
    return this.context.model.getElementDataById(this.id).data!;
  }

  protected getKeyStyle(attributes: Required<RectStyleProps>) {
    return { ...super.getKeyStyle(attributes) };
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

  getDateStyle(): DisplayObject['attributes'] {
    const text = `${this.data.birthDate || '***'}至${this.data.deathDate || '***'}`;
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
      backgroundFill: `l(45) 0:#ffffff 1:#EBF2FF`,
      padding: [0, 4],
    };
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);

    const spouseSurnameStyle = this.getSpouseSurnameStyle();
    this.upsert('spouseSurname', Label, spouseSurnameStyle, container);

    const generationStyle = this.getGenerationStyle();
    this.upsert('generation', Badge, generationStyle, container);

    const dateStyle = this.getDateStyle();
    this.upsert('date', Label, dateStyle, container);
  }
}

// 注册自定义 g6 节点
register(ExtensionCategory.NODE, 'chart-node', ChartNode);
