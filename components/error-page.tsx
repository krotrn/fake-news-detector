import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

type ErrorCardProps = {
  errorMessage: string
}

export default function ErrorCard({ errorMessage }: ErrorCardProps) {
  return (
    <Card className="border border-red-500 bg-red-50">
      <CardHeader className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <CardTitle className="text-red-500 text-lg">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-600">{errorMessage}</p>
      </CardContent>
    </Card>
  )
}
