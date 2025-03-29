import { getStatusBadge, getStatusColor } from '@/lib/helper';
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { QueryResponse } from '@/action/queries';
import { Button } from './ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export default function ResultCard({result}:{result:QueryResponse}) {
  return (
    <Card key={result.id} className="mb-8 overflow-hidden">
    <CardHeader className="pb-3">
      <CardTitle>{result.title}</CardTitle>
      <CardDescription>Source: {result.source}</CardDescription>
    </CardHeader>
    <CardContent className="pb-3">
      <div className="flex flex-col items-center justify-center py-6 mb-6">
        {getStatusBadge(result.status)}
        <div className="w-full max-w-md mt-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>Fake</span>
            <span>Questionable</span>
            <span>Verified</span>
          </div>
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStatusColor(
                result.status
              )} transition-all duration-500 ease-in-out`}
              style={{ width: `${result.confidence}%` }}
            ></div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-muted-foreground">
              Confidence: {result.confidence}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Analysis Summary</h3>
        <p>{result.summary}</p>

        <h3 className="font-medium text-lg mt-6">Verified Against</h3>
        <ul className="space-y-2">
          {result.sources.map((source, index) => (
            <li key={index}>
              <a
                about="_blank"
                href={source.url}
                className="text-primary hover:underline"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
    <CardFooter className="border-t pt-6 flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Was this verification helpful?
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ThumbsDown className="h-4 w-4" />
          Not Helpful
        </Button>
      </div>
    </CardFooter>
  </Card>
  )
}
