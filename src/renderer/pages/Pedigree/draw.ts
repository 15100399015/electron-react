import { DisplayObject } from '@antv/g-lite';
import {
  Badge,
  ExtensionCategory,
  Graph,
  IconStyleProps,
  Label,
  Rect,
  RectStyleProps,
  register,
} from '@antv/g6';

/**
 * 自定义节点
 */
class ChartNode extends Rect {
  get data(): any {
    return this.context.model.getElementDataById(this.id).data;
  }

  protected getIconStyle(
    attributes: Required<RectStyleProps>,
  ): false | IconStyleProps {
    return {
      ...attributes,
      width: 40,
      height: 40,
      transform: 'translate(0, 0)',
    };
  }

  getLabelStyle() {
    const text = this.data.name;
    return {
      text,
      fill: '#2078B4',
      fontSize: 14,
      fontWeight: 400,
      textAlign: 'left',
      transform: 'translate(-45, -15)',
    };
  }

  getPositionStyle(): DisplayObject['attributes'] {
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

  drawPositionShape(attributes: Required<RectStyleProps>, container: this) {
    const positionStyle = this.getPositionStyle();

    this.upsert('position', Label, positionStyle, container);
  }

  getStatusStyle(): DisplayObject['attributes'] {
    const text = `${this.data.generation}世代`;
    return {
      text: text,
      fontSize: 8,
      fontWeight: 400,
      fill: '#343f4a',
      textAlign: 'left',
      transform: 'translate(-45, 13)',
    };
  }

  drawStatusShape(attributes: Required<RectStyleProps>, container: this) {
    const statusStyle = this.getStatusStyle();
    this.upsert('status', Badge, statusStyle, container);
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);

    this.drawPositionShape(attributes, container);

    this.drawStatusShape(attributes, container);
  }
}

register(ExtensionCategory.NODE, 'chart-node', ChartNode);

const lightColors = [
  '#8FE9FF',
  '#87EAEF',
  '#FFC9E3',
  '#A7C2FF',
  '#FFA1E3',
  '#FFE269',
  '#BFCFEE',
  '#FFA0C5',
  '#D5FF86',
];
const darkColors = [
  '#7DA8FF',
  '#44E6C1',
  '#FF68A7',
  '#7F86FF',
  '#AE6CFF',
  '#FF5A34',
  '#5D7092',
  '#FF6565',
  '#6BFFDE',
];
const uLightColors = [
  '#CFF6FF',
  '#BCFCFF',
  '#FFECF5',
  '#ECFBFF',
  '#EAD9FF',
  '#FFF8DA',
  '#DCE2EE',
  '#FFE7F0',
  '#EEFFCE',
];
const uDarkColors = [
  '#CADBFF',
  '#A9FFEB',
  '#FFC4DD',
  '#CACDFF',
  '#FFD4F2',
  '#FFD3C9',
  '#EBF2FF',
  '#FFCBCB',
  '#CAFFF3',
];

const gColors: string[] = [];
const ugColors: string[] = [];
lightColors.forEach((color, i) => {
  gColors.push('l(45) 0:' + color + ' 1:' + darkColors[i]);
});
uLightColors.forEach((color, i) => {
  ugColors.push('l(45) 0:' + color + ' 1:' + uDarkColors[i]);
});

export function drawChart(dom: HTMLDivElement, data: any) {
  const graph = new Graph({
    container: dom,
    data: data,
    background: '#ffffff',
    autoResize: true,
    node: {
      type: 'chart-node',
      style: (data) => {
        // 0 3 6
        const strokeColor = ugColors[0];
        return {
          labelPlacement: 'center',
          // ports: [{ placement: 'top' }, { placement: 'bottom' }],
          radius: 5,
          size: [100, 60],
          fill: strokeColor,
          lineWidth: 1,
          stroke: 'l(45) 0:#CADBFF 1:#CFF6FF',
          icon: true,
          iconSrc:
            'https://gw.alipayobjects.com/zos/basement_prod/012bcf4f-423b-4922-8c24-32a89f8c41ce.svg',
        };
      },
    },
    edge: {
      type: 'polyline',
      style: (data) => {
        return {
          router: { type: 'orth' },
          endArrow: true,
          endArrowType: 'vee',
          endArrowSize: 5,
          radius: 5,
          lineWidth: 2,
          stroke: '#cccccc',
        };
      },
    },
    layout: {
      type: 'dagre',
      nodeSize: [100, 60],
      animation: false,
    },
    autoFit: 'center',
    animation: false,
    behaviors: [
      {
        type: 'zoom-canvas',
      },
      {
        type: 'drag-canvas',
        range: Infinity,
      },
    ],
    plugins: [
      {
        type: 'watermark',
        width: 200,
        height: 100,
        opacity: 0.05,
        rotate: Math.PI / 12,
        text: '楊氏家谱',
      },

      {
        type: 'toolbar',
        key: 'toolbar',
        position: 'top-right',
        onClick: (item) => {
          if (item === 'export') {
            graph
              .toDataURL({
                encoderOptions: 1,
                mode: 'overall',
                type: 'image/png',
              })
              .then((url) => {
                console.log(url);
              });
          } else if (item === 'reset') {
          }
        },
        getItems: () => {
          // G6 内置了 9 个 icon，分别是 zoom-in、zoom-out、redo、undo、edit、delete、auto-fit、export、reset
          return [
            { id: 'zoom-in', value: 'zoom-in' },
            { id: 'zoom-out', value: 'zoom-out' },
            { id: 'redo', value: 'redo' },
            { id: 'undo', value: 'undo' },
            { id: 'edit', value: 'edit' },
            { id: 'delete', value: 'delete' },
            { id: 'auto-fit', value: 'auto-fit' },
            { id: 'export', value: 'export' },
            { id: 'reset', value: 'reset' },
          ];
        },
      },
    ],
  });

  graph.render();
  return graph;
}
