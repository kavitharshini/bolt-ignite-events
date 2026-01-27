import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/Events/CreateEvent";
import EditEvent from "./pages/Events/EditEvent";
import EventList from "./pages/Events/EventList";
import EventDetails from "./pages/Events/EventDetails";
import CalendarView from "./pages/Calendar/CalendarView";
import AnalyticsDashboard from "./pages/Analytics/AnalyticsDashboard";
import AttendeesPage from "./pages/Attendees/AttendeesPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import BookingsPage from "./pages/Bookings/BookingsPage";
import AuthPage from "./pages/Auth/AuthPage";
import RoleBasedRoute from "./components/Auth/RoleBasedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <RoleBasedRoute>
                <Index />
              </RoleBasedRoute>
            } />
            <Route path="/events" element={
              <RoleBasedRoute>
                <EventList />
              </RoleBasedRoute>
            } />
            <Route path="/events/create" element={
              <RoleBasedRoute>
                <CreateEvent />
              </RoleBasedRoute>
            } />
            <Route path="/events/:id" element={
              <RoleBasedRoute>
                <EventDetails />
              </RoleBasedRoute>
            } />
            <Route path="/events/:id/edit" element={
              <RoleBasedRoute>
                <EditEvent />
              </RoleBasedRoute>
            } />
            <Route path="/calendar" element={
              <RoleBasedRoute adminOnly>
                <CalendarView />
              </RoleBasedRoute>
            } />
            <Route path="/analytics" element={
              <RoleBasedRoute adminOnly>
                <AnalyticsDashboard />
              </RoleBasedRoute>
            } />
            <Route path="/attendees" element={
              <RoleBasedRoute adminOnly>
                <AttendeesPage />
              </RoleBasedRoute>
            } />
            <Route path="/bookings" element={
              <RoleBasedRoute userOnly>
                <BookingsPage />
              </RoleBasedRoute>
            } />
            <Route path="/profile" element={
              <RoleBasedRoute>
                <ProfilePage />
              </RoleBasedRoute>
            } />
            <Route path="/settings" element={
              <RoleBasedRoute>
                <SettingsPage />
              </RoleBasedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
