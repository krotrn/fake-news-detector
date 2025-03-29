import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Testimonials() {
  return (
    <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold mb-4">
        How Our Verification Works
      </h2>
      <p className="text-muted-foreground mb-6">
        Our news verification system uses a combination of AI analysis,
        trusted source verification, and crowdsourced feedback to
        determine the credibility of news articles.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our AI system analyzes the content, language patterns, and
              claims made in the article.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Source Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We cross-reference information with trusted sources and
              fact-checking organizations.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Crowd Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              User feedback helps improve our verification system and
              provides additional context.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>

    <Separator />

    <div>
      <h2 className="text-2xl font-bold mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-lg">
            How can I contribute to the platform?
          </h3>
          <p className="text-muted-foreground">
            You can contribute by providing feedback on verifications,
            submitting articles for review, and sharing the platform with
            others.
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}
