# LegitFact - Fake News Detector

LegitFact is a modern web application designed to help users verify the authenticity of news articles, track trending misinformation, and access verified fact reports. Built with Next.js and TypeScript, it provides a user-friendly interface for combating misinformation in the digital age.

## Features

- **News Verification**: Input news headlines or articles to get AI-powered verification results
- **Trending Misinformation**: Track and view currently trending misinformation topics
- **Legit-fact Archive**: Access a comprehensive archive of verified fact reports
- **Dark Mode Support**: Built-in dark mode for comfortable viewing in any lighting condition
- **Responsive Design**: Fully responsive interface that works across all devices
- **API Key Management**: Secure management of OpenAI API keys

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom UI components with shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React

## Project Structure

```
fake-news-detector/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading state component
│   ├── globals.css        # Global styles
│   ├── archive/           # Archive page
│   ├── trending/          # Trending page
│   └── verify/            # News verification page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── archive-ui.tsx    # Archive interface
│   ├── result-card.tsx   # Result display
│   ├── testimonials.tsx  # User testimonials
│   └── navbar.tsx        # Navigation bar
├── lib/                  # Utility functions
│   ├── helper.tsx        # Helper functions
│   └── utils.ts          # General utilities
├── action/              # Server actions
│   └── queries.ts       # Database queries
└── services/            # Service layer
    ├── archive.ts       # Archive service
    └── trending.ts      # Trending service
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fake-news-detector.git
   ```

2. Install dependencies:
   ```bash
   cd fake-news-detector
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Key Setup

The application requires an OpenAI API key to function. Here's how to set it up:

1. When you first open the application, you'll see an API key input form
2. Enter your OpenAI API key in the form
3. The key will be validated automatically
4. Once validated, the key is stored securely in your browser's localStorage
5. You can update the key at any time by clearing your browser's localStorage

### Security Note
- The API key is stored locally in your browser and is never sent to any server other than OpenAI's
- The key is stored securely using localStorage
- You can clear the key at any time by clearing your browser's localStorage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Next.js and TypeScript
- UI components powered by shadcn/ui
- Icons provided by Lucide React 