import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchNewsArticles } from "@/services/trending";

export default async function TrendingPage() {
  const trendingItems = await fetchNewsArticles();
  console.log(trendingItems);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fake":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Fake
          </Badge>
        );
      case "questionable":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600"
          >
            <HelpCircle className="h-3 w-3" />
            Questionable
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Trending Misinformation</h1>
      </div>

      <p className="text-muted-foreground mb-8 max-w-3xl">
        Stay informed about the latest news stories that are being fact-checked.
        This page shows trending articles that have been verified by our system
        and community.
      </p>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="fake">Fake</TabsTrigger>
          <TabsTrigger value="questionable">Questionable</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingItems.map((item) => (
              <TrendingCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="fake">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingItems
              .filter((item) => item.status === "fake")
              .map((item) => (
                <TrendingCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="questionable">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingItems
              .filter((item) => item.status === "questionable")
              .map((item) => (
                <TrendingCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="verified">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingItems
              .filter((item) => item.status === "verified")
              .map((item) => (
                <TrendingCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TrendingCard({ item }: { item: any }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fake":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Fake
          </Badge>
        );
      case "questionable":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600"
          >
            <HelpCircle className="h-3 w-3" />
            Questionable
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
          >
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">
            {item.title}
          </CardTitle>
          {getStatusBadge(item.status)}
        </div>
        <CardDescription className="pt-2">
          {item.source} • {item.date}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {item.excerpt}
        </p>
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
  );
}
