import { Card } from '#/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1>Yolo les kikis!</h1>
      <Card>
        <h1>Yolo</h1>
      </Card>
    </div>
  )
}
