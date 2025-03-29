import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Archive, CheckCircle, HelpCircle, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchArchivedNews } from "@/services/archive";

export default async function ArchivePage() {
  const archiveItems = await fetchArchivedNews();

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Archive className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Fact-Checked Archive</h1>
      </div>

      <p className="text-muted-foreground mb-8 max-w-3xl">
        Browse our comprehensive archive of fact-checked news articles. Use the filters below to find specific topics or
        categories.
      </p>

      <div className="bg-muted/40 p-6 rounded-lg mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input placeholder="Search by keyword" />
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="fake">Fake</SelectItem>
                <SelectItem value="questionable">Questionable</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {archiveItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                  <CardDescription className="pt-1">
                    {item.category} • {item.date}
                  </CardDescription>
                </div>
                {getStatusBadge(item.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-muted-foreground">{item.summary}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/verify/${item.id}`} className="w-full sm:w-auto">
                <Button variant="outline">View Full Analysis</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline" className="mx-1">
          1
        </Button>
        <Button variant="outline" className="mx-1">
          2
        </Button>
        <Button variant="outline" className="mx-1">
          3
        </Button>
        <Button variant="ghost" disabled className="mx-1">
          ...
        </Button>
        <Button variant="outline" className="mx-1">
          10
        </Button>
      </div>
    </div>
  )
}

