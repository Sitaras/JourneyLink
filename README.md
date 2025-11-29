# JourneyLink

JourneyLink is a comprehensive ride-sharing platform designed to connect drivers and passengers for seamless travel experiences. This monorepo contains the backend API, web application, and mobile application.

## Tech Stack

- **Monorepo Management:** Turbo, Yarn Workspaces
- **Backend:** Node.js, Express, MongoDB
- **Web Frontend:** Next.js, React, Tailwind CSS
- **Shared Packages:** TypeScript, Zod

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn (v1.22+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd JourneyLink
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Environment Setup:**

    - Copy `.env.example` to `.env` in `apps/api` and `apps/web`.
    - Configure your MongoDB URI and other environment variables.

### Running the Project

You can run the entire stack or individual applications using Turbo.

-   **Run all apps (dev mode):**

    ```bash
    yarn dev
    ```

-   **Run specific app:**

    ```bash
    yarn workspace @journey-link/api dev
    yarn workspace @journey-link/web dev
    ```

## Project Structure

-   `apps/api`: Express.js backend API
-   `apps/web`: Next.js web frontend
-   `packages/shared`: Shared TypeScript types, schemas, and utilities

## API Documentation

The API is documented using a Postman collection. You can find the `postman_collection.json` file in the root directory. Import it into Postman to explore and test the API endpoints.

### Key Endpoints

-   **Auth:** `/api/auth` (Login, Register, Logout)
-   **User:** `/api/me` (Profile, Rides)
-   **Rides:** `/api/ride` (Create, Search, Manage)
-   **Bookings:** `/api/booking` (Book, Accept, Decline)
-   **Places:** `/api/city-autocomplete`
