import type { PluginConfig } from 'svgo'
import { optimize } from 'svgo'

const greenToCurrentColorPlugin = {
  name: 'greenToCurrentColor',
  type: 'visitor',
  fn: () => {
    return {
      element: {
        enter: (node: any) => {
          if (node.attributes.fill === '#0f0' || node.attributes.fill === '#00ff00')
            node.attributes.fill = 'currentColor'

          if (node.attributes.stroke === '#0f0' || node.attributes.stroke === '#00ff00')
            node.attributes.stroke = 'currentColor'
        },
      },
    }
  },
}

const plugins: PluginConfig[] = [
  'preset-default',
  { name: 'removeAttrs', params: { attrs: 'viewBox' } },
  { name: 'mergePaths', params: { force: true } },
  greenToCurrentColorPlugin,
]

export function optimizeSvg(svg: string): string {
  return optimize(svg, { multipass: true, plugins }).data
}
