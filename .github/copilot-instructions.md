<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Store Mobile App - React Native Project

This is a React Native mobile application built with Expo that connects to an ASP.NET Core Web API backend for store management.

## Project Structure
- **src/screens/**: Contains all screen components for Customers, Products, and Invoices
- **src/redux/**: Redux store setup with slices for state management
- **src/services/**: API service functions using Axios
- **src/components/**: Reusable UI components
- **src/navigation/**: React Navigation setup

## Key Technologies
- React Native with Expo
- Redux Toolkit for state management
- React Navigation for navigation
- Axios for API calls
- React Native Vector Icons

## API Integration
The app integrates with an ASP.NET Core Web API backend with the following endpoints:
- `/api/Customer` - Customer management
- `/api/Product` - Product management  
- `/api/Invoice` - Invoice management

## Development Guidelines
- Use functional components with hooks
- Follow Redux patterns with async thunks
- Implement proper error handling and loading states
- Use consistent styling with StyleSheet
- Follow React Navigation best practices
