# Nova Platform

This is a modern React web application built with [Vite](https://vitejs.dev/).

## Technologies Used

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Backend / Database:** [Supabase](https://supabase.com/)
*   **Email Services:** [EmailJS](https://www.emailjs.com/)

## Getting Started

### Prerequisites

*   Node.js (Ensure you have a recent version installed)
*   npm (Node Package Manager)

### Installation

1.  Clone the repository and navigate to the project directory.
2.  Install all dependencies:
    ```bash
    npm install
    ```

### Local Development

To start the development server with Hot Module Replacement (HMR), run:

```bash
npm run dev
```

This will launch the app, typically accessible at `http://localhost:5173`.

### Building for Production

To create an optimized production build, run:

```bash
npm run build
```

The output will be placed in the `dist` directory. To preview the built version locally, use:

```bash
npm run preview
```

## Configuration

This project relies on environment variables for sensitive integrations. Ensure you have your `.env.local` file configured in the root directory with the necessary keys (e.g., Supabase URL/Anon key, EmailJS service IDs).
