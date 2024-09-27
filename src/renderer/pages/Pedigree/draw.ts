import { DisplayObject } from '@antv/g-lite';
import { Badge, ExtensionCategory, Graph, Label, Rect, RectStyleProps, register } from '@antv/g6';

/**
 * Draw a chart node with different ui based on the zoom level.
 */
class ChartNode extends Rect {
  get data(): any {
    return this.context.model.getElementDataById(this.id).data;
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

export function drawChart(dom: HTMLDivElement, data: any) {
  const graph = new Graph({
    container: dom,
    data: data,
    background: '#ffffff',
    autoResize: true,
    node: {
      type: 'chart-node',
      style: {
        labelPlacement: 'center',
        lineWidth: 1,
        ports: [{ placement: 'top' }, { placement: 'bottom' }],
        radius: 2,
        shadowBlur: 10,
        shadowColor: '#e0e0e0',
        shadowOffsetX: 3,
        size: [100, 60],
        stroke: '#C0C0C0',
        fill: '#ffffff',
      },
    },
    edge: {
      type: 'polyline',
      style: {
        router: {
          type: 'orth',
        },
        stroke: '#C0C0C0',
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
  });

  graph.render();
  return graph;
}
