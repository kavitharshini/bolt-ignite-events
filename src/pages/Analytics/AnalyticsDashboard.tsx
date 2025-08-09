import { useState } from "react";
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, PieChart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/Dashboard/StatsCard";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock analytics data
  const analyticsData = {
    totalEvents: 156,
    totalAttendees: 12847,
    totalRevenue: 342650,
    avgAttendanceRate: 87,
    growthMetrics: {
      events: 23,
      attendees: 18,
      revenue: 31,
      attendance: 5
    },
    eventsByCategory: [
      { name: "Conferences", value: 42, color: "from-primary to-primary-light" },
      { name: "Workshops", value: 38, color: "from-secondary to-secondary-light" },
      { name: "Seminars", value: 31, color: "from-accent to-accent-light" },
      { name: "Networking", value: 28, color: "from-success to-success-light" },
      { name: "Social", value: 17, color: "from-warning to-warning-light" }
    ],
    monthlyRevenue: [
      { month: "Jan", revenue: 24500, events: 12 },
      { month: "Feb", revenue: 28200, events: 15 },
      { month: "Mar", revenue: 31800, events: 18 },
      { month: "Apr", revenue: 35600, events: 21 },
      { month: "May", revenue: 42300, events: 25 },
      { month: "Jun", revenue: 38900, events: 23 }
    ],
    topEvents: [
      { name: "Annual Tech Conference", attendees: 1250, revenue: 125000, rating: 4.8 },
      { name: "Product Launch Summit", attendees: 890, revenue: 89000, rating: 4.6 },
      { name: "Developer Workshop Series", attendees: 645, revenue: 32250, rating: 4.9 },
      { name: "Marketing Masterclass", attendees: 520, revenue: 31200, rating: 4.7 }
    ]
  };

  const timeRanges = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "1 Year", value: "1y" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
                <p className="text-muted-foreground">Track your event performance and insights</p>
              </div>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                {timeRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={timeRange === range.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Events"
                value={analyticsData.totalEvents.toLocaleString()}
                change={`+${analyticsData.growthMetrics.events}% from last month`}
                changeType="positive"
                icon={Calendar}
                gradient="primary"
              />
              
              <StatsCard
                title="Total Attendees"
                value={analyticsData.totalAttendees.toLocaleString()}
                change={`+${analyticsData.growthMetrics.attendees}% from last month`}
                changeType="positive"
                icon={Users}
                gradient="secondary"
              />
              
              <StatsCard
                title="Total Revenue"
                value={`$${analyticsData.totalRevenue.toLocaleString()}`}
                change={`+${analyticsData.growthMetrics.revenue}% from last month`}
                changeType="positive"
                icon={DollarSign}
                gradient="accent"
              />
              
              <StatsCard
                title="Avg Attendance Rate"
                value={`${analyticsData.avgAttendanceRate}%`}
                change={`+${analyticsData.growthMetrics.attendance}% from last month`}
                changeType="positive"
                icon={TrendingUp}
                gradient="success"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Chart */}
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Monthly Revenue</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium w-8">{item.month}</div>
                          <div className="flex-1 bg-muted rounded-full h-2 max-w-[200px]">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                              style={{ 
                                width: `${(item.revenue / Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue))) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.revenue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{item.events} events</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events by Category */}
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-secondary" />
                    <span>Events by Category</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.eventsByCategory.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded bg-gradient-to-r ${category.color}`} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-muted rounded-full h-2 w-20">
                            <div 
                              className={`bg-gradient-to-r ${category.color} h-2 rounded-full`}
                              style={{ 
                                width: `${(category.value / Math.max(...analyticsData.eventsByCategory.map(c => c.value))) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{category.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Events */}
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-accent" />
                  <span>Top Performing Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary font-bold rounded-full text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.attendees} attendees • Rating: {event.rating}/5.0
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${event.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 bg-gradient-to-br from-success/10 to-success/20 border-success/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">Growth Insight</span>
                  </div>
                  <p className="text-sm text-foreground">
                    Your event attendance has grown by 18% this month. Consider increasing venue capacity for future events.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium text-primary">Audience Insight</span>
                  </div>
                  <p className="text-sm text-foreground">
                    Workshops have the highest satisfaction rate at 4.9/5. Consider hosting more interactive sessions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-accent/10 to-accent/20 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span className="font-medium text-accent">Revenue Insight</span>
                  </div>
                  <p className="text-sm text-foreground">
                    Conference events generate 40% more revenue per attendee. Focus on premium conference experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;