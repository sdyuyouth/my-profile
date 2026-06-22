import type { StackLayer } from "@/data/site"

type Props = {
  layers: StackLayer[]
  projectId: string
}

export function TechLanes({ layers, projectId }: Props) {
  return (
    <div
      className="tech-lanes"
      style={{ "--lane-count": layers.length } as React.CSSProperties}
    >
      {layers.map((layer) => (
        <div key={`${projectId}-${layer.layer}`} className="tech-lanes__col">
          <div className="tech-lanes__head">
            <span className="tech-lanes__mark" aria-hidden />
            <span className="tech-lanes__label">{layer.layer}</span>
          </div>
          <ul className="tech-lanes__items">
            {layer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
