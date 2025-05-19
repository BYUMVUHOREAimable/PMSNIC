# Vehicle Management System

The Vehicle Management System is a web application for managing vehicles, parking slots, and slot reservation requests. Users can register vehicles, create and manage parking slots, and request parking slots for their vehicles. Admins can approve or reject slot requests and assign compatible slots based on vehicle type and size. The system features a user-friendly React frontend and a robust Node.js/Express backend with Prisma for database management.

Features

## Vehicle Management





### Register Vehicle:
 Users can add vehicles with details like plate number, model, type, size, and color.



### List Vehicles: 
View a paginated list of registered vehicles with search by plate, model, or type.



### User-Specific: 
Vehicles are tied to the authenticated user.

Parking Slot Management





### Create Parking Slot:
 Admins or users can add parking slots with slot code, size, vehicle type, location, and status (available/unavailable).



### List Parking Slots:
 View a paginated list of all parking slots with search by slot code, vehicle type, or size.



#### Global Access:
 Parking slots are not user-specific, accessible to all users.

## Slot Request Management





#### Create Request: Users can request a parking slot for a registered vehicle by selecting its ID.



#### Admin Approval/Rejection: Admins can approve (assign a compatible slot) or reject requests.



### Automatic Slot Assignment: Upon approval, the system assigns a slot based on vehicle type and size compatibility (not yet implemented in provided code).



### List Requests: Paginated list of slot requests with search by status (pending, approved, rejected) or vehicle details (not yet implemented).

## Technical Features





### Backend:
 Node.js with Express, Prisma ORM, and PostgreSQL.



### Frontend:
 React with TypeScript, Mantine for UI components, React Hook Form for forms, and Yup for validation.



### Authentication: 
User authentication with role-based access (USER, ADMIN).



### Search:
 Case-insensitive search with debounced real-time updates.



### Pagination:
 Paginated data tables for vehicles, parking slots, and (future) requests.


 # SERVER
PORT =3000

DATABASE_URL=postgresql://nicola@localhost:5432/parking?schema=public

# JWT
JWT_SECRET_KEY = "secret"
JWT_EXPIRES_IN = 86400

EMAIL_USER=fatepepe66@gmail.com
EMAIL_PASS=vayh ynaf ndoe gbsupost


