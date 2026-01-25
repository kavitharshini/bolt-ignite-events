export interface ScheduleItem {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  description?: string;
  speaker?: string;
  location?: string;
}

export interface ScheduleConfig {
  category: string;
  eventStartTime: string;
  eventEndTime: string;
  eventDate: string;
}

const parseTime = (timeStr: string): { hours: number; minutes: number } => {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return { hours: 9, minutes: 0 };
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return { hours, minutes };
};

const formatTime = (hours: number, minutes: number): string => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const addMinutes = (hours: number, minutes: number, addMins: number): { hours: number; minutes: number } => {
  const totalMinutes = hours * 60 + minutes + addMins;
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
};

const categorySchedules: Record<string, Array<{ name: string; duration: number; description?: string }>> = {
  conference: [
    { name: "Registration & Welcome Coffee", duration: 45, description: "Check-in, badge collection, and networking" },
    { name: "Opening Ceremony", duration: 30, description: "Welcome address and event overview" },
    { name: "Keynote Address", duration: 60, description: "Featured speaker presentation" },
    { name: "Coffee Break & Networking", duration: 20 },
    { name: "Panel Discussion", duration: 45, description: "Expert panel on industry trends" },
    { name: "Breakout Sessions - Track A", duration: 60, description: "Specialized topic discussions" },
    { name: "Lunch Break & Exhibition", duration: 60, description: "Networking lunch and sponsor exhibits" },
    { name: "Workshop Session 1", duration: 45, description: "Hands-on interactive workshop" },
    { name: "Refreshment Break", duration: 15 },
    { name: "Workshop Session 2", duration: 45, description: "Advanced workshop track" },
    { name: "Fireside Chat", duration: 30, description: "Intimate conversation with industry leader" },
    { name: "Networking Hour", duration: 45, description: "Open networking with refreshments" },
    { name: "Closing Remarks & Awards", duration: 30, description: "Summary and recognition ceremony" },
  ],
  workshop: [
    { name: "Registration & Setup", duration: 30, description: "Materials distribution and workstation setup" },
    { name: "Introduction & Overview", duration: 20, description: "Workshop objectives and agenda" },
    { name: "Module 1: Fundamentals", duration: 60, description: "Core concepts and foundational knowledge" },
    { name: "Short Break", duration: 10 },
    { name: "Hands-on Exercise 1", duration: 45, description: "Practical application of fundamentals" },
    { name: "Refreshment Break", duration: 15 },
    { name: "Module 2: Advanced Techniques", duration: 50, description: "Building on foundational skills" },
    { name: "Hands-on Exercise 2", duration: 45, description: "Complex scenario practice" },
    { name: "Lunch Break", duration: 45, description: "Networking and informal discussions" },
    { name: "Module 3: Real-World Application", duration: 45, description: "Case studies and best practices" },
    { name: "Group Project Work", duration: 60, description: "Collaborative team exercise" },
    { name: "Project Presentations", duration: 30, description: "Team demonstrations and feedback" },
    { name: "Q&A and Wrap-up", duration: 20, description: "Final questions and certification" },
  ],
  seminar: [
    { name: "Arrival & Registration", duration: 30, description: "Welcome and seating" },
    { name: "Welcome Address", duration: 15, description: "Host introduction" },
    { name: "Main Presentation Part 1", duration: 45, description: "Primary topic exploration" },
    { name: "Q&A Session 1", duration: 15, description: "Audience questions" },
    { name: "Coffee Break", duration: 20 },
    { name: "Main Presentation Part 2", duration: 45, description: "Advanced topic deep-dive" },
    { name: "Interactive Discussion", duration: 30, description: "Group discussion and insights" },
    { name: "Light Refreshments", duration: 30 },
    { name: "Case Study Analysis", duration: 40, description: "Real-world examples" },
    { name: "Open Forum", duration: 25, description: "Audience-led discussion" },
    { name: "Closing Summary", duration: 15, description: "Key takeaways and next steps" },
  ],
  networking: [
    { name: "Doors Open & Welcome Drinks", duration: 30, description: "Arrival and initial mingling" },
    { name: "Host Welcome", duration: 10, description: "Brief introduction and ice-breaker" },
    { name: "Speed Networking Round 1", duration: 30, description: "Structured introductions" },
    { name: "Refreshment Break", duration: 15 },
    { name: "Speed Networking Round 2", duration: 30, description: "New connections round" },
    { name: "Featured Speaker/Sponsor Spotlight", duration: 15, description: "Brief presentation" },
    { name: "Open Networking", duration: 60, description: "Free-form networking with canapés" },
    { name: "Interactive Activity", duration: 20, description: "Group challenge or game" },
    { name: "Cocktail Hour", duration: 45, description: "Drinks and continued networking" },
    { name: "Closing Announcements", duration: 10, description: "Upcoming events and thank you" },
  ],
  wedding: [
    { name: "Guest Arrival & Welcome Drinks", duration: 45, description: "Guests arrive, welcome beverages served" },
    { name: "Seating & Pre-ceremony Music", duration: 15, description: "Guests take their seats" },
    { name: "Wedding Ceremony", duration: 45, description: "Main ceremony with vows and rituals" },
    { name: "Photo Session (Couple)", duration: 30, description: "Professional photography" },
    { name: "Cocktail Hour", duration: 60, description: "Guests enjoy drinks and hors d'oeuvres" },
    { name: "Grand Entrance & Introductions", duration: 15, description: "Wedding party introduction" },
    { name: "First Dance", duration: 10, description: "Couple's first dance" },
    { name: "Welcome Speeches", duration: 20, description: "Parents and host addresses" },
    { name: "Dinner Service", duration: 75, description: "Multi-course meal service" },
    { name: "Toasts & Speeches", duration: 25, description: "Best man, maid of honor speeches" },
    { name: "Cake Cutting Ceremony", duration: 15 },
    { name: "Parent Dances", duration: 15, description: "Father-daughter, mother-son dances" },
    { name: "Open Dancing & Celebration", duration: 120, description: "DJ/Band and party time" },
    { name: "Bouquet & Garter Toss", duration: 15 },
    { name: "Last Dance & Send-off", duration: 20, description: "Farewell and sparkler exit" },
  ],
  corporate: [
    { name: "Registration & Breakfast", duration: 45, description: "Check-in with light breakfast" },
    { name: "CEO Welcome Address", duration: 20, description: "Leadership opening remarks" },
    { name: "Company Vision & Strategy", duration: 45, description: "Annual goals and direction" },
    { name: "Department Updates", duration: 60, description: "Team presentations" },
    { name: "Coffee Break & Networking", duration: 20 },
    { name: "Guest Speaker / Training Session", duration: 50, description: "External expertise or skill development" },
    { name: "Team Building Activity", duration: 45, description: "Interactive group exercise" },
    { name: "Lunch & Awards Recognition", duration: 75, description: "Meal with employee recognition" },
    { name: "Workshop Breakouts", duration: 60, description: "Specialized department sessions" },
    { name: "Innovation Showcase", duration: 30, description: "New projects and initiatives" },
    { name: "Afternoon Refreshments", duration: 15 },
    { name: "Q&A with Leadership", duration: 30, description: "Open town hall discussion" },
    { name: "Closing Remarks & Next Steps", duration: 20 },
    { name: "Evening Social / Dinner", duration: 90, description: "Informal networking dinner" },
  ],
  social: [
    { name: "Venue Opens & Welcome", duration: 30, description: "Guests arrive and settle in" },
    { name: "Welcome Drinks Reception", duration: 30, description: "Initial mingling with beverages" },
    { name: "Host Welcome Speech", duration: 10, description: "Event introduction" },
    { name: "Icebreaker Activity", duration: 20, description: "Fun group activity" },
    { name: "Entertainment / Performance", duration: 30, description: "Live music, comedy, or show" },
    { name: "Dinner / Food Service", duration: 60, description: "Main meal or buffet" },
    { name: "Guest Speeches / Toasts", duration: 20, description: "Special acknowledgments" },
    { name: "Games & Activities", duration: 45, description: "Interactive entertainment" },
    { name: "Dessert & Coffee", duration: 20 },
    { name: "Dancing / DJ Set", duration: 90, description: "Music and celebration" },
    { name: "Wind Down & Farewell", duration: 20, description: "Closing and thank you" },
  ],
  other: [
    { name: "Venue Setup & Registration", duration: 30, description: "Initial setup and check-in" },
    { name: "Welcome & Introduction", duration: 15, description: "Event kick-off" },
    { name: "Opening Session", duration: 45, description: "Main opening activity" },
    { name: "Break", duration: 15 },
    { name: "Core Activity Block 1", duration: 60, description: "Primary event activities" },
    { name: "Refreshments", duration: 20 },
    { name: "Core Activity Block 2", duration: 60, description: "Continued main activities" },
    { name: "Lunch/Meal Break", duration: 45 },
    { name: "Afternoon Session 1", duration: 50, description: "Post-meal activities" },
    { name: "Short Break", duration: 10 },
    { name: "Afternoon Session 2", duration: 50, description: "Final activity block" },
    { name: "Wrap-up & Networking", duration: 30, description: "Closing activities" },
    { name: "Event Close", duration: 15, description: "Thank you and departure" },
  ],
};

