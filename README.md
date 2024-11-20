# Markdown Browser Project

## Prerequisites

- Node.js (version 16 or later)
- npm or yarn package manager

## Dependencies

Install the following dependencies:

```bash
npm install react react-dom @shadcn/ui tailwindcss marked
# or
yarn add react react-dom @shadcn/ui tailwindcss marked
```

### Additional Setup

1. Install Tailwind CSS

```bash
npx tailwindcss init -p
```

2. Configure Tailwind in `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Backend API Configuration

You'll need to implement two key API endpoints:

1. `/api/markdown-files`: Returns list of markdown files
2. `/api/markdown-content/{filename}`: Returns content of specific markdown file

## Running the Website

```bash
# Development mode
npm run
# or
yarn start
```

## Folder Structure

```
/src
├── components
│   └── MarkdownBrowser.js
├── api
│   ├── markdownFiles.js
│   └── markdownContent.js
└── markdown
    └── (your project markdown files)
```

## Troubleshooting

- Ensure all dependencies are correctly installed
- Check console for any error messages
- Verify markdown files are in the correct directory


**# Install dependencies**
**npm**install next react react-dom marked tailwindcss @tailwindcss/typography

**# Install dev dependencies**
**npm**install -D postcss autoprefixer

**# Initialize Tailwind**
npx tailwindcss init -p

**# Create markdown folder**
**mkdir** markdown

**# Start development server**
**npm** run dev
