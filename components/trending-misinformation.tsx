import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, HelpCircle, ThumbsDown, ThumbsUp } from "lucide-react"
import Link from "next/link"

export default function TrendingMisinformation() {
  const trendingItems = [
    {
      id: 1,
      title: "Scientists discover new planet that can sustain human life",
      source: "Science Daily",
      date: "2 hours ago",
      status: "fake",
      votes: { up: 24, down: 156 },
    },
    {
      id: 2,
      title: "New study links common food additive to health concerns",
      source: "Health News Network",
      date: "5 hours ago",
      status: "questionable",
      votes: { up: 87, down: 92 },
    },
    {
      id: 3,
      title: "Major tech company announces significant layoffs amid restructuring",
      source: "Tech Insider",
      date: "1 day ago",
      status: "verified",
      votes: { up: 245, down: 18 },
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fake":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Fake
          </Badge>
        )
      case "questionable":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600">
            <HelpCircle className="h-3 w-3" />
            Questionable
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <>
      {trendingItems.map((item) => (
        <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold line-clamp-2">{item.title}</CardTitle>
              {getStatusBadge(item.status)}
            </div>
            <CardDescription className="pt-2">
              {item.source} • {item.date}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <span>{item.votes.up}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                  <span>{item.votes.down}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/verify/${item.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

