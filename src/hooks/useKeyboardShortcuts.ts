import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts if no input is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === 'n') {
        e.preventDefault();
        navigate('/events/create');
        toast({
          title: "Quick Action",
          description: "Navigated to Create Event",
        });
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/');
            break;
          case 'e':
            e.preventDefault();
            navigate('/events');
            break;
          case 'a':
            e.preventDefault();
            navigate('/attendees');
            break;
          case 'p':
            e.preventDefault();
            navigate('/profile');
            break;
          case 's':
            e.preventDefault();
            navigate('/settings');
            break;
          case 'c':
            e.preventDefault();
            navigate('/calendar');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toast]);
};

export default useKeyboardShortcuts;