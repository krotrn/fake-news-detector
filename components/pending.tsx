import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PendingCard() {
  return (
    <Card className="mb-8">
    <CardContent className="pt-6">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-pulse mb-4">
          <Search className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">
          Verifying content...
        </h3>
        <p className="text-muted-foreground mb-4">
          This may take a few moments
        </p>
        <Progress value={45} className="w-full max-w-md" />
      </div>
    </CardContent>
  </Card>
  )
}
