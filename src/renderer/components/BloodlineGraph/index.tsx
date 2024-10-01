import { DisplayObject } from '@antv/g-lite';
import { useImperativeHandle, useState } from 'react';
import {
  ExtensionCategory,
  Fullscreen,
  Graph,
  GraphData,
  IElementEvent,
  Label,
  LabelStyleProps,
  NodeData,
  Rect,
  register,
} from '@antv/g6';
import React, { useEffect, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Api } from '../../services';

/**
 * 自定义节点
 */
class ChartNode extends Rect {
  get data(): any {
    return this.context.model.getElementDataById(this.id).data;
  }

  protected getLabelStyle(): LabelStyleProps {
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

  getGenerationStyle(): DisplayObject['attributes'] {
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

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);

    const spouseSurnameStyle = this.getSpouseSurnameStyle();
    this.upsert('spouseSurname', Label, spouseSurnameStyle, container);

    const generationStyle = this.getGenerationStyle();
    this.upsert('generation', Label, generationStyle, container);
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

// 格式化数据
function formatData(data: API.DataModel.Member[]): GraphData {
  const nodes: GraphData['nodes'] = data
    .map((node) => {
      return {
        id: String(node.id),
        data: { ...node },
      };
    })
    .filter((item) => !!item);
  const edges: GraphData['edges'] = data
    .map((node) => {
      if (node.parentId === -1) {
        return null;
      }
      return {
        source: String(node.parentId),
        target: String(node.id),
      };
    })
    .filter((item) => !!item);
  return { nodes, edges };
}

interface BloodlineGraphProps {
  rootId?: number;
}

export const BloodlineGraph = React.forwardRef<
  { graph?: Graph },
  BloodlineGraphProps
>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const [graphInstance, setGraphInstance] = useState<Graph>();
  const navigate = useNavigate();

  const [data, setData] = useState<GraphData>({ nodes: [], edges: [] });

  function fetchData() {
    Api.queryMemberTree(props.rootId).then((data) => {
      setData(formatData(data));
    });
  }

  useEffect(() => {
    fetchData();
  }, [props.rootId]);

  useImperativeHandle(ref, () => {
    return {
      graph: graphInstance,
    };
  });

  useEffectOnce(() => {
    if (!container.current) return;

    const graph = new Graph({
      container: container.current,
      data: { nodes: [], edges: [] },
      background: '#ffffff',
      autoResize: true,
      animation: false,
      node: {
        type: 'chart-node',
        style(data) {
          // 0 3 6
          const index = 6;
          const fillColor = `l(45) 0:${uLightColors[index]} 1:${uDarkColors[index]}`;
          const strokeColor = `l(45) 0:${uDarkColors[index]} 1:${uLightColors[index]}`;
          return {
            cursor: 'pointer',
            labelPlacement: 'center',
            ports: [{ placement: 'top' }, { placement: 'bottom' }],
            radius: 5,
            size: [100, 60],
            fill: fillColor,
            lineWidth: 1,
            stroke: strokeColor,
          };
        },
      },
      edge: {
        type: 'polyline',
        style(data) {
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
      },
      behaviors: [
        {
          type: 'drag-canvas',
          range: Infinity,
        },
      ],
      plugins: [
        function () {
          return {
            type: 'watermark',
            key: 'watermark',
            width: 200,
            height: 100,
            opacity: 0.05,
            rotate: Math.PI / 12,
            text: '楊氏家谱',
          };
        },
        function () {
          return {
            type: 'tooltip',
            key: 'tooltip',
            trigger: 'hover',
            enable: (e: IElementEvent) => e.targetType === 'node',
            enterable: false,
            getContent: (event: IElementEvent, items: NodeData[]) => {
              const data = (items[0]?.data || {}) as API.DataModel.Member;
              if (!data) return '';
              return renderToString(
                <div>
                  <div>别名: {data.alias}</div>
                  <div>地址: {data.address}</div>
                  <div>职业: {data.career}</div>
                  <div>职位: {data.position}</div>
                </div>,
              );
            },
          };
        },
        function () {
          return {
            type: 'fullscreen',
            key: 'fullscreen',
            width: 200,
            height: 100,
            opacity: 0.05,
            rotate: Math.PI / 12,
            text: '楊氏家谱',
          };
        },
        function () {
          return {
            type: 'toolbar',
            key: 'toolbar',
            position: 'top-right',
            style: {
              backgroundColor: '#cccccc',
            },
            onClick: (item: string) => {
              if (item === 'export') {
                this.toDataURL({
                  encoderOptions: 1,
                  mode: 'overall',
                  type: 'image/png',
                }).then((url) => {
                  console.log(url);
                });
              } else if (item === 'zoom-in') {
                this.zoomBy(1.5);
              } else if (item === 'zoom-out') {
                this.zoomBy(0.5);
              } else if (item === 'reset') {
                this.getPluginInstance<Fullscreen>('fullscreen')?.request();
              }
            },
            getItems: () => {
              // G6 内置了 9 个 icon，分别是 zoom-in、zoom-out、redo、undo、edit、delete、auto-fit、export、reset
              return [
                { id: 'zoom-in', value: 'zoom-in' },
                { id: 'zoom-out', value: 'zoom-out' },
                { id: 'export', value: 'export' },
                { id: 'reset', value: 'reset' },
              ];
            },
          };
        },
      ],
    });
    setGraphInstance(graph);

    graph.on('node:click', (event) => {
      console.log(event.type);
      const { target } = event;
      navigate(`/member/detail/${target.id}`);
    });

    return () => {
      graph.destroy();
    };
  });

  useEffect(() => {
    if (data && graphInstance) {
      graphInstance.setData(data);
      graphInstance.render().then(() => {
        // 聚焦到第一个节点
        const firstNode = data?.nodes?.[0];
        if (firstNode && firstNode.id) {
          const node = graphInstance.getNodeData(firstNode.id);
          if (node) graphInstance.focusElement(node.id);
        }
      });
    }
  }, [props, graphInstance]);

  return <div ref={container} style={{ width: '100%', height: '80vh' }}></div>;
});
