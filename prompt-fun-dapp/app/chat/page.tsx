import { CopilotChat } from "@/components/copilot-chat"
import { Navigation } from "@/components/navigation"

export default function Chat() {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 md:ml-64">
        <CopilotChat />
      </main>
    </div>
  )
}