export const generateSchedule = (config: ScheduleConfig): ScheduleItem[] => {
  const { category, eventStartTime, eventEndTime } = config;
  
  const start = parseTime(eventStartTime);
  const end = parseTime(eventEndTime);
  
  const totalEventMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
  
  // Get template for category (lowercase match)
  const normalizedCategory = category.toLowerCase().trim();
  const template = categorySchedules[normalizedCategory] || categorySchedules.other;
  
  // Calculate total template duration
  const templateTotalMinutes = template.reduce((sum, item) => sum + item.duration, 0);
  
  // Scale factor to fit the event duration
  const scaleFactor = totalEventMinutes / templateTotalMinutes;
  
  const schedule: ScheduleItem[] = [];
  let currentTime = { ...start };
  
  template.forEach((item, index) => {
    // Scale duration proportionally, minimum 5 minutes
    const scaledDuration = Math.max(5, Math.round(item.duration * scaleFactor));
    
    const startTimeStr = formatTime(currentTime.hours, currentTime.minutes);
    const endTimePoint = addMinutes(currentTime.hours, currentTime.minutes, scaledDuration);
    const endTimeStr = formatTime(endTimePoint.hours, endTimePoint.minutes);
    
    schedule.push({
      id: `sched_${index}_${Date.now()}`,
      name: item.name,
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: scaledDuration,
      description: item.description,
    });
    
    currentTime = endTimePoint;
  });
  
  return schedule;
};

export const createCustomScheduleItem = (
  name: string,
  startTime: string,
  durationMinutes: number,
  description?: string
): ScheduleItem => {
  const start = parseTime(startTime);
  const end = addMinutes(start.hours, start.minutes, durationMinutes);
  
  return {
    id: `sched_custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    startTime: formatTime(start.hours, start.minutes),
    endTime: formatTime(end.hours, end.minutes),
    duration: durationMinutes,
    description,
  };
};

export const getAvailableCategories = (): string[] => {
  return Object.keys(categorySchedules).map(
    cat => cat.charAt(0).toUpperCase() + cat.slice(1)
  );
};
