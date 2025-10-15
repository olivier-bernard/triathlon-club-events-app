# Next Cycling Events App

This is a Next.js application designed to manage and display cycling training events. The application allows users to view a list of events, register for them, and will eventually include user management.

## Features

- **Event Listing**: Users can view a list of cycling training events with details such as date, activity, number of attendees, time, event name, and distance options.
- **Event Details**: Users can click on an event to view more details, including characteristics and available distances.
- **User Registration**: Users can register for events through a dedicated registration form.
- **Future user authentication**: The application is prepared for future integration for user authentication and management, using google / Microsoft / apple ID. Maybe there will need an approval flow to validate new users,
- **Future management of events**: the users can register on events, this will be a way to add events with the possibility to let users to create events where the coach will approve. Csv ingestion for coachs, cleanup of previous events. Same way, let coach add/update the content of the workout + update the track. 
- **Server-Side Rendering**: The application utilizes server-side rendering for improved performance and SEO.
- **Database Integration**: The application connects to a database using an ORM (Prisma) to manage event data and user registrations.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd triathlon-club-events-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables by copying `.env.example` to `.env` and filling in the necessary values.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Future Enhancements

- Integrate user authentication and management.
- Implement additional features such as event filtering and user profile to enable autorized users to create events,
- Event creation and delete, using either the interface or a csv like ingestion. TBD depending on users feedback